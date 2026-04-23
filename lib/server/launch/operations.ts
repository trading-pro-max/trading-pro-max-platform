import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";
import {
  getOpsProductionHardeningSnapshot,
  type OpsProductionHardeningSnapshot,
} from "@/lib/server/ops";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";
import type { LaunchReadinessGateSnapshot } from "./readiness";
import {
  getLaunchFeedbackSnapshotForAuthenticatedSession,
  getLaunchFeedbackStoreDiagnostics,
} from "./feedback";

export type LaunchOperationsMode =
  | "closed_beta_preparation"
  | "soft_launch_preparation"
  | "public_launch_preparation";

type LaunchPipelineStageKey =
  | "launch_readiness_verification_gate"
  | "closed_beta_preparation"
  | "production_hardening"
  | "soft_launch_preparation"
  | "public_launch_preparation";

type LaunchPipelineStageState =
  | "ready"
  | "in_progress"
  | "blocked"
  | "not_started";

type ClosedBetaEligibility =
  | "eligible"
  | "review_required"
  | "allowlist_unconfigured";

type ClosedBetaMatchSource = "email" | "account" | "none";

type SoftLaunchState = "prepared_guarded" | "blocked_guarded";
type SoftLaunchCapacityState = "within_limit" | "at_limit";

export type LaunchOperationsSnapshot = {
  checkedAt: string;
  mode: LaunchOperationsMode;
  program: {
    releaseTrack: "controlled_launch_operations";
    currentStage: "soft_launch_preparation";
    previousStage: "closed_beta_preparation";
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    publicAccess: "not_open";
  };
  stages: Array<{
    key: LaunchPipelineStageKey;
    state: LaunchPipelineStageState;
    required: boolean;
    evidence: string;
  }>;
  closedBeta: {
    access: "allowlist_only";
    evaluatorEligibility: ClosedBetaEligibility;
    matchSource: ClosedBetaMatchSource;
    allowlist: {
      configured: boolean;
      emailEntries: number;
      accountEntries: number;
    };
    cohort: {
      userEmail: string;
      accountId: string;
      supportLane: "operator_review";
      feedbackRoute: "/api/launch/feedback";
    };
    safety: {
      paperOnly: true;
      liveExecution: "blocked";
      realMoneyRouting: "blocked";
      billing: "inactive";
    };
  };
  softLaunch: {
    mode: "limited_rollout_guarded";
    state: SoftLaunchState;
    access: "cohort_and_capacity_guard";
    capacity: {
      maxAccounts: number;
      activeAccounts: number;
      remainingSlots: number;
      state: SoftLaunchCapacityState;
    };
    channels: {
      publicEntry: "limited_rollout_visibility";
      inviteFlow: "operator_issue_only";
      supportPath: "operator_review";
    };
    truth: {
      launchClaim: "not_launched";
      publicLaunchClaim: "not_claimed";
      scaleClaims: "none";
      liveExecution: "blocked";
      billing: "inactive";
    };
  };
  support: {
    mode: "closed_beta_operator_review";
    feedbackSubmissions30d: number;
    lastFeedbackAt: string | null;
    feedbackRoute: "/api/launch/feedback";
  };
  truth: {
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    billing: "inactive";
    notifications: "unconfigured";
  };
  limitations: string[];
};

export type SoftLaunchPreparationSnapshot = {
  checkedAt: string;
  mode: "soft_launch_preparation";
  stage: LaunchPipelineStageState;
  softLaunch: LaunchOperationsSnapshot["softLaunch"];
  limitations: string[];
};

function parseCsvList(raw: string | null | undefined) {
  if (!raw) return [] as string[];
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0);
}

function resolveSoftLaunchMaxAccounts() {
  const raw = Number(process.env.TPM_SOFT_LAUNCH_MAX_ACCOUNTS ?? 120);
  if (!Number.isFinite(raw) || raw < 1) return 120;
  return Math.min(5000, Math.max(10, Math.round(raw)));
}

async function getSoftLaunchCapacity() {
  const maxAccounts = resolveSoftLaunchMaxAccounts();
  const activeAccounts = await prisma.account.count();
  const remainingSlots = Math.max(0, maxAccounts - activeAccounts);

  return {
    maxAccounts,
    activeAccounts,
    remainingSlots,
    state: remainingSlots > 0 ? ("within_limit" as const) : ("at_limit" as const),
  };
}

