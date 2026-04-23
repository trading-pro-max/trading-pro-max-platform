import "server-only";
import { randomUUID } from "node:crypto";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";

const LAUNCH_FEEDBACK_SCHEMA_V1 = "tpm.launch.feedback.v1";
const LAUNCH_FEEDBACK_SCHEMA_V2 = "tpm.launch.feedback.v2";
const LAUNCH_FEEDBACK_KIND = "data_state_updated";
const LAUNCH_FEEDBACK_SCOPE = "platform";
const LAUNCH_FEEDBACK_SUBMISSION_MESSAGE = "Closed beta feedback captured.";
const LAUNCH_FEEDBACK_LIFECYCLE_MESSAGE =
  "Closed beta feedback lifecycle updated.";
const FEEDBACK_LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000;

const FEEDBACK_CATEGORIES = [
  "usability",
  "stability",
  "support",
  "trust",
  "feature_gap",
] as const;
const FEEDBACK_SEVERITIES = ["low", "medium", "high"] as const;
const FEEDBACK_LIFECYCLE_STATES = [
  "submitted",
  "triaged",
  "hardening_in_progress",
  "resolved",
  "deferred",
] as const;
const FEEDBACK_SUPPORT_LANES = [
  "operator_review",
  "operator_incident_review",
] as const;
const FEEDBACK_HARDENING_TARGETS = ["none", "ops_hardening", "ops_recovery"] as const;

type LaunchFeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];
type LaunchFeedbackSeverity = (typeof FEEDBACK_SEVERITIES)[number];
export type LaunchFeedbackLifecycleState =
  (typeof FEEDBACK_LIFECYCLE_STATES)[number];
type LaunchFeedbackSupportLane = (typeof FEEDBACK_SUPPORT_LANES)[number];
type LaunchFeedbackHardeningTarget =
  (typeof FEEDBACK_HARDENING_TARGETS)[number];

type LaunchFeedbackSubmissionMetadataV2 = {
  schema: typeof LAUNCH_FEEDBACK_SCHEMA_V2;
  eventType: "submission";
  feedbackId: string;
  category: LaunchFeedbackCategory;
  severity: LaunchFeedbackSeverity;
  summary: string;
  detail: string | null;
  lifecycleState: "submitted";
  supportLane: LaunchFeedbackSupportLane;
  hardeningTarget: LaunchFeedbackHardeningTarget;
  source: "closed_beta_feedback";
  submittedAt: string;
  updatedAt: string;
};

type LaunchFeedbackLifecycleMetadataV2 = {
  schema: typeof LAUNCH_FEEDBACK_SCHEMA_V2;
  eventType: "lifecycle_update";
  feedbackId: string;
  previousLifecycleState: LaunchFeedbackLifecycleState;
  lifecycleState: LaunchFeedbackLifecycleState;
  reviewNote: string | null;
  supportLane: LaunchFeedbackSupportLane;
  hardeningTarget: LaunchFeedbackHardeningTarget;
  source: "closed_beta_feedback";
  updatedAt: string;
  updatedByUserId: string | null;
  updatedByAccountId: string | null;
};

export type LaunchFeedbackMutationInput = {
  category: LaunchFeedbackCategory;
  severity: LaunchFeedbackSeverity;
  summary: string;
  detail?: string | null;
};

export type LaunchFeedbackLifecycleMutationInput = {
  feedbackId: string;
  lifecycleState: LaunchFeedbackLifecycleState;
  reviewNote?: string | null;
};

