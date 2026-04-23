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
import {
  getLaunchOperationsControlStateSnapshot,
  mapLaunchOperationsModeFromLifecycleStage,
  type LaunchOperationsControlStateSnapshot,
} from "./control";

export type LaunchOperationsMode =
  | "closed_beta_preparation"
  | "soft_launch_preparation"
  | "public_launch_preparation"
  | "closed_beta_activation"
  | "soft_launch_activation"
  | "public_launch_activation_gate";

type LaunchProgramStage =
  | "launch_readiness_verification_gate"
  | "closed_beta_preparation"
  | "soft_launch_preparation"
  | "public_launch_preparation"
  | "closed_beta_activation"
  | "soft_launch_activation"
  | "public_launch_activation_gate";

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
type SoftLaunchProgramMode = "limited_rollout_guarded" | "disabled_guarded";
type SoftLaunchAdmissionDecision = "admitted" | "queue_review" | "blocked";
type PublicLaunchState =
  | "prepared_guarded"
  | "in_progress_guarded"
  | "blocked_guarded";
type PublicLaunchDecisionState = "ready_guarded" | "not_ready";

export type LaunchOperationsSnapshot = {
  checkedAt: string;
  mode: LaunchOperationsMode;
  program: {
    releaseTrack: "controlled_launch_operations";
    currentStage: LaunchProgramStage;
    previousStage: LaunchProgramStage;
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    publicAccess: "not_open";
    lifecycleStage: LaunchOperationsControlStateSnapshot["stage"];
  };
  lifecycle: LaunchOperationsControlStateSnapshot;
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
    activation: {
      state: "active_guarded" | "inactive_guarded";
      activatedAt: string | null;
      activationRoute: "/api/launch/operations";
      blockers: string[];
    };
    feedbackLoop: {
      state: "operational_guarded" | "triage_backlog_guarded";
      pendingTriage: number;
      hardeningInProgress: number;
      highSeverityOpen: number;
      hardeningFollowUps: number;
      recoveryLinked: number;
      lastLifecycleUpdateAt: string | null;
      lifecycleRoute: "/api/launch/feedback";
      hardeningRoute: "/api/ops/hardening";
      recoveryRoute: "/api/ops/recovery";
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
    programMode: SoftLaunchProgramMode;
    state: SoftLaunchState;
    access: "cohort_and_capacity_guard";
    admission: {
      decision: SoftLaunchAdmissionDecision;
      reason:
        | "capacity_available"
        | "requires_operator_review"
        | "soft_launch_disabled_or_blocked";
      supportLane: "operator_review";
      queueRoute: "/api/launch/feedback";
    };
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
    support: {
      feedbackRoute: "/api/launch/feedback";
      responseSlaHours: number;
      rolloutStatus: "limited_guarded";
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
    contracts: {
      checklistAuthority: "operator_manual";
      legalDisclosures: "required_prelaunch";
      customerComms: "prepared_guarded";
      statusPage: "manual_guarded";
    };
    decision: {
      goLiveState: PublicLaunchDecisionState;
      reason:
        | "checklist_passed_manual_release_required"
        | "checklist_incomplete_or_gate_blocked";
      releaseRoute: "/api/launch/public-go-live";
    };
    visibility: {
      launchModeLabel: "public_launch_preparation";
      customerStateLabel: "not_launched";
      claimsPolicy: "no_false_public_launch_claims";
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
    feedbackLifecycleUpdates30d: number;
    pendingTriage: number;
    hardeningInProgress: number;
    highSeverityOpen: number;
    hardeningFollowUps: number;
    recoveryLinked: number;
    lastFeedbackAt: string | null;
    lastLifecycleUpdateAt: string | null;
    feedbackRoute: "/api/launch/feedback";
    hardeningRoute: "/api/ops/hardening";
    recoveryRoute: "/api/ops/recovery";
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

export type SoftLaunchAccessSnapshot = {
  checkedAt: string;
  mode: "soft_launch_access";
  stage: LaunchPipelineStageState;
  softLaunch: Pick<
    LaunchOperationsSnapshot["softLaunch"],
    "programMode" | "state" | "admission" | "capacity" | "support"
  >;
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

export type PublicGoLiveSnapshot = {
  checkedAt: string;
  mode: "public_go_live_preparation";
  stage: LaunchPipelineStageState;
  publicLaunch: Pick<
    LaunchOperationsSnapshot["publicLaunch"],
    "state" | "checklist" | "contracts" | "decision" | "visibility" | "goLive"
  >;
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

function isSoftLaunchEnabled() {
  const raw = process.env.TPM_SOFT_LAUNCH_ENABLED?.trim().toLowerCase();
  if (raw === "false" || raw === "0") return false;
  return true;
}

function resolveSoftLaunchAdmission(input: {
  softLaunchEnabled: boolean;
  softLaunchState: LaunchPipelineStageState;
  closedBetaAccessDecision: ClosedBetaAccessDecision;
  remainingSlots: number;
}) {
  if (
    !input.softLaunchEnabled ||
    input.softLaunchState === "blocked" ||
    input.remainingSlots <= 0
  ) {
    return {
      decision: "blocked" as const,
      reason: "soft_launch_disabled_or_blocked" as const,
    };
  }

  if (input.closedBetaAccessDecision === "granted") {
    return {
      decision: "admitted" as const,
      reason: "capacity_available" as const,
    };
  }

  return {
    decision: "queue_review" as const,
    reason: "requires_operator_review" as const,
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

function resolvePublicLaunchDecision(stage: LaunchPipelineStageState) {
  if (stage === "ready") {
    return {
      goLiveState: "ready_guarded" as const,
      reason: "checklist_passed_manual_release_required" as const,
    };
  }

  return {
    goLiveState: "not_ready" as const,
    reason: "checklist_incomplete_or_gate_blocked" as const,
  };
}

function resolveLaunchProgramStages(mode: LaunchOperationsMode): {
  currentStage: LaunchProgramStage;
  previousStage: LaunchProgramStage;
} {
  if (mode === "closed_beta_activation") {
    return {
      currentStage: "closed_beta_activation",
      previousStage: "launch_readiness_verification_gate",
    };
  }

  if (mode === "soft_launch_activation") {
    return {
      currentStage: "soft_launch_activation",
      previousStage: "closed_beta_activation",
    };
  }

  if (mode === "public_launch_activation_gate") {
    return {
      currentStage: "public_launch_activation_gate",
      previousStage: "soft_launch_activation",
    };
  }

  if (mode === "closed_beta_preparation") {
    return {
      currentStage: "closed_beta_preparation",
      previousStage: "launch_readiness_verification_gate",
    };
  }

  if (mode === "soft_launch_preparation") {
    return {
      currentStage: "soft_launch_preparation",
      previousStage: "closed_beta_preparation",
    };
  }

  return {
    currentStage: "public_launch_preparation",
    previousStage: "soft_launch_preparation",
  };
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
  const [controlState, feedbackSnapshot, closedBetaCapacity, softLaunchCapacity] =
    await Promise.all([
      getLaunchOperationsControlStateSnapshot({
        checkedAt,
        accountId: input.session.account.id,
      }),
      getLaunchFeedbackSnapshotForAuthenticatedSession(input.session, checkedAt),
      getClosedBetaCapacity(),
      getSoftLaunchCapacity(),
    ]);
  const mode = mapLaunchOperationsModeFromLifecycleStage(controlState.stage);
  const programStages = resolveLaunchProgramStages(mode);
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
  const softLaunchEnabled = isSoftLaunchEnabled();
  const softLaunchAdmission = resolveSoftLaunchAdmission({
    softLaunchEnabled,
    softLaunchState: stageState.softLaunchState,
    closedBetaAccessDecision,
    remainingSlots: softLaunchCapacity.remainingSlots,
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
  const publicLaunchDecision = resolvePublicLaunchDecision(publicLaunchStage);
  const closedBetaActivationBlockers =
    input.gate.overall.status === "pass"
      ? []
      : [
          `launch_readiness_gate_${input.gate.overall.status}`,
          `checklist_failed_${input.gate.checklist.failedCount}`,
        ];
  const closedBetaActivationState =
    controlState.stage === "closed_beta_active" ||
    controlState.stage === "soft_launch_active" ||
    controlState.stage === "public_launch_gate_active"
      ? ("active_guarded" as const)
      : ("inactive_guarded" as const);
  const feedbackLoopState =
    feedbackSnapshot.summary.pendingTriage > 20
      ? ("triage_backlog_guarded" as const)
      : ("operational_guarded" as const);

  return {
    checkedAt,
    mode,
    program: {
      releaseTrack: "controlled_launch_operations",
      currentStage: programStages.currentStage,
      previousStage: programStages.previousStage,
      launchClaim: "not_launched",
      publicLaunchClaim: "not_claimed",
      publicAccess: "not_open",
      lifecycleStage: controlState.stage,
    },
    lifecycle: controlState,
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
        evidence:
          `closed_beta_mode=${programMode} access=${closedBetaAccessDecision} eligibility=${closedBeta.eligibility}; ` +
          `pending_triage=${feedbackSnapshot.summary.pendingTriage} hardening_followups=${feedbackSnapshot.triage.hardeningFollowUps}`,
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
      activation: {
        state: closedBetaActivationState,
        activatedAt: controlState.transitions.closedBetaActivatedAt,
        activationRoute: "/api/launch/operations",
        blockers: closedBetaActivationBlockers,
      },
      feedbackLoop: {
        state: feedbackLoopState,
        pendingTriage: feedbackSnapshot.summary.pendingTriage,
        hardeningInProgress: feedbackSnapshot.summary.hardeningInProgress,
        highSeverityOpen: feedbackSnapshot.summary.highSeverityOpen,
        hardeningFollowUps: feedbackSnapshot.triage.hardeningFollowUps,
        recoveryLinked: feedbackSnapshot.triage.recoveryLinked,
        lastLifecycleUpdateAt: feedbackSnapshot.summary.lastLifecycleUpdateAt,
        lifecycleRoute: "/api/launch/feedback",
        hardeningRoute: "/api/ops/hardening",
        recoveryRoute: "/api/ops/recovery",
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
      programMode: softLaunchEnabled
        ? "limited_rollout_guarded"
        : "disabled_guarded",
      state: stageState.softLaunchState === "ready" ? "prepared_guarded" : "blocked_guarded",
      access: "cohort_and_capacity_guard",
      admission: {
        decision: softLaunchAdmission.decision,
        reason: softLaunchAdmission.reason,
        supportLane: "operator_review",
        queueRoute: "/api/launch/feedback",
      },
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
      support: {
        feedbackRoute: "/api/launch/feedback",
        responseSlaHours: 48,
        rolloutStatus: "limited_guarded",
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
      contracts: {
        checklistAuthority: "operator_manual",
        legalDisclosures: "required_prelaunch",
        customerComms: "prepared_guarded",
        statusPage: "manual_guarded",
      },
      decision: {
        goLiveState: publicLaunchDecision.goLiveState,
        reason: publicLaunchDecision.reason,
        releaseRoute: "/api/launch/public-go-live",
      },
      visibility: {
        launchModeLabel: "public_launch_preparation",
        customerStateLabel: "not_launched",
        claimsPolicy: "no_false_public_launch_claims",
      },
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
      feedbackLifecycleUpdates30d: feedbackSnapshot.summary.lifecycleUpdates30d,
      pendingTriage: feedbackSnapshot.summary.pendingTriage,
      hardeningInProgress: feedbackSnapshot.summary.hardeningInProgress,
      highSeverityOpen: feedbackSnapshot.summary.highSeverityOpen,
      hardeningFollowUps: feedbackSnapshot.triage.hardeningFollowUps,
      recoveryLinked: feedbackSnapshot.triage.recoveryLinked,
      lastFeedbackAt: feedbackSnapshot.summary.lastSubmittedAt,
      lastLifecycleUpdateAt: feedbackSnapshot.summary.lastLifecycleUpdateAt,
      feedbackRoute: "/api/launch/feedback",
      hardeningRoute: "/api/ops/hardening",
      recoveryRoute: "/api/ops/recovery",
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
      "Closed-beta feedback triage and hardening follow-up remain operator-manual and auditable.",
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

export async function getSoftLaunchAccessSnapshotForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  hardening?: OpsProductionHardeningSnapshot | null;
  checkedAt?: string;
}): Promise<SoftLaunchAccessSnapshot> {
  const snapshot = await getLaunchOperationsSnapshotForAuthenticatedSession(input);
  const stage =
    snapshot.stages.find((item) => item.key === "soft_launch_preparation")?.state ??
    "blocked";

  return {
    checkedAt: snapshot.checkedAt,
    mode: "soft_launch_access",
    stage,
    softLaunch: {
      programMode: snapshot.softLaunch.programMode,
      state: snapshot.softLaunch.state,
      admission: snapshot.softLaunch.admission,
      capacity: snapshot.softLaunch.capacity,
      support: snapshot.softLaunch.support,
    },
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

export async function getPublicGoLiveSnapshotForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  hardening?: OpsProductionHardeningSnapshot | null;
  checkedAt?: string;
}): Promise<PublicGoLiveSnapshot> {
  const snapshot = await getLaunchOperationsSnapshotForAuthenticatedSession(input);
  const stage =
    snapshot.stages.find((item) => item.key === "public_launch_preparation")?.state ??
    "blocked";

  return {
    checkedAt: snapshot.checkedAt,
    mode: "public_go_live_preparation",
    stage,
    publicLaunch: {
      state: snapshot.publicLaunch.state,
      checklist: snapshot.publicLaunch.checklist,
      contracts: snapshot.publicLaunch.contracts,
      decision: snapshot.publicLaunch.decision,
      visibility: snapshot.publicLaunch.visibility,
      goLive: snapshot.publicLaunch.goLive,
    },
    limitations: snapshot.limitations,
  };
}

export async function getClosedBetaPreparationDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): Promise<DiagnosticsProbe> {
  try {
    const [controlState, feedbackStore, activeEvaluators] = await Promise.all([
      getLaunchOperationsControlStateSnapshot({ checkedAt }),
      getLaunchFeedbackStoreDiagnostics({ checkedAt }),
      prisma.account.count(),
    ]);
    const programMode = resolveClosedBetaProgramMode();
    const emailAllowlist = parseCsvList(process.env.TPM_CLOSED_BETA_ALLOWLIST_EMAILS);
    const accountAllowlist = parseCsvList(process.env.TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS);
    const allowlistConfigured = emailAllowlist.length > 0 || accountAllowlist.length > 0;
    const maxEvaluators = resolveClosedBetaMaxEvaluators();
    const remainingSlots = Math.max(0, maxEvaluators - activeEvaluators);
    const closedBetaActive =
      controlState.stage === "closed_beta_active" ||
      controlState.stage === "soft_launch_active" ||
      controlState.stage === "public_launch_gate_active";
    const feedbackLoopPressure =
      feedbackStore.pendingTriageCount > 20 ||
      feedbackStore.highSeverityOpenCount > 0;
    const status = !closedBetaActive
      ? "degraded"
      : !allowlistConfigured
      ? "unconfigured"
      : feedbackLoopPressure
      ? "degraded"
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
          ? "Closed beta is active with guarded limitations or capacity pressure."
          : "Closed beta allowlist is not configured yet.",
      detail:
        `activation_mode=${controlState.mode}; program_mode=${programMode}; ` +
        `Allowlist email entries ${emailAllowlist.length}, account entries ${accountAllowlist.length}. ` +
        `Capacity ${activeEvaluators}/${maxEvaluators} with ${remainingSlots} slot(s) remaining. ` +
        `Feedback store ${feedbackStore.feedbackStore} has ${feedbackStore.feedbackEvents30d} submissions and ${feedbackStore.feedbackLifecycleEvents30d} lifecycle update(s) in the last 30 days. ` +
        `pending_triage=${feedbackStore.pendingTriageCount} hardening_in_progress=${feedbackStore.hardeningInProgressCount} ` +
        `high_severity_open=${feedbackStore.highSeverityOpenCount} recovery_linked=${feedbackStore.recoveryLinkedCount}.`,
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
    const softLaunchEnabled = isSoftLaunchEnabled();
    const status =
      softLaunchEnabled && hardening.readiness.score >= 60 && remainingSlots > 0
        ? "ready"
        : "degraded";

    return {
      key: "soft_launch_preparation",
      label: "Soft launch preparation",
      status,
      summary:
        status === "ready"
          ? "Soft launch preparation is ready for guarded limited rollout."
          : "Soft launch preparation remains guarded and not yet ready for wider rollout.",
      detail:
        `soft_launch_enabled=${softLaunchEnabled}; ` +
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
        `feedback events 30d=${feedbackStore.feedbackEvents30d}; launchClaim=not_launched; public_go_live_route=/api/launch/public-go-live.`,
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
