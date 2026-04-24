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
