import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";

const LAUNCH_FEEDBACK_SCHEMA = "tpm.launch.feedback.v1";
const LAUNCH_FEEDBACK_KIND = "data_state_updated";
const LAUNCH_FEEDBACK_SCOPE = "platform";
const LAUNCH_FEEDBACK_MESSAGE = "Closed beta feedback captured.";

const FEEDBACK_CATEGORIES = [
  "usability",
  "stability",
  "support",
  "trust",
  "feature_gap",
] as const;
const FEEDBACK_SEVERITIES = ["low", "medium", "high"] as const;

type LaunchFeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];
type LaunchFeedbackSeverity = (typeof FEEDBACK_SEVERITIES)[number];

type LaunchFeedbackMetadata = {
  schema: typeof LAUNCH_FEEDBACK_SCHEMA;
  category: LaunchFeedbackCategory;
  severity: LaunchFeedbackSeverity;
  summary: string;
  detail: string | null;
  source: "closed_beta_feedback";
  submittedAt: string;
};

export type LaunchFeedbackMutationInput = {
  category: LaunchFeedbackCategory;
  severity: LaunchFeedbackSeverity;
  summary: string;
  detail?: string | null;
};

export type LaunchFeedbackSnapshot = {
  checkedAt: string;
  mode: "closed_beta_feedback";
  intake: {
    route: "/api/launch/feedback";
    auth: "required";
    queue: "operator_review";
    source: "account_scoped_audit";
  };
  summary: {
    submissions30d: number;
    lastSubmittedAt: string | null;
    latestSeverity: LaunchFeedbackSeverity | null;
    latestCategory: LaunchFeedbackCategory | null;
  };
  recent: Array<{
    id: string;
    category: LaunchFeedbackCategory;
    severity: LaunchFeedbackSeverity;
    summary: string;
    submittedAt: string;
  }>;
  truth: {
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    liveExecution: "blocked";
    billing: "inactive";
  };
  limitations: string[];
};

function isFeedbackCategory(value: string | null | undefined): value is LaunchFeedbackCategory {
  return FEEDBACK_CATEGORIES.includes(value as LaunchFeedbackCategory);
}

function isFeedbackSeverity(value: string | null | undefined): value is LaunchFeedbackSeverity {
  return FEEDBACK_SEVERITIES.includes(value as LaunchFeedbackSeverity);
}

function normalizeSummary(value: string | null | undefined) {
  return (value ?? "").trim().slice(0, 280);
}

function normalizeDetail(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 2000);
}

function parseLaunchFeedbackMetadata(
  metadataJson: string | null | undefined
): LaunchFeedbackMetadata | null {
  if (!metadataJson) return null;

  try {
    const parsed = JSON.parse(metadataJson) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;

    if (record.schema !== LAUNCH_FEEDBACK_SCHEMA) return null;

    const category = typeof record.category === "string" ? record.category : null;
    const severity = typeof record.severity === "string" ? record.severity : null;
    const summary = typeof record.summary === "string" ? normalizeSummary(record.summary) : "";
    const detail = typeof record.detail === "string" ? normalizeDetail(record.detail) : null;
    const submittedAt =
      typeof record.submittedAt === "string" ? record.submittedAt : new Date().toISOString();

    if (!isFeedbackCategory(category) || !isFeedbackSeverity(severity) || summary.length === 0) {
      return null;
    }

    return {
      schema: LAUNCH_FEEDBACK_SCHEMA,
      category,
      severity,
      summary,
      detail,
      source: "closed_beta_feedback",
      submittedAt,
    };
  } catch {
    return null;
  }
}

