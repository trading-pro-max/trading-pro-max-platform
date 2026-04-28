export type LivingEarthSurface =
  | "home_hero"
  | "public_header_logo"
  | "compact_logo"
  | "trading_workspace"
  | "trading_chart_atmosphere"
  | "settings"
  | "diagnostics"
  | "founder_private_preview"
  | "future_world_ready";

export type LivingEarthMode =
  | "procedural_fallback"
  | "approved_texture_ready"
  | "approved_texture_active"
  | "static"
  | "reduced_motion"
  | "high_contrast"
  | "light"
  | "dark";

export type LivingEarthVisualIntensity = "quiet" | "subtle" | "medium" | "strong";

export type LivingEarthAssetStatus =
  | "procedural_fallback_active"
  | "approved_texture_ready"
  | "approved_texture_active"
  | "blocked_invalid_asset"
  | "missing_approved_texture";

export type LivingEarthMotionMode = "static" | "reduced" | "subtle" | "ambient";

export type LivingEarthTruthState = {
  codeDriven: true;
  noExternalImages: true;
  noGeneratedImages: true;
  noUnknownLicenseAssets: true;
  noSwissRegulatoryClaim: true;
  chartProtection: "chart_must_remain_king";
  proceduralFallbackIsPhotoreal: false;
};

export type LivingEarthEvolutionState = {
  status: "active_with_notes";
  nextSafeAction: string;
  requiredGates: string[];
  blockedActions: string[];
};

export type LivingEarthRenderDecision = {
  surface: LivingEarthSurface;
  mode: LivingEarthMode;
  visualIntensity: LivingEarthVisualIntensity;
  motionMode: LivingEarthMotionMode;
  assetStatus: LivingEarthAssetStatus;
  textureActive: boolean;
  showAtmosphere: boolean;
  showClouds: boolean;
  showTerminator: boolean;
  showSwissPrecisionLayer: boolean;
  showEarthPulse: boolean;
  chartSafe: boolean;
  publicSafe: boolean;
  reason: string;
};

export type LivingEarthAcceptanceStatus =
  | "accepted"
  | "needs_ahmad_review"
  | "rejected"
  | "ready_with_notes";

export type LivingEarthRuntimeState = {
  checkedAt: string;
  status: "active_with_notes";
  acceptanceStatus: LivingEarthAcceptanceStatus;
  assetStatus: LivingEarthAssetStatus;
  truth: LivingEarthTruthState;
  renderDecisions: LivingEarthRenderDecision[];
  evolution: LivingEarthEvolutionState;
  publicSummary: string;
  privateSummary: string;
};