export type LaunchFeedbackLifecycleUpdateResult = {
  ok: boolean;
  reason:
    | "feedback_lifecycle_updated"
    | "feedback_not_found"
    | "invalid_feedback_lifecycle_transition";
  snapshot: LaunchFeedbackSnapshot;
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
    lifecycleUpdates30d: number;
    openItems: number;
    pendingTriage: number;
    hardeningInProgress: number;
    highSeverityOpen: number;
    lastSubmittedAt: string | null;
    lastLifecycleUpdateAt: string | null;
    latestSeverity: LaunchFeedbackSeverity | null;
    latestCategory: LaunchFeedbackCategory | null;
  };
  triage: {
    contract: "beta_feedback_hardening_loop";
    queue: {
      submitted: number;
      triaged: number;
      hardeningInProgress: number;
      resolved: number;
      deferred: number;
    };
    hardeningFollowUps: number;
    recoveryLinked: number;
    hardeningRoute: "/api/ops/hardening";
    recoveryRoute: "/api/ops/recovery";
    escalation: "manual_operator_triage";
  };
  support: {
    mode: "closed_beta_support_guarded";
    lane: "operator_review";
    incidentLane: "operator_incident_review";
    responseSlaHours: number;
    feedbackRoute: "/api/launch/feedback";
    escalationRoute: "/api/ops/recovery";
  };
  recent: Array<{
    id: string;
    feedbackId: string;
    category: LaunchFeedbackCategory;
    severity: LaunchFeedbackSeverity;
    summary: string;
    lifecycleState: LaunchFeedbackLifecycleState;
    supportLane: LaunchFeedbackSupportLane;
    hardeningTarget: LaunchFeedbackHardeningTarget;
    submittedAt: string;
    updatedAt: string;
    reviewNote: string | null;
  }>;
  truth: {
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    liveExecution: "blocked";
    billing: "inactive";
  };
  limitations: string[];
};

type FeedbackEventRecord = {
  id: string;
  createdAt: Date;
  message: string;
  metadataJson: string | null;
};

type ParsedFeedbackSubmissionEvent = {
  eventType: "submission";
  eventId: string;
  feedbackId: string;
  category: LaunchFeedbackCategory;
  severity: LaunchFeedbackSeverity;
  summary: string;
  detail: string | null;
  lifecycleState: "submitted";
  supportLane: LaunchFeedbackSupportLane;
  hardeningTarget: LaunchFeedbackHardeningTarget;
  submittedAt: string;
  updatedAt: string;
  createdAt: string;
};

type ParsedFeedbackLifecycleEvent = {
  eventType: "lifecycle_update";
  eventId: string;
  feedbackId: string;
  previousLifecycleState: LaunchFeedbackLifecycleState;
  lifecycleState: LaunchFeedbackLifecycleState;
  reviewNote: string | null;
  supportLane: LaunchFeedbackSupportLane;
  hardeningTarget: LaunchFeedbackHardeningTarget;
  updatedAt: string;
  createdAt: string;
};

type ParsedFeedbackEvent =
  | ParsedFeedbackSubmissionEvent
  | ParsedFeedbackLifecycleEvent;

type AggregatedFeedbackRecord = {
  id: string;
  feedbackId: string;
  category: LaunchFeedbackCategory;
  severity: LaunchFeedbackSeverity;
  summary: string;
  detail: string | null;
  lifecycleState: LaunchFeedbackLifecycleState;
  supportLane: LaunchFeedbackSupportLane;
  hardeningTarget: LaunchFeedbackHardeningTarget;
  submittedAt: string;
  updatedAt: string;
  reviewNote: string | null;
};

type FeedbackQueueBreakdown = {
  submitted: number;
  triaged: number;
  hardeningInProgress: number;
  resolved: number;
  deferred: number;
};

type FeedbackAggregate = {
  records: AggregatedFeedbackRecord[];
  recordsById: Map<string, AggregatedFeedbackRecord>;
  queue: FeedbackQueueBreakdown;
  openCount: number;
  pendingTriage: number;
  hardeningInProgress: number;
  highSeverityOpen: number;
  hardeningFollowUpCount: number;
  recoveryLinkedCount: number;
  lastSubmittedAt: string | null;
  lastLifecycleUpdateAt: string | null;
  latestSeverity: LaunchFeedbackSeverity | null;
  latestCategory: LaunchFeedbackCategory | null;
};

