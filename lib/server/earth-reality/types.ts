export type EarthRealityLayer =
  | "human"
  | "time"
  | "place_privacy"
  | "market"
  | "law"
  | "trust"
  | "learning"
  | "support"
  | "environment"
  | "product_truth";

export type EarthRealitySurface =
  | "home"
  | "trading_workspace"
  | "markets"
  | "plans"
  | "apps_platforms"
  | "academy"
  | "community"
  | "support"
  | "settings"
  | "diagnostics"
  | "assistant"
  | "journal_coach"
  | "environment"
  | "launch_gate";

export type EarthRealityDecision =
  | "pass"
  | "needs_review"
  | "founder_review_required"
  | "blocked"
  | "future";

export type EarthRealityCheck = {
  checkId: string;
  layer: EarthRealityLayer;
  surface: EarthRealitySurface;
  requirement: string;
  decision: EarthRealityDecision;
  reason: string;
  userImpact: string;
  trustImpact: string;
  safetyImpact: string;
  requiredFix: string;
  publicCopyRule: string;
  validationRule: string;
};

export type EarthRealityLayerSummary = {
  layer: EarthRealityLayer;
  label: string;
  status: EarthRealityDecision;
  pass: number;
  needsReview: number;
  blocked: number;
  nextSafeAction: string;
};

export type EarthRealityMatrixPage = {
  surface: EarthRealitySurface;
  publicLabel: string;
  whereAmI: string;
  whatCanIDo: string;
  activeNow: string;
  plannedFuture: string;
  blockedInactive: string;
  nextStep: string;
};

export type EarthRealitySnapshot = {
  checkedAt: string;
  mode: "earth_reality_constitution";
  status:
    | "not_ready"
    | "partial"
    | "ready_with_notes"
    | "earth_ready_local"
    | "blocked";
  score: number;
  layers: EarthRealityLayerSummary[];
  surfaces: EarthRealityMatrixPage[];
  publicReadiness: "ready_with_notes";
  privacyReadiness: "ready";
  productTruthReadiness: "preserved";
  supportReadiness: "readiness_only";
  learningReadiness: "ready";
  marketReadiness: "paper_safe";
  environmentReadiness: "privacy_safe";
  launchGateReadiness: "inactive_guarded";
  publicPrivateBoundaryStatus: "preserved";
  blockedViolations: string[];
  nextSafeActions: string[];
  founderReviewNeeded: string[];
  checks: EarthRealityCheck[];
  publicDiagnosticsSummary: {
    label: "Earth Reality";
    status: "ready_with_notes";
    copy: string;
    visibleToPublic: true;
  };
  privateReadinessSummary: {
    label: "Earth Reality Constitution";
    founderVisible: true;
    publicExposure: false;
    checks: number;
  };
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedBillingInactive: true;
    productionInactive: true;
    socialPublishingInactive: true;
    noFakeClaims: true;
    noPrivateTermsPublic: true;
    noImagesOrRasterAssets: true;
  };
};
