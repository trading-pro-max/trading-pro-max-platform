import type { CSSProperties } from "react";
import { getEarthTextureRegistryReadiness } from "@/lib/brand/earth-texture-registry";
import type { HybridEarthTextureMode } from "@/lib/brand/earth-texture-types";
import ProMaxProceduralEarth, {
  type EarthIntensity,
  type ProMaxProceduralEarthVariant,
} from "./ProMaxProceduralEarth";

export type ProMaxHybridEarthVariant = ProMaxProceduralEarthVariant;

type ProMaxHybridEarthProps = {
  className?: string;
  intensity?: EarthIntensity;
  showAtmosphere?: boolean;
  showClouds?: boolean;
  showTerminator?: boolean;
  size?: number | string;
  staticMode?: boolean;
  style?: CSSProperties;
  textureMode?: HybridEarthTextureMode;
  title?: string;
  variant?: ProMaxHybridEarthVariant;
};

function sizeStyle(size?: number | string): CSSProperties | undefined {
  if (!size) return undefined;

  return {
    "--tpm-hybrid-earth-size": typeof size === "number" ? `${size}px` : size,
  } as CSSProperties;
}

export default function ProMaxHybridEarth({
  className,
  intensity = "medium",
  showAtmosphere = true,
  showClouds = true,
  showTerminator = true,
  size,
  staticMode = false,
  style,
  textureMode = "auto",
  title,
  variant = "logo",
}: ProMaxHybridEarthProps) {
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
        showAtmosphere={showAtmosphere}
        showClouds={showClouds}
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
