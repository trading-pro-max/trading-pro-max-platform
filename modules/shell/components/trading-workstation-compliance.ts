import type {
  AccountActivationSurface,
  AccountDisclosureAnchor,
  AccountDisclosureKey,
  AccountLifecycleState,
  AccountMode,
  AccountPolicySurface,
  AccountReviewState,
} from "../types/platform-state";

type LocalDisclosureState = {
  accepted: boolean;
  acceptedAt: string;
};

export type LocalComplianceState = {
  disclosures: Record<AccountDisclosureKey, LocalDisclosureState>;
  reviewState: AccountReviewState;
  reviewStartedAt: string;
  reviewUpdatedAt: string;
};

const DISCLOSURE_KEYS = [
  "risk",
  "paper_trading",
  "jurisdiction",
  "terms",
] as const satisfies readonly AccountDisclosureKey[];

const DISCLOSURE_VERSION = "phase_1_local";

function createDisclosureState(accepted: boolean): Record<
  AccountDisclosureKey,
  LocalDisclosureState
> {
  return {
    risk: { accepted, acceptedAt: "" },
    paper_trading: { accepted, acceptedAt: "" },
    jurisdiction: { accepted, acceptedAt: "" },
    terms: { accepted, acceptedAt: "" },
  };
}

function isReviewLocked(reviewState: AccountReviewState) {
  return reviewState === "approved_for_paper" || reviewState === "restricted" || reviewState === "rejected";
}

function hasAllAccepted(state: LocalComplianceState) {
  return DISCLOSURE_KEYS.every((key) => state.disclosures[key].accepted);
}

function acceptedCount(state: LocalComplianceState) {
  return DISCLOSURE_KEYS.filter((key) => state.disclosures[key].accepted).length;
}

function latestDisclosureAt(state: LocalComplianceState) {
  const acceptedAt = DISCLOSURE_KEYS.map((key) => state.disclosures[key].acceptedAt).filter(
    (value) => !!value
  );

  return acceptedAt[acceptedAt.length - 1] || "";
}

function deriveLifecycleState(state: LocalComplianceState): AccountLifecycleState {
  const accepted = acceptedCount(state);

  if (state.reviewState === "restricted") return "restricted";
  if (state.reviewState === "rejected") return "blocked";
  if (state.reviewState === "approved_for_paper" && accepted === DISCLOSURE_KEYS.length) {
    return "paper_active";
  }
  if (state.reviewState === "pending_review") return "review_pending";
  if (accepted === 0 && state.reviewState === "not_started") return "onboarding";
  if (accepted < DISCLOSURE_KEYS.length) return "disclosures_pending";
  if (state.reviewState === "in_progress" || state.reviewState === "not_started") {
    return "kyc_pending";
  }

  return "onboarding";
}

function deriveActivationSurface(
  accountMode: AccountMode,
  lifecycleState: AccountLifecycleState
): AccountActivationSurface {
  if (lifecycleState === "restricted") {
    return {
      paperState: "restricted",
      liveState: "blocked",
      reason: "restricted_account",
      nextStep: "contact_support",
      executionEnabled: false,
    };
  }

  if (lifecycleState === "blocked") {
    return {
      paperState: "blocked",
      liveState: "blocked",
      reason: "blocked_account",
      nextStep: "contact_support",
      executionEnabled: false,
    };
  }

  if (accountMode === "real") {
    if (lifecycleState === "onboarding" || lifecycleState === "disclosures_pending") {
      return {
        paperState: "gated",
        liveState: "blocked",
        reason: "disclosures_required",
        nextStep: "accept_disclosures",
        executionEnabled: false,
      };
    }

    if (lifecycleState === "kyc_pending") {
      return {
        paperState: "gated",
        liveState: "blocked",
        reason: "kyc_required",
        nextStep: "complete_verification",
        executionEnabled: false,
      };
    }

    if (lifecycleState === "review_pending") {
      return {
        paperState: "gated",
        liveState: "blocked",
        reason: "review_pending",
        nextStep: "await_review",
        executionEnabled: false,
      };
    }

    return {
      paperState: "gated",
      liveState: "blocked",
      reason: "paper_only_mode",
      nextStep: "await_review",
      executionEnabled: false,
    };
  }

  if (lifecycleState === "onboarding" || lifecycleState === "disclosures_pending") {
    return {
      paperState: "gated",
      liveState: "blocked",
      reason: "disclosures_required",
      nextStep: "accept_disclosures",
      executionEnabled: false,
    };
  }

  if (lifecycleState === "kyc_pending") {
    return {
      paperState: "gated",
      liveState: "blocked",
      reason: "kyc_required",
      nextStep: "complete_verification",
      executionEnabled: false,
    };
  }

  if (lifecycleState === "review_pending") {
    return {
      paperState: "gated",
      liveState: "blocked",
      reason: "review_pending",
      nextStep: "await_review",
      executionEnabled: false,
    };
  }

  return {
    paperState: "enabled",
    liveState: "blocked",
    reason: "paper_ready",
    nextStep: "paper_ready",
    executionEnabled: true,
  };
}

