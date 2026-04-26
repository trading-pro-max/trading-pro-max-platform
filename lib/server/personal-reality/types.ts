import type { PlanId } from "@/lib/plans/types";
import type { PlanRealmId } from "@/lib/plans/realms/types";

export type PersonalRealityMode =
  | "clean"
  | "focus"
  | "calm"
  | "learning"
  | "chart_first"
  | "low_motion"
  | "static"
  | "high_contrast"
  | "professional_orbit"
  | "lunar_premium"
  | "institutional_station"
  | "alkon_private";

export type PersonalRealityLayer =
  | "visual"
  | "workspace"
  | "learning"
  | "assistant"
  | "plan"
  | "safety"
  | "environment"
  | "accessibility";

export type PersonalRealityAvailability =
  | "active"
  | "planned"
  | "locked"
  | "future"
  | "blocked"
  | "internal_only";

export type PersonalRealitySetting = {
  settingId: string;
  name: string;
  layer: PersonalRealityLayer;
  description: string;
  availability: PersonalRealityAvailability;
  allowedPlans: PlanId[];
  blockedPlans: PlanId[];
  requiresEntitlement: boolean;
  requiresConfirmation: boolean;
  publicVisible: boolean;
  founderVisible: boolean;
  safetyNotes: string[];
  productTruthNotes: string[];
};

export type PersonalRealityProfile = {
  profileId: PersonalRealityMode;
  name: string;
  publicLabel: string;
  planRealm: PlanRealmId;
  visualSettings: string[];
  workspaceSettings: string[];
  learningSettings: string[];
  assistantSettings: string[];
  environmentSettings: string[];
  accessibilitySettings: string[];
  safetyBoundaries: string[];
  upgradeExplanation: string;
  availability: PersonalRealityAvailability;
  allowedPlans: PlanId[];
  publicVisible: boolean;
  founderVisible: boolean;
};

export type PersonalRealityIntent =
  | "calm_request"
  | "focus_request"
  | "chart_size_request"
  | "reduce_motion_request"
  | "static_mode_request"
  | "high_contrast_request"
  | "professional_theme_request"
  | "premium_theme_request"
  | "learning_mode_request"
  | "assistant_style_request"
  | "explain_locked_feature"
  | "reset_experience"
  | "blocked_activation_request";

export type PersonalRealityIntentInterpretation = {
  intent: PersonalRealityIntent;
  confidence: number;
  requestedLayer: PersonalRealityLayer;
  requestedSettings: string[];
  requiresPlanCheck: boolean;
  requiresSafetyCheck: boolean;
  requiresConfirmation: boolean;
  safeResponseHint: string;
};

export type PersonalRealityEngineInput = {
  userIntent: string;
  currentPlanRealm?: PlanRealmId;
  currentPlan?: PlanId;
  currentSurface?: string;
  currentEnvironmentMode?: string;
  currentMotionPreference?: "system" | "reduced" | "full" | "static";
  currentAccessibilitySettings?: string[];
  entitlementState?: "free_active" | "pro_entitled" | "vip_entitled" | "institutional_entitled";
};

export type PersonalRealityEngineOutput = {
  checkedAt: string;
  mode: "personal_operating_reality_engine";
  interpretation: PersonalRealityIntentInterpretation;
  allowedSettings: PersonalRealitySetting[];
  blockedSettings: PersonalRealitySetting[];
  explanation: string;
  previewProfile: PersonalRealityProfile;
  applyPlan: {
    canApply: boolean;
    appliesNow: string[];
    previewOnly: boolean;
    noBillingActivation: true;
    noLiveExecution: true;
    noPrivateExposure: true;
  };
  requiresConfirmation: boolean;
  upgradeExplanation: string;
  safeAlternative: string;
  publicCopy: string;
  diagnosticsSummary: {
    status: "ready" | "planned" | "blocked";
    profile: string;
    allowedCount: number;
    blockedCount: number;
    productTruthPreserved: true;
  };
  productTruth: {
    paidPlanActivated: false;
    billingActivated: false;
    liveExecutionActivated: false;
    brokerFeedActivated: false;
    realMoneyActivated: false;
    privateSystemsExposed: false;
    weatherOrSessionAdvice: false;
  };
};

export type PersonalRealityReadinessSnapshot = {
  checkedAt: string;
  mode: "personal_reality_readiness";
  status: "ready_with_notes";
  publicProfiles: PersonalRealityProfile[];
  publicSettings: PersonalRealitySetting[];
  internalProfilesHidden: number;
  freeControls: string[];
  plannedControls: string[];
  futureControls: string[];
  blockedControls: string[];
  assistantControlled: true;
  planAware: true;
  productTruthGuarded: true;
  publicPrivateBoundaryStatus: "preserved";
  diagnosticsSummary: {
    label: "Personal Reality";
    copy: string;
  };
};
