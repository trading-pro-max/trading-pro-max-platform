import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

const COMMERCIAL_ACTIVATION_SCHEMA = "tpm.commercial.activation.v1";
const COMMERCIAL_ACTIVATION_KIND = "data_state_updated";
const COMMERCIAL_ACTIVATION_SCOPE = "platform";
const COMMERCIAL_ACTIVATION_MESSAGE = "Commercial activation state synchronized.";

const REQUESTED_PLANS = ["team_review", "enterprise_guarded"] as const;
const ACTIVATION_STATES = [
  "none",
  "requested",
  "in_review",
  "approved_reserved",
  "rejected",
] as const;

type CommercialActivationRequestedPlan = (typeof REQUESTED_PLANS)[number];
type CommercialActivationState = (typeof ACTIVATION_STATES)[number];

type CommercialActivationMetadataPayload = {
  schema: typeof COMMERCIAL_ACTIVATION_SCHEMA;
  state: CommercialActivationState;
  requestedPlan: CommercialActivationRequestedPlan | null;
  requestedAt: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  updatedAt: string;
};

export type CommercialActivationSnapshot = {
  checkedAt: string;
  account: {
    id: string;
    lifecycleState: string;
    region: string;
  };
  plan: {
    current: "evaluation";
    requested: CommercialActivationRequestedPlan | null;
  };
  activation: {
    state: CommercialActivationState;
    requestedAt: string | null;
    reviewedAt: string | null;
    operatorActionRequired: boolean;
    reviewNote: string | null;
  };
  capabilityActivation: {
    workspaceSeats: "single_operator" | "multi_operator_reserved" | "enterprise_reserved";
    apiAccess: "contract_ready_guarded";
    supportFlow: "manual_operator";
    productOps: "manual_controlled";
  };
  commercialTruth: {
    billingEngine: "inactive";
    checkout: "not_enabled";
    paidActivation: "not_enabled";
    subscriptionState: "unconfigured";
  };
  summary: string;
  limitations: string[];
};

export type CommercialActivationMutationInput = {
  requestedPlan: CommercialActivationRequestedPlan;
  note?: string | null;
};

function isRequestedPlan(
  value: string | null | undefined
): value is CommercialActivationRequestedPlan {
  return REQUESTED_PLANS.includes(value as CommercialActivationRequestedPlan);
}

function isActivationState(
  value: string | null | undefined
): value is CommercialActivationState {
  return ACTIVATION_STATES.includes(value as CommercialActivationState);
}

function trimNote(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed.slice(0, 320) : null;
}

function getWorkspaceSeatsCapability(
  requested: CommercialActivationRequestedPlan | null
): CommercialActivationSnapshot["capabilityActivation"]["workspaceSeats"] {
  if (requested === "enterprise_guarded") return "enterprise_reserved";
  if (requested === "team_review") return "multi_operator_reserved";
  return "single_operator";
}

function parseCommercialActivationMetadata(
  metadataJson: string | null | undefined
): CommercialActivationMetadataPayload | null {
  if (!metadataJson) return null;

  try {
    const parsed = JSON.parse(metadataJson) as unknown;
    const record = typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
    if (!record || record.schema !== COMMERCIAL_ACTIVATION_SCHEMA) return null;
    if (!isActivationState(String(record.state ?? ""))) return null;

    const requestedPlanCandidate =
      typeof record.requestedPlan === "string" ? record.requestedPlan : null;
    const requestedPlan: CommercialActivationRequestedPlan | null = isRequestedPlan(
      requestedPlanCandidate
    )
      ? requestedPlanCandidate
      : null;
    const requestedAt = typeof record.requestedAt === "string"
      ? record.requestedAt
      : null;
    const reviewedAt = typeof record.reviewedAt === "string" ? record.reviewedAt : null;
    const reviewNote = typeof record.reviewNote === "string" ? record.reviewNote : null;
    const updatedAt = typeof record.updatedAt === "string"
      ? record.updatedAt
      : new Date().toISOString();

    return {
      schema: COMMERCIAL_ACTIVATION_SCHEMA,
      state: record.state as CommercialActivationState,
      requestedPlan,
      requestedAt,
      reviewedAt,
      reviewNote,
      updatedAt,
    };
  } catch {
    return null;
  }
}

