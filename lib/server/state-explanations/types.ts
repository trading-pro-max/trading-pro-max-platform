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
  | "real_money_blocked"
  | "broker_activation_blocked"
  | "broker_unavailable"
  | "live_feed_unavailable"
  | "feed_fallback"
  | "billing_inactive"
  | "pro_locked"
  | "vip_locked"
  | "islamic_review_required"
  | "islamic_certification_not_certified"
  | "launch_not_active"
  | "media_publishing_blocked"
  | "ai_video_publishing_blocked"
  | "social_publishing_inactive"
  | "social_accounts_unconnected"
  | "performance_fee_hidden"
  | "assistant_intent_restricted"
  | "founder_command_private";

export type ProductStateSeverity = "info" | "warning" | "blocked" | "error";

export type ProductStateExplanation = {
  key: ProductStateExplanationKey;
  title: string;
  shortMessage: string;
  reason: string;
  safeNextStep: string;
  severity: ProductStateSeverity;
  resolvedBy: "user" | "operator" | "founder" | "external_configuration" | "future_scope";
  blockerType:
    | "plan"
    | "auth"
    | "safety"
    | "legal"
    | "broker"
    | "feed"
    | "billing"
    | "launch"
    | "production"
    | "owner_private"
    | "future_scope";
  requiredConditionToUnblock: string;
  whoCanUnblock: "user" | "operator" | "founder" | "external_provider" | "future_product";
  state:
    | "hidden"
    | "planned"
    | "blocked"
    | "review_required"
    | "not_configured"
    | "not_certified";
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
