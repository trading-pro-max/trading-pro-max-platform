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
  title = "Trading Pro Max Celestial Swiss Earth Mark",
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
        <circle className="tpm-earth-halo" cx="36" cy="36" r="27.5" />
        <g className="tpm-earth-moon-orbit" aria-hidden="true">
          <ellipse
            className="tpm-earth-moon-track"
            cx="36"
            cy="36"
            rx="29.6"
            ry="18.4"
            transform="rotate(-18 36 36)"
          />
          <g className="tpm-earth-moon-carrier">
            <circle className="tpm-earth-moon-shadow" cx="64" cy="25.8" r="3.9" />
            <circle className="tpm-earth-moon" cx="64" cy="25.8" r="3.1" />
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
              d="M20.4 31.8c3.5-4.5 8.3-6.5 13.4-5.2 2 .5 3.7 1.7 5.8 1.8 2.8.1 5.2-1.4 8.2-.2 2.7 1.1 4.5 3.4 5.8 6.1"
            />
            <path
              className="tpm-earth-map-edge"
              d="M22.7 41.5c4.7-2.9 8.1-2.3 11.3.2 2.8 2.1 5.7 2.6 9.1.9 2.6-1.3 5.2-1.2 7.4.8"
            />
            <path
              className="tpm-earth-map-coast"
              d="M28.8 24.9c-1.2 2.6-1 5.2.9 7.5 1.5 1.8 1.5 3.7-.4 5.6"
            />
            <path
              className="tpm-earth-map-coast"
              d="M44.2 28.4c-2.1 2.4-2.4 5-.8 7.9 1.3 2.3 1.1 4.6-.8 6.9"
            />
          </g>
        </g>
        <g className="tpm-earth-orbits" aria-hidden="true">
          <path
            className="tpm-earth-orbit"
            d="M9.7 43.3C23.1 57.5 48.1 56.8 62.1 29.3"
          />
          <path
            className="tpm-earth-orbit tpm-earth-orbit-segment"
            d="M20.2 53.5C31.8 62.1 50.1 55.5 61.6 32.7"
          />
          <path
            className="tpm-earth-orbit-soft"
            d="M14.7 22.2C27.4 9.9 50.2 12.5 59.5 28.5"
          />
        </g>
        <g className="tpm-earth-market tpm-earth-market-mini" aria-hidden="true">
          <path className="tpm-earth-market-bar" d="M29.6 45.8v-5.2h2.5v5.2h-2.5Z" />
          <path className="tpm-earth-market-bar" d="M34.9 45.8v-8.4h2.5v8.4h-2.5Z" />
          <path className="tpm-earth-market-bar" d="M40.2 45.8v-11.5h2.5v11.5h-2.5Z" />
          <path className="tpm-earth-market-move" d="M28.9 37.1l4.7-3.6 4 2.2 5.9-6.5" />
        </g>
        <circle className="tpm-earth-pulse" cx="54.5" cy="20.5" r="5.2" />
        <circle className="tpm-earth-swiss-point" cx="54.5" cy="20.5" r="2.5" />
      </svg>
    </span>
  );
}
