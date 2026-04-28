import type { CSSProperties } from "react";
import { getEarthTextureRegistryReadiness } from "@/lib/brand/earth-texture-registry";
import type { HybridEarthTextureMode } from "@/lib/brand/earth-texture-types";
import {
  getLivingEarthRenderDecision,
  type LivingEarthMotionMode,
  type LivingEarthSurface,
  type LivingEarthVisualIntensity,
} from "@/lib/brand/living-earth";
import ProMaxProceduralEarth, {
  type EarthIntensity,
  type ProMaxProceduralEarthVariant,
} from "./ProMaxProceduralEarth";

export type ProMaxHybridEarthVariant = ProMaxProceduralEarthVariant;

type ProMaxHybridEarthProps = {
  className?: string;
  intensity?: EarthIntensity;
  motionMode?: LivingEarthMotionMode;
  showAtmosphere?: boolean;
  showClouds?: boolean;
  showEarthPulse?: boolean;
  showSwissPrecisionLayer?: boolean;
  showTerminator?: boolean;
  size?: number | string;
  staticMode?: boolean;
  style?: CSSProperties;
  surface?: LivingEarthSurface;
  textureMode?: HybridEarthTextureMode;
  title?: string;
  variant?: ProMaxHybridEarthVariant;
  visualIntensity?: LivingEarthVisualIntensity;
};

function sizeStyle(size?: number | string): CSSProperties | undefined {
  if (!size) return undefined;

  return {
    "--tpm-hybrid-earth-size": typeof size === "number" ? `${size}px` : size,
  } as CSSProperties;
}

function surfaceForVariant(variant: ProMaxHybridEarthVariant): LivingEarthSurface {
  if (variant === "hero" || variant === "background") return "home_hero";
  if (variant === "workspace") return "trading_workspace";
  if (variant === "compact" || variant === "logo") return "compact_logo";
  return "future_world_ready";
}

export default function ProMaxHybridEarth({
  className,
  intensity = "medium",
  motionMode,
  showAtmosphere = true,
  showClouds = true,
  showEarthPulse,
  showSwissPrecisionLayer,
  showTerminator = true,
  size,
  staticMode = false,
  style,
  surface,
  textureMode = "auto",
  title,
  visualIntensity,
  variant = "logo",
}: ProMaxHybridEarthProps) {
  const livingEarthSurface = surface ?? surfaceForVariant(variant);
  const livingEarthDecision = getLivingEarthRenderDecision({
    motionMode,
    staticMode,
    surface: livingEarthSurface,
    textureMode,
  });
  const registry = getEarthTextureRegistryReadiness();
  const approvedTexture =
    textureMode === "proceduralOnly" ? null : registry.activeTexture;
  const textureActive = Boolean(approvedTexture);
  const resolvedRenderMode = textureActive
    ? "approved_texture"
    : "procedural_fallback";

  return (
    <span
      className={[
        "tpm-hybrid-earth",
        `tpm-hybrid-earth--${variant}`,
        textureActive
          ? "tpm-hybrid-earth--approved-texture"
          : "tpm-hybrid-earth--procedural-fallback",
        staticMode ? "tpm-hybrid-earth--static" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-earth-active-texture={textureActive ? "true" : "false"}
      data-earth-render-mode={resolvedRenderMode}
      data-earth-renderer="hybrid"
      data-earth-swiss-direction="procedural_precision"
      data-earth-swiss-regulatory-claim="false"
      data-earth-texture-mode={textureMode}
      data-earth-texture-source={textureActive ? "approved_local" : "none"}
      data-living-earth-asset-status={livingEarthDecision.assetStatus}
      data-living-earth-chart-safe={livingEarthDecision.chartSafe ? "true" : "false"}
      data-living-earth-mode={livingEarthDecision.mode}
      data-living-earth-motion={livingEarthDecision.motionMode}
      data-living-earth-runtime="active"
      data-living-earth-surface={livingEarthSurface}
      data-living-earth-visual-intensity={
        visualIntensity ?? livingEarthDecision.visualIntensity
      }
      data-reduced-motion-supported="true"
      data-static-mode={staticMode ? "true" : "false"}
      style={
        {
          ...sizeStyle(size),
          ...(approvedTexture
            ? ({
                "--tpm-hybrid-earth-texture-url": `url(${approvedTexture.publicPath})`,
              } as CSSProperties)
            : null),
          ...style,
        } as CSSProperties
      }
    >
      <ProMaxProceduralEarth
        className="tpm-hybrid-earth-procedural"
        intensity={intensity}
        motionMode={livingEarthDecision.motionMode}
        showAtmosphere={showAtmosphere}
        showClouds={showClouds}
        showEarthPulse={showEarthPulse ?? livingEarthDecision.showEarthPulse}
        showSwissPrecisionLayer={
          showSwissPrecisionLayer ?? livingEarthDecision.showSwissPrecisionLayer
        }
        showTerminator={showTerminator}
        size={size}
        staticMode={staticMode}
        title={title}
        variant={variant}
      />
      {approvedTexture ? (
        <span className="tpm-hybrid-earth-approved-texture" aria-hidden="true">
          <span className="tpm-hybrid-earth-approved-texture-sphere" />
          <span className="tpm-hybrid-earth-approved-texture-light" />
          {showTerminator ? (
            <span className="tpm-hybrid-earth-approved-texture-terminator" />
          ) : null}
          {showAtmosphere ? (
            <span className="tpm-hybrid-earth-approved-texture-atmosphere" />
          ) : null}
          {showClouds ? (
            <span className="tpm-hybrid-earth-approved-texture-clouds" />
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
