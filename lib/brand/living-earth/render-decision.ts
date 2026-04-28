import type { HybridEarthTextureMode } from "@/lib/brand/earth-texture-types";
import { getLivingEarthAssetPolicy } from "./asset-policy";
import type {
  LivingEarthMotionMode,
  LivingEarthRenderDecision,
  LivingEarthSurface,
  LivingEarthVisualIntensity,
} from "./types";

type LivingEarthDecisionInput = {
  highContrast?: boolean;
  motionMode?: LivingEarthMotionMode;
  staticMode?: boolean;
  surface: LivingEarthSurface;
  textureMode?: HybridEarthTextureMode;
};

function intensityForSurface(surface: LivingEarthSurface): LivingEarthVisualIntensity {
  if (surface === "home_hero") return "strong";
  if (surface === "trading_workspace" || surface === "trading_chart_atmosphere") return "subtle";
  if (surface === "public_header_logo" || surface === "compact_logo") return "quiet";
  if (surface === "settings" || surface === "diagnostics") return "medium";
  if (surface === "founder_private_preview") return "medium";
  return "subtle";
}

function motionForSurface(
  surface: LivingEarthSurface,
  staticMode?: boolean,
  motionMode?: LivingEarthMotionMode
): LivingEarthMotionMode {
  if (staticMode) return "static";
  if (motionMode) return motionMode;
  if (surface === "home_hero") return "ambient";
  if (surface === "trading_workspace" || surface === "trading_chart_atmosphere") return "subtle";
  if (surface === "public_header_logo" || surface === "compact_logo") return "subtle";
  return "reduced";
}

export function getLivingEarthRenderDecision(
  input: LivingEarthDecisionInput
): LivingEarthRenderDecision {
  const assetPolicy = getLivingEarthAssetPolicy();
  const motionMode = motionForSurface(input.surface, input.staticMode, input.motionMode);
  const forceProcedural = input.textureMode === "proceduralOnly";
  const textureActive = assetPolicy.textureActive && !forceProcedural;
  const chartSurface =
    input.surface === "trading_workspace" || input.surface === "trading_chart_atmosphere";
  const mode = input.highContrast
    ? "high_contrast"
    : motionMode === "static"
      ? "static"
      : motionMode === "reduced"
        ? "reduced_motion"
        : textureActive
          ? "approved_texture_active"
          : assetPolicy.assetStatus === "approved_texture_ready"
            ? "approved_texture_ready"
            : "procedural_fallback";

  return {
    surface: input.surface,
    mode,
    visualIntensity: intensityForSurface(input.surface),
    motionMode,
    assetStatus: textureActive ? "approved_texture_active" : assetPolicy.assetStatus,
    textureActive,
    showAtmosphere: input.surface !== "trading_chart_atmosphere",
    showClouds: !chartSurface,
    showTerminator: true,
    showSwissPrecisionLayer: true,
    showEarthPulse:
      input.surface === "home_hero" ||
      input.surface === "public_header_logo" ||
      input.surface === "founder_private_preview",
    chartSafe: true,
    publicSafe: input.surface !== "founder_private_preview",
    reason: chartSurface
      ? "Trading keeps Living Earth subtle so the chart remains king."
      : textureActive
        ? "Approved local texture is available under Asset Law."
        : "Procedural fallback is active because no approved local texture is enabled.",
  };
}