function buildSnapshot(input: {
  checkedAt: string;
  submissions30d: number;
  recentEvents: Array<{
    id: string;
    createdAt: Date;
    metadataJson: string | null;
  }>;
}): LaunchFeedbackSnapshot {
  const parsedRecent = input.recentEvents
    .map((event) => {
      const metadata = parseLaunchFeedbackMetadata(event.metadataJson);
      if (!metadata) return null;

      return {
        id: event.id,
        category: metadata.category,
        severity: metadata.severity,
        summary: metadata.summary,
        submittedAt: metadata.submittedAt || event.createdAt.toISOString(),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const latest = parsedRecent[0] ?? null;

  return {
    checkedAt: input.checkedAt,
    mode: "closed_beta_feedback",
    intake: {
      route: "/api/launch/feedback",
      auth: "required",
      queue: "operator_review",
      source: "account_scoped_audit",
    },
    summary: {
      submissions30d: input.submissions30d,
      lastSubmittedAt: latest?.submittedAt ?? null,
      latestSeverity: latest?.severity ?? null,
      latestCategory: latest?.category ?? null,
    },
    recent: parsedRecent,
    truth: {
      launchClaim: "not_launched",
      publicLaunchClaim: "not_claimed",
      liveExecution: "blocked",
      billing: "inactive",
    },
    limitations: [
      "Feedback capture records operator-reviewed closed-beta observations only.",
      "Feedback intake does not imply public support channels are enabled.",
      "Submitting feedback cannot enable live execution, real-money routing, or billing.",
    ],
  };
}

export async function getLaunchFeedbackSnapshotForAuthenticatedSession(
  session: AuthenticatedSession,
  checkedAt = new Date().toISOString()
): Promise<LaunchFeedbackSnapshot> {
  const [submissions30d, recentEvents] = await Promise.all([
    prisma.auditEvent.count({
      where: {
        accountId: session.account.id,
        kind: LAUNCH_FEEDBACK_KIND,
        scope: LAUNCH_FEEDBACK_SCOPE,
        message: LAUNCH_FEEDBACK_MESSAGE,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.auditEvent.findMany({
      where: {
        accountId: session.account.id,
        kind: LAUNCH_FEEDBACK_KIND,
        scope: LAUNCH_FEEDBACK_SCOPE,
        message: LAUNCH_FEEDBACK_MESSAGE,
      },
      orderBy: [{ createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        createdAt: true,
        metadataJson: true,
      },
    }),
  ]);

  return buildSnapshot({
    checkedAt,
    submissions30d,
    recentEvents,
  });
}

export async function createLaunchFeedbackForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  feedback: LaunchFeedbackMutationInput;
  checkedAt?: string;
}) {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const metadata: LaunchFeedbackMetadata = {
    schema: LAUNCH_FEEDBACK_SCHEMA,
    category: input.feedback.category,
    severity: input.feedback.severity,
    summary: normalizeSummary(input.feedback.summary),
    detail: normalizeDetail(input.feedback.detail),
    source: "closed_beta_feedback",
    submittedAt: checkedAt,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.session.user.id,
      accountId: input.session.account.id,
      kind: LAUNCH_FEEDBACK_KIND,
      scope: LAUNCH_FEEDBACK_SCOPE,
      actorRole: "owner",
      accountMode: "demo",
      message: LAUNCH_FEEDBACK_MESSAGE,
      metadataJson: JSON.stringify(metadata),
    },
  });

  return getLaunchFeedbackSnapshotForAuthenticatedSession(input.session, checkedAt);
}

export function isLaunchFeedbackMutationInput(
  value: unknown
): value is LaunchFeedbackMutationInput {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const category = typeof record.category === "string" ? record.category : null;
  const severity = typeof record.severity === "string" ? record.severity : null;
  const summary = typeof record.summary === "string" ? normalizeSummary(record.summary) : "";

  return (
    isFeedbackCategory(category) &&
    isFeedbackSeverity(severity) &&
    summary.length > 0
  );
}

export async function getLaunchFeedbackStoreDiagnostics(input?: {
  checkedAt?: string;
}) {
  const checkedAt = input?.checkedAt ?? new Date().toISOString();
  const feedbackEvents30d = await prisma.auditEvent.count({
    where: {
      kind: LAUNCH_FEEDBACK_KIND,
      scope: LAUNCH_FEEDBACK_SCOPE,
      message: LAUNCH_FEEDBACK_MESSAGE,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return {
    checkedAt,
    feedbackEvents30d,
    feedbackStore: "local_audit",
  } as const;
}
