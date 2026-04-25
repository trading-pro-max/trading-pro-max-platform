import type { CSSProperties } from "react";
import type {
  BrandMotionIntensity,
  BrandOccasionThemeKey,
  BrandSurface,
} from "@/lib/brand/types";

export type TPMEarthMarkVariant = "public" | "compact" | "command";

export type TPMEarthMarkState =
  | "ready"
  | "local_only"
  | "paper_safe"
  | "fallback"
  | "blocked"
  | "review_required"
  | "degraded"
  | "inactive"
  | "planned";

type TPMEarthMarkProps = {
  animated?: boolean;
  className?: string;
  motionIntensity?: BrandMotionIntensity;
  occasionTheme?: BrandOccasionThemeKey;
  size?: number | string;
  state?: TPMEarthMarkState;
  surface?: BrandSurface;
  title?: string;
  variant?: TPMEarthMarkVariant;
};

function sizeStyle(size?: number | string): CSSProperties | undefined {
  if (!size) return undefined;

  return {
    "--tpm-earth-size": typeof size === "number" ? `${size}px` : size,
  } as CSSProperties;
}

export default function TPMEarthMark({
  animated = false,
  className,
  motionIntensity = animated ? "low" : "none",
  occasionTheme = "default",
  size,
  state = "ready",
  surface,
  title = "Trading Pro Max Earth Moon Mark",
  variant = "compact",
}: TPMEarthMarkProps) {
  const stateClassName = state.replaceAll("_", "-");
  const occasionClassName = occasionTheme.replaceAll("_", "-");
  const surfaceClassName = surface?.replaceAll("_", "-");

  return (
    <span
      className={[
        "tpm-earth-mark",
        `tpm-earth-mark--${variant}`,
        `tpm-earth-mark-${variant}`,
        `tpm-earth-mark--${stateClassName}`,
        `tpm-earth-mark-${stateClassName}`,
        `tpm-earth-mark--motion-${motionIntensity}`,
        `tpm-earth-mark--occasion-${occasionClassName}`,
        surfaceClassName ? `tpm-earth-mark--surface-${surfaceClassName}` : null,
        animated ? "tpm-earth-mark--animated" : null,
        animated ? "tpm-earth-mark-animated" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-animated={animated ? "true" : "false"}
      data-motion-intensity={motionIntensity}
      data-occasion-theme={occasionTheme}
      data-state={state}
      data-surface={surface}
      data-variant={variant}
      style={sizeStyle(size)}
    >
      <svg
        aria-hidden={title ? undefined : true}
        focusable="false"
        role={title ? "img" : undefined}
        viewBox="0 0 72 72"
      >
        {title ? <title>{title}</title> : null}
        <circle className="tpm-earth-halo" cx="36" cy="36" r="27.2" />
        <g className="tpm-earth-moon-orbit" aria-hidden="true">
          <ellipse
            className="tpm-earth-moon-track"
            cx="36"
            cy="36"
            rx="28.9"
            ry="18"
            transform="rotate(-18 36 36)"
          />
          <g className="tpm-earth-moon-carrier">
            <circle className="tpm-earth-moon-shadow" cx="63.4" cy="25.9" r="3.7" />
            <circle className="tpm-earth-moon" cx="63.4" cy="25.9" r="2.9" />
          </g>
        </g>
        <g className="tpm-earth-globe tpm-earth-celestial-globe" aria-hidden="true">
          <circle className="tpm-earth-fill" cx="36" cy="36" r="22.8" />
          <circle className="tpm-earth-outline" cx="36" cy="36" r="22.8" />
          <g className="tpm-earth-grid">
            <ellipse
              className="tpm-earth-line tpm-earth-latitude tpm-earth-line-wide"
              cx="36"
              cy="36"
              rx="22.8"
              ry="8.6"
            />
            <ellipse className="tpm-earth-line tpm-earth-latitude" cx="36" cy="36" rx="20.6" ry="14.9" />
            <ellipse className="tpm-earth-line tpm-earth-longitude" cx="36" cy="36" rx="9.2" ry="22.8" />
            <ellipse className="tpm-earth-line tpm-earth-longitude" cx="36" cy="36" rx="15.7" ry="22.8" />
            <path className="tpm-earth-line tpm-earth-equator" d="M17.2 29.4h37.6M16.8 42.6h38.4" />
          </g>
          <g className="tpm-earth-map" aria-hidden="true">
            <path
              className="tpm-earth-map-edge tpm-earth-map-edge-primary"
              d="M21 31.9c3.2-4.2 7.8-6.1 12.5-4.9 2 .5 3.7 1.6 5.8 1.7 2.7.1 5.1-1.3 7.8-.2 2.5 1 4.3 3 5.4 5.5"
            />
            <path
              className="tpm-earth-map-edge"
              d="M22.8 41.3c4.4-2.6 7.7-2 10.7.2 2.7 2 5.5 2.4 8.7.9 2.4-1.2 5-1.1 7.1.6"
            />
            <path
              className="tpm-earth-map-coast"
              d="M28.6 25.2c-1 2.4-.7 4.8 1 7 1.4 1.7 1.3 3.5-.3 5.3"
            />
            <path
              className="tpm-earth-map-coast"
              d="M44.1 28.6c-1.9 2.2-2.1 4.7-.6 7.4 1.2 2.1 1 4.2-.7 6.4"
            />
          </g>
        </g>
        <circle className="tpm-earth-pulse" cx="54.5" cy="20.5" r="5.2" />
        <circle className="tpm-earth-swiss-point" cx="54.5" cy="20.5" r="2.5" />
      </svg>
    </span>
  );
}
