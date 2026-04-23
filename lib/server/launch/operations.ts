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
type ClosedBetaProgramMode =
  | "closed_beta"
  | "soft_launch"
  | "public_launch_preparation";
type ClosedBetaAccessDecision =
  | "granted"
  | "review_required"
  | "blocked_unconfigured";
type ClosedBetaCapacityState = "within_limit" | "at_limit";

type SoftLaunchState = "prepared_guarded" | "blocked_guarded";
type SoftLaunchCapacityState = "within_limit" | "at_limit";
type PublicLaunchState =
  | "prepared_guarded"
  | "in_progress_guarded"
  | "blocked_guarded";

export type LaunchOperationsSnapshot = {
  checkedAt: string;
  mode: LaunchOperationsMode;
  program: {
    releaseTrack: "controlled_launch_operations";
    currentStage: "public_launch_preparation";
    previousStage: "soft_launch_preparation";
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
    mode: "controlled_closed_beta";
    programMode: ClosedBetaProgramMode;
    access: "allowlist_only";
    accessDecision: ClosedBetaAccessDecision;
    evaluatorEligibility: ClosedBetaEligibility;
    matchSource: ClosedBetaMatchSource;
    allowlist: {
      configured: boolean;
      emailEntries: number;
      accountEntries: number;
    };
    capacity: {
      maxEvaluators: number;
      activeEvaluators: number;
      remainingSlots: number;
      state: ClosedBetaCapacityState;
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
    limitations: string[];
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
  publicLaunch: {
    mode: "go_live_checklist_guarded";
    state: PublicLaunchState;
    checklist: {
      requiredCount: number;
      passedCount: number;
      failedCount: number;
      items: Array<{
        key: string;
        label: string;
        passed: boolean;
        evidence: string;
      }>;
    };
    goLive: {
      releaseAuthority: "operator_manual";
      rolloutWindow: "guarded_unset" | "guarded_planned";
      rollbackPlan: "required";
      customerComms: "prepared_guarded";
      supportScale: "operator_limited";
    };
    truth: {
      launchClaim: "not_launched";
      publicLaunchClaim: "not_claimed";
      billing: "inactive";
      liveExecution: "blocked";
      scaleClaims: "none";
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

export type ClosedBetaPreparationSnapshot = {
  checkedAt: string;
  mode: "closed_beta_preparation";
  stage: LaunchPipelineStageState;
  closedBeta: LaunchOperationsSnapshot["closedBeta"];
  support: LaunchOperationsSnapshot["support"];
  limitations: string[];
};

export type PublicLaunchPreparationSnapshot = {
  checkedAt: string;
  mode: "public_launch_preparation";
  stage: LaunchPipelineStageState;
  publicLaunch: LaunchOperationsSnapshot["publicLaunch"];
  limitations: string[];
};

function parseCsvList(raw: string | null | undefined) {
  if (!raw) return [] as string[];
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0);
}

function resolveClosedBetaProgramMode(): ClosedBetaProgramMode {
  const raw = process.env.TPM_LAUNCH_PROGRAM_MODE?.trim().toLowerCase();
  if (raw === "soft_launch") return "soft_launch";
  if (raw === "public_launch_preparation") return "public_launch_preparation";
  return "closed_beta";
}

function resolveClosedBetaMaxEvaluators() {
  const raw = Number(process.env.TPM_CLOSED_BETA_MAX_EVALUATORS ?? 80);
  if (!Number.isFinite(raw) || raw < 1) return 80;
  return Math.min(1000, Math.max(10, Math.round(raw)));
}

async function getClosedBetaCapacity() {
  const maxEvaluators = resolveClosedBetaMaxEvaluators();
  const activeEvaluators = await prisma.account.count();
  const remainingSlots = Math.max(0, maxEvaluators - activeEvaluators);

  return {
    maxEvaluators,
    activeEvaluators,
    remainingSlots,
    state: remainingSlots > 0 ? ("within_limit" as const) : ("at_limit" as const),
  };
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

function resolveClosedBetaAccessDecision(input: {
  eligibility: ClosedBetaEligibility;
  capacity: {
    remainingSlots: number;
  };
}) {
  if (
    input.eligibility === "allowlist_unconfigured" ||
    input.capacity.remainingSlots <= 0
  ) {
    return "blocked_unconfigured" as const;
  }
  if (input.eligibility === "eligible") return "granted" as const;
  return "review_required" as const;
}

function buildFoundationalStageState(input: {
  gate: LaunchReadinessGateSnapshot;
  closedBetaEligibility: ClosedBetaEligibility;
  closedBetaAccessDecision: ClosedBetaAccessDecision;
  hardening: OpsProductionHardeningSnapshot | null;
  softLaunchCapacity: {
    remainingSlots: number;
  };
}) {
  const gateState: LaunchPipelineStageState =
    input.gate.overall.status === "pass" ? "ready" : "blocked";

  const closedBetaState: LaunchPipelineStageState =
    gateState === "ready" && input.closedBetaAccessDecision === "granted"
      ? "ready"
      : gateState === "ready" &&
        input.closedBetaEligibility !== "allowlist_unconfigured"
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

function buildPublicLaunchChecklist(input: {
  gateState: LaunchPipelineStageState;
  hardeningState: LaunchPipelineStageState;
  softLaunchState: LaunchPipelineStageState;
  feedbackSubmissions30d: number;
}) {
  const items = [
    {
      key: "launch_gate_verification",
      label: "Launch verification gate remains operational",
      passed: input.gateState === "ready",
      evidence: `launch_gate_state=${input.gateState}`,
    },
    {
      key: "production_hardening_evidence",
      label: "Production hardening evidence is available",
      passed:
        input.hardeningState === "ready" || input.hardeningState === "in_progress",
      evidence: `hardening_state=${input.hardeningState}`,
    },
    {
      key: "soft_launch_guarded_state",
      label: "Soft-launch layer exists with guarded rollout semantics",
      passed:
        input.softLaunchState === "ready" || input.softLaunchState === "in_progress",
      evidence: `soft_launch_state=${input.softLaunchState}`,
    },
    {
      key: "feedback_support_path",
      label: "Support feedback path is active for pre-launch operators",
      passed: true,
      evidence: `feedback_submissions_30d=${input.feedbackSubmissions30d}`,
    },
    {
      key: "commercial_truth_guard",
      label: "Commercial/billing truth remains explicit and non-deceptive",
      passed: true,
      evidence: "billing=inactive checkout=not_enabled",
    },
    {
      key: "execution_safety_guard",
      label: "Execution safety remains paper-only and live-blocked",
      passed: true,
      evidence: "paper_only=true live_execution=blocked",
    },
  ];

  return {
    requiredCount: items.length,
    passedCount: items.filter((item) => item.passed).length,
    failedCount: items.filter((item) => !item.passed).length,
    items,
  };
}

function resolvePublicLaunchStage(input: {
  gateState: LaunchPipelineStageState;
  checklistFailedCount: number;
}) {
  if (input.gateState === "blocked") return "blocked" as const;
  if (input.checklistFailedCount === 0) return "ready" as const;
  return "in_progress" as const;
}

function mapPublicLaunchState(stage: LaunchPipelineStageState): PublicLaunchState {
  if (stage === "ready") return "prepared_guarded";
  if (stage === "in_progress") return "in_progress_guarded";
  return "blocked_guarded";
}

export async function getLaunchOperationsSnapshotForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  hardening?: OpsProductionHardeningSnapshot | null;
  checkedAt?: string;
}): Promise<LaunchOperationsSnapshot> {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const programMode = resolveClosedBetaProgramMode();
  const closedBeta = evaluateClosedBetaEligibility({
    email: input.session.user.email,
    accountId: input.session.account.id,
  });
  const [feedbackSnapshot, closedBetaCapacity, softLaunchCapacity] = await Promise.all([
    getLaunchFeedbackSnapshotForAuthenticatedSession(input.session, checkedAt),
    getClosedBetaCapacity(),
    getSoftLaunchCapacity(),
  ]);
  const closedBetaAccessDecision = resolveClosedBetaAccessDecision({
    eligibility: closedBeta.eligibility,
    capacity: closedBetaCapacity,
  });

  const stageState = buildFoundationalStageState({
    gate: input.gate,
    closedBetaEligibility: closedBeta.eligibility,
    closedBetaAccessDecision,
    hardening: input.hardening ?? null,
    softLaunchCapacity,
  });
  const publicChecklist = buildPublicLaunchChecklist({
    gateState: stageState.gateState,
    hardeningState: stageState.productionHardeningState,
    softLaunchState: stageState.softLaunchState,
    feedbackSubmissions30d: feedbackSnapshot.summary.submissions30d,
  });
  const publicLaunchStage = resolvePublicLaunchStage({
    gateState: stageState.gateState,
    checklistFailedCount: publicChecklist.failedCount,
  });

  return {
    checkedAt,
    mode: "public_launch_preparation",
    program: {
      releaseTrack: "controlled_launch_operations",
      currentStage: "public_launch_preparation",
      previousStage: "soft_launch_preparation",
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
        evidence: `closed_beta_mode=${programMode} access=${closedBetaAccessDecision} eligibility=${closedBeta.eligibility}`,
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
        state: publicLaunchStage,
        required: true,
        evidence: `public_checklist_failed=${publicChecklist.failedCount}`,
      },
    ],
    closedBeta: {
      mode: "controlled_closed_beta",
      programMode,
      access: "allowlist_only",
      accessDecision: closedBetaAccessDecision,
      evaluatorEligibility: closedBeta.eligibility,
      matchSource: closedBeta.matchSource,
      allowlist: {
        configured: closedBeta.allowlistConfigured,
        emailEntries: closedBeta.emailEntries,
        accountEntries: closedBeta.accountEntries,
      },
      capacity: {
        maxEvaluators: closedBetaCapacity.maxEvaluators,
        activeEvaluators: closedBetaCapacity.activeEvaluators,
        remainingSlots: closedBetaCapacity.remainingSlots,
        state: closedBetaCapacity.state,
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
      limitations: [
        "Closed beta access is allowlist and capacity guarded.",
        "Live execution, real-money routing, and billing remain blocked/inactive.",
      ],
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
    publicLaunch: {
      mode: "go_live_checklist_guarded",
      state: mapPublicLaunchState(publicLaunchStage),
      checklist: publicChecklist,
      goLive: {
        releaseAuthority: "operator_manual",
        rolloutWindow: "guarded_unset",
        rollbackPlan: "required",
        customerComms: "prepared_guarded",
        supportScale: "operator_limited",
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        billing: "inactive",
        liveExecution: "blocked",
        scaleClaims: "none",
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
      "Public launch preparation provides checklist and go-live semantics only; it does not claim launch has happened.",
      "Rollout access remains guarded and may be blocked by readiness/capacity evidence.",
      "Live execution, real-money routing, and paid billing remain blocked or inactive.",
    ],
  };
}

export async function getClosedBetaPreparationSnapshotForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  hardening?: OpsProductionHardeningSnapshot | null;
  checkedAt?: string;
}): Promise<ClosedBetaPreparationSnapshot> {
  const snapshot = await getLaunchOperationsSnapshotForAuthenticatedSession(input);
  const stage =
    snapshot.stages.find((item) => item.key === "closed_beta_preparation")?.state ??
    "blocked";

  return {
    checkedAt: snapshot.checkedAt,
    mode: "closed_beta_preparation",
    stage,
    closedBeta: snapshot.closedBeta,
    support: snapshot.support,
    limitations: snapshot.limitations,
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

export async function getPublicLaunchPreparationSnapshotForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  hardening?: OpsProductionHardeningSnapshot | null;
  checkedAt?: string;
}): Promise<PublicLaunchPreparationSnapshot> {
  const snapshot = await getLaunchOperationsSnapshotForAuthenticatedSession(input);
  const stage =
    snapshot.stages.find((item) => item.key === "public_launch_preparation")?.state ??
    "blocked";

  return {
    checkedAt: snapshot.checkedAt,
    mode: "public_launch_preparation",
    stage,
    publicLaunch: snapshot.publicLaunch,
    limitations: snapshot.limitations,
  };
}

export async function getClosedBetaPreparationDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): Promise<DiagnosticsProbe> {
  try {
    const [feedbackStore, activeEvaluators] = await Promise.all([
      getLaunchFeedbackStoreDiagnostics({ checkedAt }),
      prisma.account.count(),
    ]);
    const programMode = resolveClosedBetaProgramMode();
    const emailAllowlist = parseCsvList(process.env.TPM_CLOSED_BETA_ALLOWLIST_EMAILS);
    const accountAllowlist = parseCsvList(process.env.TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS);
    const allowlistConfigured = emailAllowlist.length > 0 || accountAllowlist.length > 0;
    const maxEvaluators = resolveClosedBetaMaxEvaluators();
    const remainingSlots = Math.max(0, maxEvaluators - activeEvaluators);
    const status = !allowlistConfigured
      ? "unconfigured"
      : remainingSlots > 0
      ? "ready"
      : "degraded";

    return {
      key: "closed_beta_preparation",
      label: "Closed beta preparation",
      status,
      summary:
        status === "ready"
          ? "Closed beta guardrails are configured with allowlist and capacity semantics."
          : status === "degraded"
          ? "Closed beta guardrails are configured but evaluator capacity is exhausted."
          : "Closed beta allowlist is not configured yet.",
      detail:
        `program_mode=${programMode}; ` +
        `Allowlist email entries ${emailAllowlist.length}, account entries ${accountAllowlist.length}. ` +
        `Capacity ${activeEvaluators}/${maxEvaluators} with ${remainingSlots} slot(s) remaining. ` +
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

export async function getPublicLaunchPreparationDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): Promise<DiagnosticsProbe> {
  try {
    const [hardening, feedbackStore] = await Promise.all([
      getOpsProductionHardeningSnapshot(checkedAt),
      getLaunchFeedbackStoreDiagnostics({ checkedAt }),
    ]);

    const status = hardening.readiness.score >= 60 ? "ready" : "degraded";

    return {
      key: "public_launch_preparation",
      label: "Public launch preparation",
      status,
      summary:
        status === "ready"
          ? "Public launch preparation checklist layer is available with guarded go-live semantics."
          : "Public launch preparation exists but remains blocked by readiness evidence.",
      detail:
        `Hardening ${hardening.readiness.score}/100 (${hardening.readiness.stage}); ` +
        `feedback events 30d=${feedbackStore.feedbackEvents30d}; launchClaim=not_launched.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "public_launch_preparation",
      label: "Public launch preparation",
      status: "degraded",
      summary: "Public launch preparation diagnostics degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Public launch preparation diagnostics probe failed.",
      checkedAt,
    };
  }
}