const FEEDBACK_LIFECYCLE_TRANSITIONS: Record<
  LaunchFeedbackLifecycleState,
  LaunchFeedbackLifecycleState[]
> = {
  submitted: ["triaged", "deferred", "resolved"],
  triaged: ["hardening_in_progress", "resolved", "deferred"],
  hardening_in_progress: ["resolved", "deferred", "triaged"],
  resolved: ["triaged"],
  deferred: ["triaged", "resolved"],
};

function isFeedbackCategory(
  value: string | null | undefined
): value is LaunchFeedbackCategory {
  return FEEDBACK_CATEGORIES.includes(value as LaunchFeedbackCategory);
}

function isFeedbackSeverity(
  value: string | null | undefined
): value is LaunchFeedbackSeverity {
  return FEEDBACK_SEVERITIES.includes(value as LaunchFeedbackSeverity);
}

function isFeedbackLifecycleState(
  value: string | null | undefined
): value is LaunchFeedbackLifecycleState {
  return FEEDBACK_LIFECYCLE_STATES.includes(value as LaunchFeedbackLifecycleState);
}

function isFeedbackSupportLane(
  value: string | null | undefined
): value is LaunchFeedbackSupportLane {
  return FEEDBACK_SUPPORT_LANES.includes(value as LaunchFeedbackSupportLane);
}

function isFeedbackHardeningTarget(
  value: string | null | undefined
): value is LaunchFeedbackHardeningTarget {
  return FEEDBACK_HARDENING_TARGETS.includes(value as LaunchFeedbackHardeningTarget);
}

function normalizeSummary(value: string | null | undefined) {
  return (value ?? "").trim().slice(0, 280);
}

function normalizeDetail(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 2000);
}

function normalizeReviewNote(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 500);
}

function normalizeFeedbackId(value: string | null | undefined) {
  const normalized = (value ?? "").trim();
  if (normalized.length === 0) return "";
  return normalized.slice(0, 96);
}

function isOpenLifecycleState(state: LaunchFeedbackLifecycleState) {
  return state !== "resolved" && state !== "deferred";
}

function resolveHardeningTarget(input: {
  severity: LaunchFeedbackSeverity;
  lifecycleState: LaunchFeedbackLifecycleState;
}): LaunchFeedbackHardeningTarget {
  if (!isOpenLifecycleState(input.lifecycleState)) return "none";

  if (input.severity === "high") {
    return input.lifecycleState === "hardening_in_progress"
      ? "ops_hardening"
      : "ops_recovery";
  }

  if (
    input.lifecycleState === "triaged" ||
    input.lifecycleState === "hardening_in_progress"
  ) {
    return "ops_hardening";
  }

  return "none";
}

function resolveSupportLane(input: {
  severity: LaunchFeedbackSeverity;
  lifecycleState: LaunchFeedbackLifecycleState;
}): LaunchFeedbackSupportLane {
  if (input.severity === "high" && isOpenLifecycleState(input.lifecycleState)) {
    return "operator_incident_review";
  }
  return "operator_review";
}

function isAllowedLifecycleTransition(
  fromState: LaunchFeedbackLifecycleState,
  toState: LaunchFeedbackLifecycleState
) {
  if (fromState === toState) return true;
  return FEEDBACK_LIFECYCLE_TRANSITIONS[fromState].includes(toState);
}

