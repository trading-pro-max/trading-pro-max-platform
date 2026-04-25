import "server-only";

export type ProductRealityScoreArea =
  | "public_clarity"
  | "workstation_clarity"
  | "chart_dominance"
  | "execution_clarity"
  | "assistant_usefulness"
  | "plan_clarity"
  | "visual_maturity"
  | "swiss_identity"
  | "product_truth"
  | "legal_safety"
  | "guardian_safety"
  | "monetization_readiness"
  | "retention_value"
  | "founder_acceptance"
  | "user_simplicity"
  | "internal_integration";

export type ProductRealityAreaScore = {
  area: ProductRealityScoreArea;
  score: number;
  status: "pass" | "partial" | "blocker" | "needs_human_review";
  reasons: string[];
  nextActions: string[];
  ownerMinistry: string;
  validationNeeded: string[];
};

export type ProductSurfaceDigitalTwinRole =
  | "Guest"
  | "Free"
  | "Pro"
  | "VIP"
  | "Institutional"
  | "Founder";

export type ProductSurfaceDigitalTwinLayer = {
  role: ProductSurfaceDigitalTwinRole;
  visibleSurfaces: string[];
  hiddenSurfaces: string[];
  plannedSurfaces: string[];
  blockedSurfaces: string[];
  forbiddenLeaks: string[];
  planLanguage: string;
  assistantCapabilities: string[];
  productTruth: string[];
  founderCommandExposure: "hidden" | "owner_only";
};

export type ProductRealityFinalScoreArea =
  | "public_clarity"
  | "workstation_clarity"
  | "chart_dominance"
  | "execution_clarity"
  | "assistant_usefulness"
  | "journal_coach_usefulness"
  | "plan_clarity"
  | "settings_organization"
  | "diagnostics_organization"
  | "visual_maturity"
  | "swiss_identity"
  | "earth_mark_identity"
  | "product_truth"
  | "safety_legal"
  | "founder_command_privacy"
  | "local_operations_readiness"
  | "user_simplicity"
  | "internal_integration";

export type ProductRealityFinalScoreStatus =
  | "pass"
  | "partial"
  | "blocker"
  | "needs_human_review";

export type ProductRealityFinalScoreItem = {
  area: ProductRealityFinalScoreArea;
  label: string;
  score: number;
  status: ProductRealityFinalScoreStatus;
  reason: string;
  blocker: string | null;
  nextAction: string;
  humanAcceptanceNeeded: boolean;
};

export type ProductRealityFinalScoreSnapshot = {
  checkedAt: string;
  mode: "local_product_reality_final_score";
  overallScore: number;
  status: ProductRealityFinalScoreStatus;
  areas: ProductRealityFinalScoreItem[];
  ahmadHumanAcceptanceRequired: true;
  summary: {
    totalAreas: number;
    pass: number;
    partial: number;
    blocker: number;
    needsHumanReview: number;
  };
  truth: {
    scale: "0_to_10";
    noPerfectScoreClaim: true;
    ahmadVisualAcceptanceRequired: true;
    globalLaunchReadinessClaimed: false;
    fakeUsersRevenueMetrics: false;
  };
};

export type ProductRealityLocalStartScoreArea =
  | "public_entry"
  | "workstation"
  | "chart"
  | "execution"
  | "assistant"
  | "journal_coach"
  | "settings"
  | "diagnostics"
  | "plan_clarity"
  | "visual_maturity"
  | "local_operations";

export type ProductRealityLocalStartScoreItem = {
  area: ProductRealityLocalStartScoreArea;
  label: string;
  score: number;
  status: "pass" | "ready_with_notes" | "needs_ahmad_review" | "blocked";
  reason: string;
  nextAction: string;
  humanAcceptanceNeeded: boolean;
};

export type ProductRealityLocalStartScoreSnapshot = {
  checkedAt: string;
  mode: "local_start_product_reality_score";
  overallScore: number;
  status: "ready_with_notes" | "partial" | "blocked";
  areas: ProductRealityLocalStartScoreItem[];
  ahmadHumanVisualAcceptanceRequired: true;
  summary: {
    totalAreas: number;
    pass: number;
    readyWithNotes: number;
    needsAhmadReview: number;
    blocked: number;
  };
  truth: {
    scale: "0_to_10";
    noPerfectScoreClaim: true;
    localOperationsOnly: true;
    globalLaunchReadinessClaimed: false;
    fakeUsersRevenueMetrics: false;
    billingActive: false;
    brokerFeedActive: false;
    liveExecutionActive: false;
    realMoneyActive: false;
    socialPublishingActive: false;
  };
};
