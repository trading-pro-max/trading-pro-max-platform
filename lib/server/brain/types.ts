import type { PlanId } from "@/lib/plans/types";
import type { ProductStateExplanationKey } from "@/lib/server/state-explanations/types";
import type { UserRiskProfile, UserSkillLevel } from "@/lib/server/user-profile/types";

export type BrainContextQuality = "bounded" | "limited" | "ready";

export type BrainDecisionSupportMode =
  | "paper_decision_support"
  | "blocked_capability_explanation"
  | "learning_context"
  | "founder_readiness_context";

export type BrainGuidanceMode =
  | "beginner_safe"
  | "guided_operator"
  | "advanced_review"
  | "founder_command_summary";

export type TpmBrainContextSnapshot = {
  checkedAt: string;
  mode: "tpm_brain_context_layer";
  route: string;
  selectedAsset: string;
  timeframe: string;
  contextQuality: BrainContextQuality;
  decisionSupportMode: BrainDecisionSupportMode;
  userGuidanceMode: BrainGuidanceMode;
  founderGuidanceMode: BrainGuidanceMode;
  skillProfile: {
    skillLevel: UserSkillLevel;
    riskProfile: UserRiskProfile;
    guidanceDepth: string;
  };
  plan: {
    currentPlan: PlanId;
    companionLevel: string;
    paidAccess: "not_enabled";
    vipActivation: "not_active";
  };
  marketContext: {
    feedTruth: "fallback_first";
    selectedAsset: string;
    timeframe: string;
    predictiveCertainty: "blocked";
  };
  planetReadiness: {
    status: string;
    engineReadiness: "deterministic_contracts";
    ministryReports: number;
  };
  journalCoachReadiness: {
    mode: string;
    promptsActive: number;
    decisionReplay: "foundation_ready";
  };
  safetySummary: string[];
  guardianLegalSummary: string[];
  visualAcceptanceSummary: string[];
  stateExplanationSummary: ProductStateExplanationKey[];
  riskCautions: string[];
  safeNextActions: string[];
  blockedCapabilities: string[];
  degradedSignals: string[];
  truth: {
    secretsIncluded: false;
    brokerCredentialsIncluded: false;
    privateSensitiveDataIncluded: false;
    fakeMetricsIncluded: false;
    fakeWinRateIncluded: false;
    predictiveCertaintyClaimed: false;
    autoTradingEnabled: false;
    realMoneyEnabled: false;
  };
};

export type TpmBrainContextInput = Partial<{
  route: string;
  selectedAsset: string;
  timeframe: string;
  planId: PlanId;
  skillLevel: UserSkillLevel;
  riskProfile: UserRiskProfile;
}>;
