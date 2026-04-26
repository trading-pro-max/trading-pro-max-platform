export type CompanionContextSource = "default_safe" | "route_context" | "authenticated_safe";

export type CompanionIntentCategory =
  | "explain_platform_state"
  | "explain_blocked_state"
  | "explain_plan_access"
  | "explain_account_type"
  | "explain_paper_mode"
  | "explain_feed_fallback"
  | "explain_billing_inactive"
  | "explain_live_disabled"
  | "explain_real_money_blocked"
  | "explain_market_context"
  | "guide_to_settings"
  | "guide_to_diagnostics"
  | "guide_to_feedback"
  | "draft_feedback"
  | "journal_prompt"
  | "coach_prompt"
  | "session_summary"
  | "learning_help"
  | "personal_reality_calm"
  | "personal_reality_focus"
  | "personal_reality_chart_comfort"
  | "personal_reality_low_motion"
  | "personal_reality_static"
  | "personal_reality_high_contrast"
  | "personal_reality_learning"
  | "personal_reality_explain_locked"
  | "explain_plan_upgrade_without_billing"
  | "explain_upgrade_path_without_billing"
  | "founder_unavailable_for_user";

export type CompanionBlockedIntentCategory =
  | "execute_trade"
  | "enable_live"
  | "enable_real_money"
  | "activate_broker"
  | "activate_feed"
  | "activate_billing"
  | "reveal_secrets"
  | "bypass_auth"
  | "guarantee_profit"
  | "provide_win_rate"
  | "fake_vip_activation"
  | "fake_institutional_activation"
  | "fake_billing"
  | "fake_launch"
  | "publish_social"
  | "provide_legal_advice"
  | "provide_financial_advice";

export type CompanionDailyUseMode =
  | "orientation"
  | "platform_state_help"
  | "why_blocked_help"
  | "journal_help"
  | "coach_help"
  | "feedback_help"
  | "settings_help"
  | "diagnostics_help"
  | "personal_reality_help"
  | "plan_explanation"
  | "learning_help"
  | "session_summary";

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

export type CompanionBlockedIntentAvailability = {
  intent: CompanionBlockedIntentCategory;
  label: string;
  allowedPlans: [];
  responseStyle: "blocked_with_safe_alternative";
  safetyBoundary: string;
  blockedReason: string;
  safeAlternative: string;
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
    publicPlanName: "Free" | "Pro" | "VIP" | "Institutional";
    billing: "inactive";
    paidAccess: "not_enabled";
    vipActivation: "not_active";
    enterpriseActivation: "future_planned";
    institutionalActivation: "future_planned";
    founderCommandAccess: "owner_only_never_user_plan";
    ownerCommandAccess: "owner_only_never_user_plan";
    performanceFee: "hidden_inactive";
  };
  realm: {
    realmId: "free_earth" | "pro_orbit" | "vip_lunar" | "institutional_station";
    publicPlanName: "Free" | "Pro" | "VIP" | "Institutional";
    activationState: "active" | "planned" | "future";
    earthPerspective: string;
    assistantBehavior: string;
    journalCoachDepth: string;
    workspaceBehavior: string;
    reportsDepth: string;
    appsPlatformsAccess: string;
    supportAccess: string;
    upgradeExplanation: string;
  };
  planAccess: {
    planClass: "guest" | "demo_free" | "pro" | "vip" | "enterprise" | "staff_operator" | "founder_king";
    label: string;
    activeLayer: string;
    assistantLevel: string;
    visibleSurfaces: string[];
    lockedCapabilities: string[];
    plannedCapabilities: string[];
    hiddenCapabilities: string[];
    ownerCommandUserVisible: false;
    performanceFeeUserVisible: false;
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
  earthReality: {
    status: "not_ready" | "partial" | "ready_with_notes" | "earth_ready_local" | "blocked";
    score: number;
    publicPrivateBoundaryStatus: "preserved";
    publicCopy: string;
  };
  personalReality: {
    status: "ready_with_notes";
    assistantControlled: true;
    planAware: true;
    productTruthGuarded: true;
    freeControls: string[];
    plannedControls: string[];
    futureControls: string[];
  };
  whyBlocked: {
    liveDisabled: string;
    realMoneyBlocked: string;
    brokerUnavailable: string;
    feedFallback: string;
    billingInactive: string;
    proPlanned: string;
    vipPlanned: string;
    institutionalFuture: string;
    islamicNotCertified: string;
    launchInactive: string;
    socialPublishingInactive: string;
    restrictedControlsPrivate: string;
  };
  journalCoach: {
    readiness: "basic_safe_prompts_active";
    persistence: "local_session_memory_foundation";
    accountSafePersistence: "planned";
    canSuggestJournalNotes: true;
    canSuggestCoachPrompts: true;
    canPromiseResults: false;
    canGiveFinancialAdvice: false;
    canFakePersistence: false;
  };
  memoryReadiness: {
    mode: "session_local_foundation";
    localNotesSupported: true;
    safeSummariesOnly: true;
    accountSafePersistence: "planned";
    productionSync: "inactive";
    surveillance: "blocked";
  };
  settingsReadiness: {
    route: "/settings";
    canGuide: true;
    canChangeSecrets: false;
    canActivateBilling: false;
  };
  diagnosticsReadiness: {
    route: "/diagnostics";
    canGuide: true;
    rawSecretsVisible: false;
    ownerOnlyDataVisible: false;
  };
  preferences: {
    language: string;
    theme: "dark" | "light" | "system";
    skillLevel: "unknown" | "beginner" | "intermediate" | "advanced" | "professional" | "learning_only";
    riskProfile: "learning" | "conservative" | "balanced" | "active" | "high_caution";
  };
  dailyUse: {
    assistantName: "TPM Assistant";
    role: "safe_daily_workspace_assistant";
    modes: CompanionDailyUseMode[];
    publicLanguage: ["Free", "Pro", "VIP", "Institutional", "TPM Assistant"];
    nonAdvice: true;
    nonExecuting: true;
    nonPredictive: true;
    localOperationSupport: true;
  };
  brain: {
    contextQuality: "bounded" | "limited" | "ready";
    decisionSupportMode: string;
    userGuidanceMode: string;
    safeNextActions: string[];
    blockedCapabilities: string[];
  };
  intents: CompanionIntentAvailability[];
  blockedIntentRegistry: CompanionBlockedIntentAvailability[];
  diagnostics: {
    readiness: "ready" | "guarded" | "blocked";
    feedbackState: "available_guarded" | "unavailable";
    aiIqContextQuality: "bounded";
    assistantDailyUse: "ready";
    whyBlockedIntegration: "ready";
    journalCoachIntegration: "ready";
    blockedIntentCoverage: "ready";
  };
  safety: {
    secretsIncluded: false;
    privateSensitiveDataIncluded: false;
    brokerCredentialsIncluded: false;
    paymentDataIncluded: false;
    socialTokensIncluded: false;
    rawPrivateLogsIncluded: false;
    rawTokensIncluded: false;
    canExecuteTrades: false;
    canActivateLive: false;
    canActivateBilling: false;
    canActivateBrokerFeed: false;
    canPublishSocial: false;
    financialAdviceAllowed: false;
    legalAdviceAllowed: false;
    guaranteeClaimsAllowed: false;
    winRateClaimsAllowed: false;
    pressureToTradeAllowed: false;
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