function evaluateClosedBetaEligibility(input: {
  email: string;
  accountId: string;
}) {
  const emailAllowlist = parseCsvList(process.env.TPM_CLOSED_BETA_ALLOWLIST_EMAILS);
  const accountAllowlist = parseCsvList(process.env.TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS);
  const allowlistConfigured = emailAllowlist.length > 0 || accountAllowlist.length > 0;
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedAccountId = input.accountId.trim().toLowerCase();
  const byEmail = allowlistConfigured && emailAllowlist.includes(normalizedEmail);
  const byAccount = allowlistConfigured && accountAllowlist.includes(normalizedAccountId);

  if (!allowlistConfigured) {
    return {
      eligibility: "allowlist_unconfigured" as const,
      matchSource: "none" as const,
      allowlistConfigured,
      emailEntries: emailAllowlist.length,
      accountEntries: accountAllowlist.length,
    };
  }

  if (byEmail) {
    return {
      eligibility: "eligible" as const,
      matchSource: "email" as const,
      allowlistConfigured,
      emailEntries: emailAllowlist.length,
      accountEntries: accountAllowlist.length,
    };
  }

  if (byAccount) {
    return {
      eligibility: "eligible" as const,
      matchSource: "account" as const,
      allowlistConfigured,
      emailEntries: emailAllowlist.length,
      accountEntries: accountAllowlist.length,
    };
  }

  return {
    eligibility: "review_required" as const,
    matchSource: "none" as const,
    allowlistConfigured,
    emailEntries: emailAllowlist.length,
    accountEntries: accountAllowlist.length,
  };
}

function buildStageState(input: {
  gate: LaunchReadinessGateSnapshot;
  closedBetaEligibility: ClosedBetaEligibility;
  hardening: OpsProductionHardeningSnapshot | null;
  softLaunchCapacity: {
    remainingSlots: number;
  };
}) {
  const gateState: LaunchPipelineStageState =
    input.gate.overall.status === "pass" ? "ready" : "blocked";

  const closedBetaState: LaunchPipelineStageState =
    gateState === "ready" && input.closedBetaEligibility !== "allowlist_unconfigured"
      ? "in_progress"
      : "blocked";

  const productionHardeningState: LaunchPipelineStageState =
    !input.hardening
      ? "not_started"
      : input.hardening.degraded.status === "stable" &&
        input.hardening.readiness.stage === "operational_resilient"
      ? "ready"
      : input.hardening.readiness.score >= 60
      ? "in_progress"
      : "blocked";

  const softLaunchState: LaunchPipelineStageState =
    gateState === "ready" &&
    productionHardeningState !== "blocked" &&
    input.softLaunchCapacity.remainingSlots > 0
      ? "ready"
      : "blocked";

  return {
    gateState,
    closedBetaState,
    productionHardeningState,
    softLaunchState,
  };
}

export async function getLaunchOperationsSnapshotForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  hardening?: OpsProductionHardeningSnapshot | null;
  checkedAt?: string;
}): Promise<LaunchOperationsSnapshot> {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const closedBeta = evaluateClosedBetaEligibility({
    email: input.session.user.email,
    accountId: input.session.account.id,
  });
  const [feedbackSnapshot, softLaunchCapacity] = await Promise.all([
    getLaunchFeedbackSnapshotForAuthenticatedSession(input.session, checkedAt),
    getSoftLaunchCapacity(),
  ]);

  const stageState = buildStageState({
    gate: input.gate,
    closedBetaEligibility: closedBeta.eligibility,
    hardening: input.hardening ?? null,
    softLaunchCapacity,
  });

  return {
    checkedAt,
    mode: "soft_launch_preparation",
    program: {
      releaseTrack: "controlled_launch_operations",
      currentStage: "soft_launch_preparation",
      previousStage: "closed_beta_preparation",
      launchClaim: "not_launched",
      publicLaunchClaim: "not_claimed",
      publicAccess: "not_open",
    },
    stages: [
      {
        key: "launch_readiness_verification_gate",
        state: stageState.gateState,
        required: true,
        evidence: `launch_gate=${input.gate.overall.status} score=${input.gate.overall.score}`,
      },
      {
        key: "closed_beta_preparation",
        state: stageState.closedBetaState,
        required: true,
        evidence: `closed_beta_eligibility=${closedBeta.eligibility}`,
      },
      {
        key: "production_hardening",
        state: stageState.productionHardeningState,
        required: true,
        evidence: input.hardening
          ? `hardening=${input.hardening.readiness.stage} score=${input.hardening.readiness.score} degraded=${input.hardening.degraded.status}`
          : "No hardening evidence supplied.",
      },
      {
        key: "soft_launch_preparation",
        state: stageState.softLaunchState,
        required: true,
        evidence: `capacity=${softLaunchCapacity.activeAccounts}/${softLaunchCapacity.maxAccounts} remaining=${softLaunchCapacity.remainingSlots}`,
      },
      {
        key: "public_launch_preparation",
        state: "not_started",
        required: true,
        evidence: "Stage not started.",
      },
    ],
    closedBeta: {
      access: "allowlist_only",
      evaluatorEligibility: closedBeta.eligibility,
      matchSource: closedBeta.matchSource,
      allowlist: {
        configured: closedBeta.allowlistConfigured,
        emailEntries: closedBeta.emailEntries,
        accountEntries: closedBeta.accountEntries,
      },
      cohort: {
        userEmail: input.session.user.email,
        accountId: input.session.account.id,
        supportLane: "operator_review",
        feedbackRoute: "/api/launch/feedback",
      },
      safety: {
        paperOnly: true,
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
      },
    },
    softLaunch: {
      mode: "limited_rollout_guarded",
      state: stageState.softLaunchState === "ready" ? "prepared_guarded" : "blocked_guarded",
      access: "cohort_and_capacity_guard",
      capacity: {
        maxAccounts: softLaunchCapacity.maxAccounts,
        activeAccounts: softLaunchCapacity.activeAccounts,
        remainingSlots: softLaunchCapacity.remainingSlots,
        state: softLaunchCapacity.state,
      },
      channels: {
        publicEntry: "limited_rollout_visibility",
        inviteFlow: "operator_issue_only",
        supportPath: "operator_review",
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        scaleClaims: "none",
        liveExecution: "blocked",
        billing: "inactive",
      },
    },
    support: {
      mode: "closed_beta_operator_review",
      feedbackSubmissions30d: feedbackSnapshot.summary.submissions30d,
      lastFeedbackAt: feedbackSnapshot.summary.lastSubmittedAt,
      feedbackRoute: "/api/launch/feedback",
    },
    truth: {
      launchClaim: "not_launched",
      publicLaunchClaim: "not_claimed",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
      notifications: "unconfigured",
    },
    limitations: [
      "Soft launch preparation supports limited rollout semantics only and does not imply public launch.",
      "Rollout access remains constrained by capacity and guarded cohort policy.",
      "Live execution, real-money routing, and paid billing remain blocked or inactive.",
    ],
  };
}

export async function getSoftLaunchPreparationSnapshotForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  hardening?: OpsProductionHardeningSnapshot | null;
  checkedAt?: string;
}): Promise<SoftLaunchPreparationSnapshot> {
  const snapshot = await getLaunchOperationsSnapshotForAuthenticatedSession(input);
  const stage =
    snapshot.stages.find((item) => item.key === "soft_launch_preparation")?.state ??
    "blocked";

  return {
    checkedAt: snapshot.checkedAt,
    mode: "soft_launch_preparation",
    stage,
    softLaunch: snapshot.softLaunch,
    limitations: snapshot.limitations,
  };
}

export async function getClosedBetaPreparationDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): Promise<DiagnosticsProbe> {
  try {
    const feedbackStore = await getLaunchFeedbackStoreDiagnostics({ checkedAt });
    const emailAllowlist = parseCsvList(process.env.TPM_CLOSED_BETA_ALLOWLIST_EMAILS);
    const accountAllowlist = parseCsvList(process.env.TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS);
    const allowlistConfigured = emailAllowlist.length > 0 || accountAllowlist.length > 0;

    return {
      key: "closed_beta_preparation",
      label: "Closed beta preparation",
      status: allowlistConfigured ? "ready" : "unconfigured",
      summary: allowlistConfigured
        ? "Closed beta guardrails are configured with allowlist access semantics."
        : "Closed beta allowlist is not configured yet.",
      detail:
        `Allowlist email entries ${emailAllowlist.length}, account entries ${accountAllowlist.length}. ` +
        `Feedback store ${feedbackStore.feedbackStore} has ${feedbackStore.feedbackEvents30d} event(s) in the last 30 days.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "closed_beta_preparation",
      label: "Closed beta preparation",
      status: "degraded",
      summary: "Closed beta preparation diagnostics degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Closed beta preparation diagnostics probe failed.",
      checkedAt,
    };
  }
}

export async function getSoftLaunchPreparationDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): Promise<DiagnosticsProbe> {
  try {
    const [hardening, activeAccounts] = await Promise.all([
      getOpsProductionHardeningSnapshot(checkedAt),
      prisma.account.count(),
    ]);
    const maxAccounts = resolveSoftLaunchMaxAccounts();
    const remainingSlots = Math.max(0, maxAccounts - activeAccounts);
    const status =
      hardening.readiness.score >= 60 && remainingSlots > 0 ? "ready" : "degraded";

    return {
      key: "soft_launch_preparation",
      label: "Soft launch preparation",
      status,
      summary:
        status === "ready"
          ? "Soft launch preparation is ready for guarded limited rollout."
          : "Soft launch preparation remains guarded and not yet ready for wider rollout.",
      detail:
        `Hardening ${hardening.readiness.score}/100 (${hardening.readiness.stage}); ` +
        `capacity ${activeAccounts}/${maxAccounts} with ${remainingSlots} slot(s) remaining.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "soft_launch_preparation",
      label: "Soft launch preparation",
      status: "degraded",
      summary: "Soft launch preparation diagnostics degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Soft launch preparation diagnostics probe failed.",
      checkedAt,
    };
  }
}
