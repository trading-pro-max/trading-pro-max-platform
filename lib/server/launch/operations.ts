import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";
import type { LaunchReadinessGateSnapshot } from "./readiness";
import { getLaunchFeedbackSnapshotForAuthenticatedSession, getLaunchFeedbackStoreDiagnostics } from "./feedback";

export type LaunchOperationsMode = "closed_beta_preparation";

type LaunchPipelineStageKey =
  | "launch_readiness_verification_gate"
  | "closed_beta_preparation"
  | "production_hardening"
  | "soft_launch_preparation"
  | "public_launch_preparation";

type LaunchPipelineStageState = "ready" | "in_progress" | "blocked" | "not_started";

type ClosedBetaEligibility =
  | "eligible"
  | "review_required"
  | "allowlist_unconfigured";

type ClosedBetaMatchSource = "email" | "account" | "none";

export type LaunchOperationsSnapshot = {
  checkedAt: string;
  mode: LaunchOperationsMode;
  program: {
    releaseTrack: "controlled_launch_operations";
    currentStage: "closed_beta_preparation";
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

function parseCsvList(raw: string | null | undefined) {
  if (!raw) return [] as string[];
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0);
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
}) {
  const gateState: LaunchPipelineStageState =
    input.gate.overall.status === "pass" ? "ready" : "blocked";
  const closedBetaState: LaunchPipelineStageState =
    gateState === "ready" && input.closedBetaEligibility !== "allowlist_unconfigured"
      ? "in_progress"
      : "blocked";

  return {
    gateState,
    closedBetaState,
  };
}

export async function getLaunchOperationsSnapshotForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  checkedAt?: string;
}): Promise<LaunchOperationsSnapshot> {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const closedBeta = evaluateClosedBetaEligibility({
    email: input.session.user.email,
    accountId: input.session.account.id,
  });
  const stageState = buildStageState({
    gate: input.gate,
    closedBetaEligibility: closedBeta.eligibility,
  });
  const feedbackSnapshot = await getLaunchFeedbackSnapshotForAuthenticatedSession(
    input.session,
    checkedAt
  );

  return {
    checkedAt,
    mode: "closed_beta_preparation",
    program: {
      releaseTrack: "controlled_launch_operations",
      currentStage: "closed_beta_preparation",
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
        state: "not_started",
        required: true,
        evidence: "Stage not started.",
      },
      {
        key: "soft_launch_preparation",
        state: "not_started",
        required: true,
        evidence: "Stage not started.",
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
      "Closed-beta access remains allowlist-gated and does not imply public launch.",
      "Support intake is operator-reviewed through authenticated feedback contracts.",
      "Live execution, real-money routing, and paid billing remain blocked or inactive.",
    ],
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
