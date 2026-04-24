export type CompanionContextSource = "default_safe" | "route_context" | "authenticated_safe";

export type CompanionContextSnapshot = {
  checkedAt: string;
  mode: "companion_context_engine";
  source: CompanionContextSource;
  route: string;
  selectedAsset: string;
  timeframe: string;
  marketFeedState: "fallback_first" | "not_configured" | "external_guarded";
  executionTruth: {
    paperMode: "available";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerActivation: "blocked";
    feedActivation: "blocked";
  };
  account: {
    sessionState: "anonymous" | "authenticated_safe";
    planTier: "demo_free" | "pro" | "vip" | "enterprise";
    accountType: "standard" | "islamic_review_required" | "islamic_not_certified";
    accountTypeStatus: "standard_active" | "islamic_review_required" | "islamic_not_certified";
  };
  assistantTier: {
    tier: "demo_paper" | "pro" | "vip" | "enterprise";
    label: string;
    availability: "active" | "locked" | "planned_later";
    currentAccess: boolean;
    upgradeState: "none" | "not_enabled" | "future_planned";
  };
  planEntitlements: {
    currentPlan: "demo_free" | "pro" | "vip" | "enterprise";
    billing: "inactive";
    paidAccess: "not_enabled";
    vipActivation: "not_active";
    enterpriseActivation: "future_planned";
    founderCommandAccess: "owner_only_never_user_plan";
    performanceFee: "hidden_inactive";
  };
  productTruth: {
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    billing: "inactive";
    publicLaunch: "inactive";
    socialPublishing: "inactive";
    islamicCertification: "not_certified";
    performanceRevenue: "hidden_inactive";
    founderCommand: "owner_only_private";
  };
  preferences: {
    language: string;
    theme: "dark" | "light" | "system";
    skillLevel: "unknown" | "beginner" | "intermediate" | "advanced";
  };
  diagnostics: {
    readiness: "ready" | "guarded" | "blocked";
    feedbackState: "available_guarded" | "unavailable";
    aiIqContextQuality: "bounded";
  };
  safety: {
    secretsIncluded: false;
    privateSensitiveDataIncluded: false;
    brokerCredentialsIncluded: false;
    rawTokensIncluded: false;
    canExecuteTrades: false;
    canActivateLive: false;
    guaranteeClaimsAllowed: false;
    winRateClaimsAllowed: false;
  };
  guidanceBoundaries: string[];
};

export type CompanionContextInput = Partial<{
  route: string;
  selectedAsset: string;
  timeframe: string;
  language: string;
  theme: "dark" | "light" | "system";
  planTier: CompanionContextSnapshot["account"]["planTier"];
  sessionState: CompanionContextSnapshot["account"]["sessionState"];
}>;
