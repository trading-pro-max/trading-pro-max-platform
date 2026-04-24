export type ProductStateExplanationKey =
  | "loading"
  | "empty"
  | "auth_required"
  | "no_access"
  | "blocked"
  | "fallback"
  | "degraded"
  | "not_configured"
  | "coming_later"
  | "protected_route"
  | "invalid_input"
  | "session_expired"
  | "feedback_failed"
  | "execution_blocked"
  | "live_disabled"
  | "broker_unavailable"
  | "feed_fallback"
  | "billing_inactive"
  | "vip_locked"
  | "islamic_review_required"
  | "launch_not_active";

export type ProductStateSeverity = "info" | "warning" | "blocked" | "error";

export type ProductStateExplanation = {
  key: ProductStateExplanationKey;
  title: string;
  shortMessage: string;
  reason: string;
  safeNextStep: string;
  severity: ProductStateSeverity;
  resolvedBy: "user" | "operator" | "founder" | "external_configuration" | "future_scope";
  userCopy: string;
  internalCopy: string;
};

export type ProductStateExplanationSnapshot = {
  checkedAt: string;
  mode: "state_error_blocked_engine";
  explanations: ProductStateExplanation[];
  truth: {
    rawJsonErrors: "blocked";
    fakeUnlocks: "blocked";
    scaryUnexplainedErrors: "blocked";
  };
};