function parseSubmissionFromV1(input: {
  event: FeedbackEventRecord;
  metadata: Record<string, unknown>;
}): ParsedFeedbackSubmissionEvent | null {
  if (input.metadata.schema !== LAUNCH_FEEDBACK_SCHEMA_V1) return null;

  const category =
    typeof input.metadata.category === "string" ? input.metadata.category : null;
  const severity =
    typeof input.metadata.severity === "string" ? input.metadata.severity : null;
  const summary =
    typeof input.metadata.summary === "string"
      ? normalizeSummary(input.metadata.summary)
      : "";
  const detail =
    typeof input.metadata.detail === "string"
      ? normalizeDetail(input.metadata.detail)
      : null;
  const submittedAt =
    typeof input.metadata.submittedAt === "string"
      ? input.metadata.submittedAt
      : input.event.createdAt.toISOString();

  if (!isFeedbackCategory(category) || !isFeedbackSeverity(severity) || summary.length === 0) {
    return null;
  }

  const lifecycleState = "submitted" as const;

  return {
    eventType: "submission",
    eventId: input.event.id,
    feedbackId: input.event.id,
    category,
    severity,
    summary,
    detail,
    lifecycleState,
    supportLane: resolveSupportLane({ severity, lifecycleState }),
    hardeningTarget: resolveHardeningTarget({ severity, lifecycleState }),
    submittedAt,
    updatedAt: submittedAt,
    createdAt: input.event.createdAt.toISOString(),
  };
}

function parseV2Event(input: {
  event: FeedbackEventRecord;
  metadata: Record<string, unknown>;
}): ParsedFeedbackEvent | null {
  if (input.metadata.schema !== LAUNCH_FEEDBACK_SCHEMA_V2) return null;

  const eventType =
    typeof input.metadata.eventType === "string" ? input.metadata.eventType : null;

  if (eventType === "submission") {
    const category =
      typeof input.metadata.category === "string" ? input.metadata.category : null;
    const severity =
      typeof input.metadata.severity === "string" ? input.metadata.severity : null;
    const summary =
      typeof input.metadata.summary === "string"
        ? normalizeSummary(input.metadata.summary)
        : "";
    const detail =
      typeof input.metadata.detail === "string"
        ? normalizeDetail(input.metadata.detail)
        : null;
    const feedbackId =
      typeof input.metadata.feedbackId === "string"
        ? normalizeFeedbackId(input.metadata.feedbackId)
        : input.event.id;
    const submittedAt =
      typeof input.metadata.submittedAt === "string"
        ? input.metadata.submittedAt
        : input.event.createdAt.toISOString();
    const updatedAt =
      typeof input.metadata.updatedAt === "string"
        ? input.metadata.updatedAt
        : submittedAt;

    if (
      !feedbackId ||
      !isFeedbackCategory(category) ||
      !isFeedbackSeverity(severity) ||
      summary.length === 0
    ) {
      return null;
    }

    const lifecycleState = "submitted" as const;

    return {
      eventType: "submission",
      eventId: input.event.id,
      feedbackId,
      category,
      severity,
      summary,
      detail,
      lifecycleState,
      supportLane: resolveSupportLane({ severity, lifecycleState }),
      hardeningTarget: resolveHardeningTarget({ severity, lifecycleState }),
      submittedAt,
      updatedAt,
      createdAt: input.event.createdAt.toISOString(),
    };
  }

  if (eventType === "lifecycle_update") {
    const feedbackId =
      typeof input.metadata.feedbackId === "string"
        ? normalizeFeedbackId(input.metadata.feedbackId)
        : "";
    const lifecycleState =
      typeof input.metadata.lifecycleState === "string"
        ? input.metadata.lifecycleState
        : null;
    const previousLifecycleState =
      typeof input.metadata.previousLifecycleState === "string"
        ? input.metadata.previousLifecycleState
        : null;
    const reviewNote =
      typeof input.metadata.reviewNote === "string"
        ? normalizeReviewNote(input.metadata.reviewNote)
        : null;
    const supportLane =
      typeof input.metadata.supportLane === "string"
        ? input.metadata.supportLane
        : null;
    const hardeningTarget =
      typeof input.metadata.hardeningTarget === "string"
        ? input.metadata.hardeningTarget
        : null;
    const updatedAt =
      typeof input.metadata.updatedAt === "string"
        ? input.metadata.updatedAt
        : input.event.createdAt.toISOString();

    if (
      !feedbackId ||
      !isFeedbackLifecycleState(lifecycleState) ||
      !isFeedbackLifecycleState(previousLifecycleState) ||
      !isFeedbackSupportLane(supportLane) ||
      !isFeedbackHardeningTarget(hardeningTarget)
    ) {
      return null;
    }

    return {
      eventType: "lifecycle_update",
      eventId: input.event.id,
      feedbackId,
      lifecycleState,
      previousLifecycleState,
      reviewNote,
      supportLane,
      hardeningTarget,
      updatedAt,
      createdAt: input.event.createdAt.toISOString(),
    };
  }

  return null;
}

