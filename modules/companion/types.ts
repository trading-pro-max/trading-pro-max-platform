import type { PlanFeatureState, PlanId } from "@/lib/plans/types";
import type { StateExplanationView } from "@/modules/state-explanations/types";

export type TPMCompanionContextView = {
  checkedAt: string;
  route: string;
  selectedAsset: string;
  timeframe: string;
  marketFeedState: string;
  account: {
    sessionState: "anonymous" | "authenticated_safe";
    planTier: PlanId;
    accountTypeStatus: string;
  };
  assistantTier: {
    tier: string;
    label: string;
    availability: string;
    currentAccess: boolean;
    upgradeState: string;
  };
  planEntitlements: {
    currentPlan: PlanId;
    publicPlanName: "Free" | "Pro" | "VIP" | "Institutional";
    billing: "inactive";
    paidAccess: "not_enabled";
    vipActivation: "not_active";
    institutionalActivation: "future_planned";
    founderCommandAccess: "owner_only_never_user_plan";
    ownerCommandAccess: "owner_only_never_user_plan";
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
    founderCommand: "owner_only_private";
  };
  earthReality: {
    status: string;
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
    localNotesSupported: boolean;
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
  diagnostics: {
    readiness: "ready" | "guarded" | "blocked";
    feedbackState: string;
    aiIqContextQuality: "bounded";
    assistantDailyUse: "ready";
    whyBlockedIntegration: "ready";
    journalCoachIntegration: "ready";
    blockedIntentCoverage: "ready";
  };
  brain: {
    contextQuality: "bounded" | "limited" | "ready";
    decisionSupportMode: string;
    userGuidanceMode: string;
    safeNextActions: string[];
    blockedCapabilities: string[];
  };
  intents: Array<{
    intent: string;
    label: string;
    demoFree: "allowed" | "blocked";
    pro: "allowed" | "planned" | "blocked";
    vip: "allowed" | "planned" | "blocked";
    enterprise: "future" | "blocked";
    safetyBoundary: string;
    responseStyle: string;
    blockedLanguage: string[];
  }>;
  blockedIntentRegistry: Array<{
    intent: string;
    label: string;
    allowedPlans: [];
    responseStyle: "blocked_with_safe_alternative";
    safetyBoundary: string;
    blockedReason: string;
    safeAlternative: string;
  }>;
  preferences: {
    skillLevel: string;
    riskProfile: string;
  };
  dailyUse: {
    assistantName: "Pro Max Assistant";
    role: "safe_daily_workspace_assistant";
    modes: string[];
    publicLanguage: ["Free", "Pro", "VIP", "Institutional", "Pro Max Assistant"];
    nonAdvice: true;
    nonExecuting: true;
    nonPredictive: true;
    localOperationSupport: true;
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
  blockedIntents: string[];
};

export type TPMCompanionMessage = {
  id: string;
  role: "companion" | "system" | "user";
  title: string;
  body: string;
  state?: "ready" | "blocked" | "planned" | "fallback";
  safeNextStep?: string;
};

export type TPMCompanionPrompt = {
  id: string;
  label: string;
  response: TPMCompanionMessage;
};

export type TPMCompanionPlanView = {
  active: PlanFeatureState[];
  locked: PlanFeatureState[];
  comingLater: PlanFeatureState[];
};

export type TPMCompanionStateExplanationMap = Record<string, StateExplanationView>;

export type TPMCompanionResponseTemplate = {
  intent: string;
  title: string;
  body: string;
  safeNextStep: string;
  state: "ready" | "blocked" | "planned" | "fallback";
};
