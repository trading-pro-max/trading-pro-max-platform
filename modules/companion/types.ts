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
    billing: "inactive";
    paidAccess: "not_enabled";
    vipActivation: "not_active";
    founderCommandAccess: "owner_only_never_user_plan";
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
  diagnostics: {
    readiness: "ready" | "guarded" | "blocked";
    feedbackState: string;
    aiIqContextQuality: "bounded";
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
  preferences: {
    skillLevel: string;
    riskProfile: string;
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

export type TPMCompanionMessage = {
  id: string;
  role: "companion" | "system";
  title: string;
  body: string;
  state?: "ready" | "blocked" | "planned" | "fallback";
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