function parseFeedbackEvent(event: FeedbackEventRecord): ParsedFeedbackEvent | null {
  if (!event.metadataJson) return null;

  try {
    const parsed = JSON.parse(event.metadataJson) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const metadata = parsed as Record<string, unknown>;

    return (
      parseSubmissionFromV1({ event, metadata }) ??
      parseV2Event({ event, metadata })
    );
  } catch {
    return null;
  }
}

function buildFeedbackAggregate(events: FeedbackEventRecord[]): FeedbackAggregate {
  const parsedEvents = events
    .map((event) => parseFeedbackEvent(event))
    .filter((event): event is ParsedFeedbackEvent => event !== null)
    .sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );

  const recordsById = new Map<string, AggregatedFeedbackRecord>();
  let lastLifecycleUpdateAt: string | null = null;

  for (const event of parsedEvents) {
    if (event.eventType === "submission") {
      recordsById.set(event.feedbackId, {
        id: event.eventId,
        feedbackId: event.feedbackId,
        category: event.category,
        severity: event.severity,
        summary: event.summary,
        detail: event.detail,
        lifecycleState: event.lifecycleState,
        supportLane: event.supportLane,
        hardeningTarget: event.hardeningTarget,
        submittedAt: event.submittedAt,
        updatedAt: event.updatedAt,
        reviewNote: null,
      });
      continue;
    }

    const current = recordsById.get(event.feedbackId);
    if (!current) continue;

    const lifecycleState = event.lifecycleState;
    const supportLane = resolveSupportLane({
      severity: current.severity,
      lifecycleState,
    });
    const hardeningTarget = resolveHardeningTarget({
      severity: current.severity,
      lifecycleState,
    });

    recordsById.set(event.feedbackId, {
      ...current,
      lifecycleState,
      supportLane,
      hardeningTarget,
      updatedAt: event.updatedAt,
      reviewNote: event.reviewNote,
    });

    if (
      !lastLifecycleUpdateAt ||
      new Date(event.updatedAt).getTime() > new Date(lastLifecycleUpdateAt).getTime()
    ) {
      lastLifecycleUpdateAt = event.updatedAt;
    }
  }

  const records = [...recordsById.values()].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  );

  const queue: FeedbackQueueBreakdown = {
    submitted: 0,
    triaged: 0,
    hardeningInProgress: 0,
    resolved: 0,
    deferred: 0,
  };

  let openCount = 0;
  let highSeverityOpen = 0;
  let hardeningFollowUpCount = 0;
  let recoveryLinkedCount = 0;
  let lastSubmittedAt: string | null = null;
  let latestCategory: LaunchFeedbackCategory | null = null;
  let latestSeverity: LaunchFeedbackSeverity | null = null;

  for (const record of records) {
    if (record.lifecycleState === "submitted") queue.submitted += 1;
    if (record.lifecycleState === "triaged") queue.triaged += 1;
    if (record.lifecycleState === "hardening_in_progress") {
      queue.hardeningInProgress += 1;
    }
    if (record.lifecycleState === "resolved") queue.resolved += 1;
    if (record.lifecycleState === "deferred") queue.deferred += 1;

    if (isOpenLifecycleState(record.lifecycleState)) {
      openCount += 1;
      if (record.severity === "high") highSeverityOpen += 1;
      if (record.hardeningTarget !== "none") hardeningFollowUpCount += 1;
      if (record.hardeningTarget === "ops_recovery") recoveryLinkedCount += 1;
    }

    if (
      !lastSubmittedAt ||
      new Date(record.submittedAt).getTime() > new Date(lastSubmittedAt).getTime()
    ) {
      lastSubmittedAt = record.submittedAt;
      latestCategory = record.category;
      latestSeverity = record.severity;
    }
  }

  return {
    records,
    recordsById,
    queue,
    openCount,
    pendingTriage: queue.submitted,
    hardeningInProgress: queue.hardeningInProgress,
    highSeverityOpen,
    hardeningFollowUpCount,
    recoveryLinkedCount,
    lastSubmittedAt,
    lastLifecycleUpdateAt,
    latestSeverity,
    latestCategory,
  };
}

