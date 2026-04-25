import "server-only";

import type {
  BrandMotionIntensity,
  BrandOccasionThemeKey,
  BrandSurface,
} from "@/lib/brand/types";
import type { TPMEarthMarkState, TPMEarthMarkVariant } from "@/modules/brand/components";

export type { BrandMotionIntensity, BrandOccasionThemeKey, BrandSurface };

export type BrandAudience = "public" | "authenticated_user" | "founder" | "internal";

export type BrandPlan = "guest" | "free" | "pro" | "vip" | "institutional" | "founder";

export type BrandTheme = "dark" | "light" | "system";

export type BrandIdentityState =
  | "ready"
  | "paper_safe"
  | "local_only"
  | "fallback"
  | "blocked"
  | "review_required"
  | "degraded"
  | "inactive"
  | "planned"
  | "future"
  | "not_certified";

export type BrandSafetyLevel = "safe" | "caution" | "review_required" | "blocked";

export type BrandFounderPreferenceMode = "default" | "strict_ahmad_preferences";

export type BrandIntelligenceInput = {
  surface: BrandSurface;
  plan: BrandPlan;
  state: BrandIdentityState;
  occasion?: BrandOccasionThemeKey;
  audience: BrandAudience;
  motionPreference?: "system" | "reduced" | "full";
  theme?: BrandTheme;
  founderPreference?: BrandFounderPreferenceMode;
  publicLanguageRequired?: boolean;
  legalSafety?: BrandSafetyLevel;
  guardianSafety?: BrandSafetyLevel;
  chartPriority?: "low" | "medium" | "high";
  reducedMotion?: boolean;
};

export type BrandVoiceRule = {
  tone: string;
  copyStyle: string;
  forbiddenClaims: string[];
};

export type BrandIdentityDecision = {
  input: Required<BrandIntelligenceInput>;
  earthMarkVariant: TPMEarthMarkVariant;
  earthMarkState: TPMEarthMarkState;
  earthMarkAnimated: boolean;
  identityIntensity: BrandMotionIntensity;
  motionIntensity: BrandMotionIntensity;
  accentPalette: string;
  planVisualDNA: string[];
  stateVisualLanguage: string;
  occasionSkin: BrandOccasionThemeKey;
  brandVoice: BrandVoiceRule;
  allowedTerminology: string[];
  blockedTerminology: string[];
  safeCopyRules: string[];
  visualGuardrails: string[];
  requiresFounderApproval: boolean;
  requiresLegalReview: boolean;
  requiresGuardianReview: boolean;
  publicSafe: boolean;
};

export type BrandGenomeSnapshot = {
  checkedAt: string;
  mode: "brand_genome";
  constants: string[];
  immutable: true;
  truth: {
    noFakeClaims: true;
    noCasinoFeeling: true;
    noCompetitorCopying: true;
    noUncontractedBrandUse: true;
  };
};

export type BrandPlanDNA = {
  plan: BrandPlan;
  publicLabel: string;
  audience: BrandAudience;
  palette: string;
  traits: string[];
  activationTruth: string;
  forbiddenClaims: string[];
};

export type BrandStateLanguage = {
  state: BrandIdentityState;
  label: string;
  userCopyStyle: string;
  visualTone: string;
  markBehavior: TPMEarthMarkState;
  colorRole: string;
  urgency: "calm" | "normal" | "review" | "blocked";
  allowedSurfaces: BrandSurface[];
  forbiddenClaims: string[];
  assistantWordingRule: string;
  founderInternalWordingRule: string;
};

export type IdentityGuardianOutcome =
  | "safe"
  | "caution"
  | "review_required"
  | "founder_approval_required"
  | "blocked";

export type IdentityGuardianReview = {
  checkedAt: string;
  outcome: IdentityGuardianOutcome;
  reasons: string[];
  blockedReasons: string[];
  safeAlternative: string;
  requiredReviews: string[];
};

export type IdentityEvolutionDecision = {
  changeType: "minor" | "major" | "blocked";
  requiredReviews: string[];
  founderApprovalRequired: boolean;
  safeToAutoDraft: boolean;
  blockedReasons: string[];
};

export type IdentitySurfaceSimulation = {
  surface: BrandSurface;
  decision: BrandIdentityDecision;
  risks: string[];
  safeAdjustments: string[];
  blockedItems: string[];
};

export type LivingBrandIntelligenceSnapshot = {
  checkedAt: string;
  mode: "tpm_living_brand_intelligence";
  status: "ready";
  genome: BrandGenomeSnapshot;
  sampleDecisions: BrandIdentityDecision[];
  guardianReadiness: "ready";
  planDNAReadiness: "ready";
  stateLanguageReadiness: "ready";
  occasionGovernanceReadiness: "ready";
  surfaceSimulationReadiness: "ready";
  truth: {
    rasterAssetsUsed: false;
    externalImagesUsed: false;
    liveExecutionActivated: false;
    realMoneyActivated: false;
    brokerFeedActivated: false;
    billingActivated: false;
    publicLaunchActivated: false;
    fakeSwissClaim: false;
    publicInternalTerminologyLeakAllowed: false;
  };
};
