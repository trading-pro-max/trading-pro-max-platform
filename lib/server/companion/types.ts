export type CompanionContextSource = "default_safe" | "route_context" | "authenticated_safe";

export type CompanionIntentCategory =
  | "explain_platform_state"
  | "explain_blocked_state"
  | "explain_market_context"
  | "explain_plan_access"
  | "explain_account_type"
  | "guide_to_settings"
  | "guide_to_diagnostics"
  | "guide_to_feedback"
  | "draft_feedback"
  | "journal_prompt"
  | "session_summary"
  | "learning_help"
  | "explain_plan_upgrade_without_billing"
  | "founder_unavailable_for_user";

export type CompanionBlockedIntentCategory =
  | "execute_trade"
  | "enable_live"
  | "enable_real_money"
  | "activate_broker"
  | "activate_feed"
  | "change_secrets"
  | "bypass_auth"
  | "guarantee_profit"
  | "provide_win_rate"
  | "fake_vip_activation"
  | "fake_billing"
  | "fake_launch";

export type CompanionIntentAvailability = {
  intent: CompanionIntentCategory;
  label: string;
  demoFree: "allowed" | "blocked";
  pro: "allowed" | "planned" | "blocked";
  vip: "allowed" | "planned" | "blocked";
  enterprise: "future" | "blocked";
  safetyBoundary: string;
  responseStyle: string;
  blockedLanguage: string[];
};

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
  planetAccess: {
    citizenClass: "guest" | "demo_free" | "pro" | "vip" | "enterprise" | "staff_operator" | "founder_king";
    activeLayer: string;
    companionLevel: string;
    visibleCities: string[];
    lockedFeatures: string[];
    plannedFeatures: string[];
    hiddenFeatures: string[];
    founderCommandUserVisible: false;
    performanceFeeUserVisible: false;
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
    skillLevel: "unknown" | "beginner" | "intermediate" | "advanced" | "professional" | "learning_only";
    riskProfile: "learning" | "conservative" | "balanced" | "active" | "high_caution";
  };
  brain: {
    contextQuality: "bounded" | "limited" | "ready";
    decisionSupportMode: string;
    userGuidanceMode: string;
    safeNextActions: string[];
    blockedCapabilities: string[];
  };
  intents: CompanionIntentAvailability[];
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
  blockedIntents: CompanionBlockedIntentCategory[];
};

export type CompanionContextInput = Partial<{
  route: string;
  selectedAsset: string;
  timeframe: string;
  language: string;
  theme: "dark" | "light" | "system";
  planTier: CompanionContextSnapshot["account"]["planTier"];
  sessionState: CompanionContextSnapshot["account"]["sessionState"];
  skillLevel: Exclude<CompanionContextSnapshot["preferences"]["skillLevel"], "unknown">;
  riskProfile: CompanionContextSnapshot["preferences"]["riskProfile"];
}>;