async function getLatestCommercialActivationEvent(accountId: string) {
  return prisma.auditEvent.findFirst({
    where: {
      accountId,
      kind: COMMERCIAL_ACTIVATION_KIND,
      scope: COMMERCIAL_ACTIVATION_SCOPE,
      message: COMMERCIAL_ACTIVATION_MESSAGE,
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

function buildCommercialActivationSnapshot(input: {
  checkedAt: string;
  session: AuthenticatedSession;
  metadata: CommercialActivationMetadataPayload | null;
}): CommercialActivationSnapshot {
  const state = input.metadata?.state ?? "none";
  const requestedPlan = input.metadata?.requestedPlan ?? null;
  const requestedAt = input.metadata?.requestedAt ?? null;
  const reviewedAt = input.metadata?.reviewedAt ?? null;
  const reviewNote = input.metadata?.reviewNote ?? null;

  return {
    checkedAt: input.checkedAt,
    account: {
      id: input.session.account.id,
      lifecycleState: input.session.account.lifecycleState,
      region: input.session.account.region,
    },
    plan: {
      current: "evaluation",
      requested: requestedPlan,
    },
    activation: {
      state,
      requestedAt,
      reviewedAt,
      operatorActionRequired: state === "requested" || state === "in_review",
      reviewNote,
    },
    capabilityActivation: {
      workspaceSeats: getWorkspaceSeatsCapability(requestedPlan),
      apiAccess: "contract_ready_guarded",
      supportFlow: "manual_operator",
      productOps: "manual_controlled",
    },
    commercialTruth: {
      billingEngine: "inactive",
      checkout: "not_enabled",
      paidActivation: "not_enabled",
      subscriptionState: "unconfigured",
    },
    summary:
      state === "none"
        ? "Commercial activation flow is available with no pending plan request."
        : `Commercial activation flow is ${state} for ${requestedPlan ?? "no_plan"}.`,
    limitations: [
      "No billing engine, checkout, or paid-plan activation is enabled.",
      "Plan requests are operator-reviewed and do not auto-activate capabilities.",
      "Execution safety remains paper-only with live routing blocked.",
    ],
  };
}

export async function getCommercialActivationSnapshotForAuthenticatedSession(
  session: AuthenticatedSession
): Promise<CommercialActivationSnapshot> {
  const checkedAt = new Date().toISOString();
  const latest = await getLatestCommercialActivationEvent(session.account.id);
  const metadata = parseCommercialActivationMetadata(latest?.metadataJson);

  return buildCommercialActivationSnapshot({
    checkedAt,
    session,
    metadata,
  });
}

export async function upsertCommercialActivationRequestForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  requestedPlan: CommercialActivationRequestedPlan;
  note?: string | null;
}): Promise<CommercialActivationSnapshot> {
  const checkedAt = new Date().toISOString();
  const metadata: CommercialActivationMetadataPayload = {
    schema: COMMERCIAL_ACTIVATION_SCHEMA,
    state: "requested",
    requestedPlan: input.requestedPlan,
    requestedAt: checkedAt,
    reviewedAt: null,
    reviewNote: trimNote(input.note),
    updatedAt: checkedAt,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.session.user.id,
      accountId: input.session.account.id,
      kind: COMMERCIAL_ACTIVATION_KIND,
      scope: COMMERCIAL_ACTIVATION_SCOPE,
      actorRole: "owner",
      accountMode: "demo",
      message: COMMERCIAL_ACTIVATION_MESSAGE,
      metadataJson: JSON.stringify(metadata),
    },
  });

  return buildCommercialActivationSnapshot({
    checkedAt,
    session: input.session,
    metadata,
  });
}

export function isCommercialActivationMutationInput(
  value: unknown
): value is CommercialActivationMutationInput {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return isRequestedPlan(
    typeof record.requestedPlan === "string" ? record.requestedPlan : null
  );
}

export async function getCommercialActivationDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  try {
    const [eventCount, accountCount] = await Promise.all([
      prisma.auditEvent.count({
        where: {
          kind: COMMERCIAL_ACTIVATION_KIND,
          scope: COMMERCIAL_ACTIVATION_SCOPE,
          message: COMMERCIAL_ACTIVATION_MESSAGE,
        },
      }),
      prisma.account.count(),
    ]);

    return {
      key: "commercial_activation",
      label: "Commercial activation",
      status: "ready",
      summary:
        eventCount > 0
          ? "Commercial activation requests are persisted and operator-reviewed."
          : "Commercial activation request flow is available.",
      detail:
        `Commercial activation contracts are active across ${accountCount} account(s) with explicit inactive billing and no paid auto-activation.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "commercial_activation",
      label: "Commercial activation",
      status: "degraded",
      summary: "Commercial activation flow degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Commercial activation diagnostics probe failed.",
      checkedAt,
    };
  }
}
