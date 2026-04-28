import type { CSSProperties } from "react";
import {
  getLivingEarthRenderDecision,
  type LivingEarthMotionMode,
  type LivingEarthSurface,
  type LivingEarthVisualIntensity,
} from "@/lib/brand/living-earth";
import type { HybridEarthTextureMode } from "@/lib/brand/earth-texture-types";
import ProMaxHybridEarth from "./ProMaxHybridEarth";

type ProMaxLivingEarthProps = {
  className?: string;
  highContrast?: boolean;
  motionMode?: LivingEarthMotionMode;
  showAtmosphere?: boolean;
  showClouds?: boolean;
  showEarthPulse?: boolean;
  showSwissPrecisionLayer?: boolean;
  showTerminator?: boolean;
  size?: number | string;
  staticMode?: boolean;
  style?: CSSProperties;
  surface: LivingEarthSurface;
  textureMode?: HybridEarthTextureMode;
  title?: string;
  visualIntensity?: LivingEarthVisualIntensity;
};

function hybridVariantForSurface(surface: LivingEarthSurface) {
  if (surface === "home_hero") return "background";
  if (surface === "trading_workspace" || surface === "trading_chart_atmosphere") {
    return "workspace";
  }
  if (surface === "public_header_logo" || surface === "compact_logo") return "compact";
  return "logo";
}

function earthIntensityForVisualIntensity(intensity: LivingEarthVisualIntensity) {
  if (intensity === "strong") return "high";
  if (intensity === "medium") return "medium";
  return "soft";
}

export default function ProMaxLivingEarth({
  className,
  highContrast,
  motionMode,
  showAtmosphere,
  showClouds,
  showEarthPulse,
  showSwissPrecisionLayer,
  showTerminator,
  size,
  staticMode,
  style,
  surface,
  textureMode = "auto",
  title,
  visualIntensity,
}: ProMaxLivingEarthProps) {
  const decision = getLivingEarthRenderDecision({
    highContrast,
    motionMode,
    staticMode,
    surface,
    textureMode,
  });
  const resolvedVisualIntensity = visualIntensity ?? decision.visualIntensity;

  return (
    <span
      className={["tpm-living-earth-runtime", className].filter(Boolean).join(" ")}
      data-living-earth-asset-status={decision.assetStatus}
      data-living-earth-chart-safe={decision.chartSafe ? "true" : "false"}
      data-living-earth-mode={decision.mode}
      data-living-earth-motion={decision.motionMode}
      data-living-earth-public-safe={decision.publicSafe ? "true" : "false"}
      data-living-earth-runtime="active"
      data-living-earth-surface={surface}
      data-living-earth-texture-active={decision.textureActive ? "true" : "false"}
      data-living-earth-visual-intensity={resolvedVisualIntensity}
      style={style}
    >
      <ProMaxHybridEarth
        intensity={earthIntensityForVisualIntensity(resolvedVisualIntensity)}
        motionMode={decision.motionMode}
        showAtmosphere={showAtmosphere ?? decision.showAtmosphere}
        showClouds={showClouds ?? decision.showClouds}
        showEarthPulse={showEarthPulse ?? decision.showEarthPulse}
        showSwissPrecisionLayer={
          showSwissPrecisionLayer ?? decision.showSwissPrecisionLayer
        }
        showTerminator={showTerminator ?? decision.showTerminator}
        size={size}
        staticMode={decision.motionMode === "static" || staticMode}
        surface={surface}
        textureMode={textureMode}
        title={title}
        variant={hybridVariantForSurface(surface)}
      />
    </span>
  );
}