async function getFeedbackEvents(input: {
  accountId?: string;
  limit?: number;
}) {
  return prisma.auditEvent.findMany({
    where: {
      kind: LAUNCH_FEEDBACK_KIND,
      scope: LAUNCH_FEEDBACK_SCOPE,
      message: {
        in: [
          LAUNCH_FEEDBACK_SUBMISSION_MESSAGE,
          LAUNCH_FEEDBACK_LIFECYCLE_MESSAGE,
        ],
      },
      ...(input.accountId ? { accountId: input.accountId } : {}),
    },
    orderBy: [{ createdAt: "desc" }],
    take: input.limit ?? 160,
    select: {
      id: true,
      createdAt: true,
      message: true,
      metadataJson: true,
    },
  });
}

async function getFeedbackEventCounters(input: {
  accountId?: string;
}) {
  const lookbackThreshold = new Date(Date.now() - FEEDBACK_LOOKBACK_MS);
  const baseWhere = {
    kind: LAUNCH_FEEDBACK_KIND,
    scope: LAUNCH_FEEDBACK_SCOPE,
    createdAt: {
      gte: lookbackThreshold,
    },
    ...(input.accountId ? { accountId: input.accountId } : {}),
  };

  const [submissions30d, lifecycleUpdates30d] = await Promise.all([
    prisma.auditEvent.count({
      where: {
        ...baseWhere,
        message: LAUNCH_FEEDBACK_SUBMISSION_MESSAGE,
      },
    }),
    prisma.auditEvent.count({
      where: {
        ...baseWhere,
        message: LAUNCH_FEEDBACK_LIFECYCLE_MESSAGE,
      },
    }),
  ]);

  return {
    submissions30d,
    lifecycleUpdates30d,
  };
}

