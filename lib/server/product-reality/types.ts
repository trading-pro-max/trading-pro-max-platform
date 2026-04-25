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