function buildReviewReference(accountMode: AccountMode) {
  return accountMode === "demo" ? "TPM-PAPER-LOCAL" : "TPM-REAL-SAFE";
}

export function createDefaultLocalComplianceState(
  accountMode: AccountMode
): LocalComplianceState {
  if (accountMode === "demo") {
    return {
      disclosures: createDisclosureState(true),
      reviewState: "approved_for_paper",
      reviewStartedAt: "",
      reviewUpdatedAt: "",
    };
  }

  return {
    disclosures: createDisclosureState(false),
    reviewState: "not_started",
    reviewStartedAt: "",
    reviewUpdatedAt: "",
  };
}

export function sanitizeLocalComplianceState(
  value: Partial<LocalComplianceState> | undefined,
  fallback: LocalComplianceState
): LocalComplianceState {
  const disclosures = DISCLOSURE_KEYS.reduce(
    (acc, key) => {
      const raw = value?.disclosures?.[key];

      acc[key] = {
        accepted: typeof raw?.accepted === "boolean" ? raw.accepted : fallback.disclosures[key].accepted,
        acceptedAt:
          typeof raw?.acceptedAt === "string" ? raw.acceptedAt : fallback.disclosures[key].acceptedAt,
      };

      return acc;
    },
    {} as LocalComplianceState["disclosures"]
  );

  const reviewState: AccountReviewState =
    value?.reviewState === "in_progress" ||
    value?.reviewState === "pending_review" ||
    value?.reviewState === "approved_for_paper" ||
    value?.reviewState === "restricted" ||
    value?.reviewState === "rejected"
      ? value.reviewState
      : fallback.reviewState;

  return {
    disclosures,
    reviewState,
    reviewStartedAt:
      typeof value?.reviewStartedAt === "string" ? value.reviewStartedAt : fallback.reviewStartedAt,
    reviewUpdatedAt:
      typeof value?.reviewUpdatedAt === "string" ? value.reviewUpdatedAt : fallback.reviewUpdatedAt,
  };
}

export function acceptAllLocalDisclosures(
  state: LocalComplianceState,
  acceptedAt: string
): LocalComplianceState {
  if (isReviewLocked(state.reviewState) && hasAllAccepted(state)) {
    return state;
  }

  return {
    ...state,
    disclosures: DISCLOSURE_KEYS.reduce(
      (acc, key) => {
        acc[key] = {
          accepted: true,
          acceptedAt,
        };

        return acc;
      },
      {} as LocalComplianceState["disclosures"]
    ),
    reviewState: state.reviewState === "not_started" ? "in_progress" : state.reviewState,
    reviewStartedAt: state.reviewStartedAt || acceptedAt,
    reviewUpdatedAt: acceptedAt,
  };
}

export function submitLocalComplianceReview(
  state: LocalComplianceState,
  submittedAt: string
): LocalComplianceState {
  if (!hasAllAccepted(state) || isReviewLocked(state.reviewState) || state.reviewState === "pending_review") {
    return state;
  }

  return {
    ...state,
    reviewState: "pending_review",
    reviewStartedAt: state.reviewStartedAt || submittedAt,
    reviewUpdatedAt: submittedAt,
  };
}

export function canAcceptPendingDisclosures(state: LocalComplianceState) {
  if (state.reviewState === "restricted" || state.reviewState === "rejected") {
    return false;
  }

  return DISCLOSURE_KEYS.some((key) => !state.disclosures[key].accepted);
}

export function canSubmitComplianceReview(state: LocalComplianceState) {
  if (!hasAllAccepted(state)) return false;

  return (
    state.reviewState === "not_started" ||
    state.reviewState === "in_progress"
  );
}

export function deriveAccountCompliancePolicy(
  accountMode: AccountMode,
  state: LocalComplianceState
): Pick<AccountPolicySurface, "lifecycle" | "disclosures" | "review" | "activation"> {
  const lifecycleState = deriveLifecycleState(state);
  const lifecycleUpdatedAt = state.reviewUpdatedAt || latestDisclosureAt(state);
  const disclosures: AccountDisclosureAnchor[] = DISCLOSURE_KEYS.map((key) => ({
    key,
    state: state.disclosures[key].accepted ? "accepted" : "pending",
    acceptedAt: state.disclosures[key].acceptedAt || undefined,
    version: DISCLOSURE_VERSION,
  }));

  return {
    lifecycle: {
      state: lifecycleState,
      updatedAt: lifecycleUpdatedAt,
    },
    disclosures,
    review: {
      state: state.reviewState,
      reference: buildReviewReference(accountMode),
      startedAt: state.reviewStartedAt,
      updatedAt: state.reviewUpdatedAt,
    },
    activation: deriveActivationSurface(accountMode, lifecycleState),
  };
}