function buildSnapshot(input: {
  checkedAt: string;
  counters: {
    submissions30d: number;
    lifecycleUpdates30d: number;
  };
  aggregate: FeedbackAggregate;
}): LaunchFeedbackSnapshot {
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
      submissions30d: input.counters.submissions30d,
      lifecycleUpdates30d: input.counters.lifecycleUpdates30d,
      openItems: input.aggregate.openCount,
      pendingTriage: input.aggregate.pendingTriage,
      hardeningInProgress: input.aggregate.hardeningInProgress,
      highSeverityOpen: input.aggregate.highSeverityOpen,
      lastSubmittedAt: input.aggregate.lastSubmittedAt,
      lastLifecycleUpdateAt: input.aggregate.lastLifecycleUpdateAt,
      latestSeverity: input.aggregate.latestSeverity,
      latestCategory: input.aggregate.latestCategory,
    },
    triage: {
      contract: "beta_feedback_hardening_loop",
      queue: {
        submitted: input.aggregate.queue.submitted,
        triaged: input.aggregate.queue.triaged,
        hardeningInProgress: input.aggregate.queue.hardeningInProgress,
        resolved: input.aggregate.queue.resolved,
        deferred: input.aggregate.queue.deferred,
      },
      hardeningFollowUps: input.aggregate.hardeningFollowUpCount,
      recoveryLinked: input.aggregate.recoveryLinkedCount,
      hardeningRoute: "/api/ops/hardening",
      recoveryRoute: "/api/ops/recovery",
      escalation: "manual_operator_triage",
    },
    support: {
      mode: "closed_beta_support_guarded",
      lane: "operator_review",
      incidentLane: "operator_incident_review",
      responseSlaHours: 48,
      feedbackRoute: "/api/launch/feedback",
      escalationRoute: "/api/ops/recovery",
    },
    recent: input.aggregate.records.slice(0, 6).map((record) => ({
      id: record.id,
      feedbackId: record.feedbackId,
      category: record.category,
      severity: record.severity,
      summary: record.summary,
      lifecycleState: record.lifecycleState,
      supportLane: record.supportLane,
      hardeningTarget: record.hardeningTarget,
      submittedAt: record.submittedAt,
      updatedAt: record.updatedAt,
      reviewNote: record.reviewNote,
    })),
    truth: {
      launchClaim: "not_launched",
      publicLaunchClaim: "not_claimed",
      liveExecution: "blocked",
      billing: "inactive",
    },
    limitations: [
      "Feedback lifecycle is account-scoped and operator-reviewed for closed-beta operation.",
      "Feedback triage supports hardening/recovery follow-up without implying public support channels.",
      "Submitting or triaging feedback cannot enable live execution, real-money routing, or billing.",
    ],
  };
}

async function getFeedbackSnapshotData(input: {
  checkedAt: string;
  accountId?: string;
}) {
  const [counters, events] = await Promise.all([
    getFeedbackEventCounters({ accountId: input.accountId }),
    getFeedbackEvents({ accountId: input.accountId }),
  ]);

  return {
    counters,
    aggregate: buildFeedbackAggregate(events),
  };
}

export async function getLaunchFeedbackSnapshotForAuthenticatedSession(
  session: AuthenticatedSession,
  checkedAt = new Date().toISOString()
): Promise<LaunchFeedbackSnapshot> {
  const data = await getFeedbackSnapshotData({
    checkedAt,
    accountId: session.account.id,
  });

  return buildSnapshot({
    checkedAt,
    counters: data.counters,
    aggregate: data.aggregate,
  });
}

export async function createLaunchFeedbackForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  feedback: LaunchFeedbackMutationInput;
  checkedAt?: string;
}) {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const feedbackId = randomUUID();
  const lifecycleState = "submitted" as const;
  const metadata: LaunchFeedbackSubmissionMetadataV2 = {
    schema: LAUNCH_FEEDBACK_SCHEMA_V2,
    eventType: "submission",
    feedbackId,
    category: input.feedback.category,
    severity: input.feedback.severity,
    summary: normalizeSummary(input.feedback.summary),
    detail: normalizeDetail(input.feedback.detail),
    lifecycleState,
    supportLane: resolveSupportLane({
      severity: input.feedback.severity,
      lifecycleState,
    }),
    hardeningTarget: resolveHardeningTarget({
      severity: input.feedback.severity,
      lifecycleState,
    }),
    source: "closed_beta_feedback",
    submittedAt: checkedAt,
    updatedAt: checkedAt,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.session.user.id,
      accountId: input.session.account.id,
      kind: LAUNCH_FEEDBACK_KIND,
      scope: LAUNCH_FEEDBACK_SCOPE,
      actorRole: "owner",
      accountMode: input.session.account.mode,
      message: LAUNCH_FEEDBACK_SUBMISSION_MESSAGE,
      metadataJson: JSON.stringify(metadata),
    },
  });

  return getLaunchFeedbackSnapshotForAuthenticatedSession(input.session, checkedAt);
}

export async function updateLaunchFeedbackLifecycleForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  feedback: LaunchFeedbackLifecycleMutationInput;
  checkedAt?: string;
}): Promise<LaunchFeedbackLifecycleUpdateResult> {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const feedbackId = normalizeFeedbackId(input.feedback.feedbackId);
  const nextLifecycleState = input.feedback.lifecycleState;

  const snapshotData = await getFeedbackSnapshotData({
    checkedAt,
    accountId: input.session.account.id,
  });
  const current = snapshotData.aggregate.recordsById.get(feedbackId);

  if (!current) {
    return {
      ok: false,
      reason: "feedback_not_found",
      snapshot: buildSnapshot({
        checkedAt,
        counters: snapshotData.counters,
        aggregate: snapshotData.aggregate,
      }),
    };
  }

  if (!isAllowedLifecycleTransition(current.lifecycleState, nextLifecycleState)) {
    return {
      ok: false,
      reason: "invalid_feedback_lifecycle_transition",
      snapshot: buildSnapshot({
        checkedAt,
        counters: snapshotData.counters,
        aggregate: snapshotData.aggregate,
      }),
    };
  }

  const metadata: LaunchFeedbackLifecycleMetadataV2 = {
    schema: LAUNCH_FEEDBACK_SCHEMA_V2,
    eventType: "lifecycle_update",
    feedbackId,
    previousLifecycleState: current.lifecycleState,
    lifecycleState: nextLifecycleState,
    reviewNote: normalizeReviewNote(input.feedback.reviewNote),
    supportLane: resolveSupportLane({
      severity: current.severity,
      lifecycleState: nextLifecycleState,
    }),
    hardeningTarget: resolveHardeningTarget({
      severity: current.severity,
      lifecycleState: nextLifecycleState,
    }),
    source: "closed_beta_feedback",
    updatedAt: checkedAt,
    updatedByUserId: input.session.user.id,
    updatedByAccountId: input.session.account.id,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.session.user.id,
      accountId: input.session.account.id,
      kind: LAUNCH_FEEDBACK_KIND,
      scope: LAUNCH_FEEDBACK_SCOPE,
      actorRole: "owner",
      accountMode: input.session.account.mode,
      message: LAUNCH_FEEDBACK_LIFECYCLE_MESSAGE,
      metadataJson: JSON.stringify(metadata),
    },
  });

  return {
    ok: true,
    reason: "feedback_lifecycle_updated",
    snapshot: await getLaunchFeedbackSnapshotForAuthenticatedSession(
      input.session,
      checkedAt
    ),
  };
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

export function isLaunchFeedbackLifecycleMutationInput(
  value: unknown
): value is LaunchFeedbackLifecycleMutationInput {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const feedbackId =
    typeof record.feedbackId === "string"
      ? normalizeFeedbackId(record.feedbackId)
      : "";
  const lifecycleState =
    typeof record.lifecycleState === "string" ? record.lifecycleState : null;

  return feedbackId.length > 0 && isFeedbackLifecycleState(lifecycleState);
}

export async function getLaunchFeedbackStoreDiagnostics(input?: {
  checkedAt?: string;
}) {
  const checkedAt = input?.checkedAt ?? new Date().toISOString();
  const data = await getFeedbackSnapshotData({
    checkedAt,
  });

  return {
    checkedAt,
    feedbackEvents30d: data.counters.submissions30d,
    feedbackLifecycleEvents30d: data.counters.lifecycleUpdates30d,
    pendingTriageCount: data.aggregate.pendingTriage,
    hardeningInProgressCount: data.aggregate.hardeningInProgress,
    openFeedbackCount: data.aggregate.openCount,
    highSeverityOpenCount: data.aggregate.highSeverityOpen,
    hardeningFollowUpCount: data.aggregate.hardeningFollowUpCount,
    recoveryLinkedCount: data.aggregate.recoveryLinkedCount,
    lastLifecycleUpdateAt: data.aggregate.lastLifecycleUpdateAt,
    feedbackStore: "local_audit",
  } as const;
}
