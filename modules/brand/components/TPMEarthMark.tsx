import { useId, type CSSProperties } from "react";
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
  const markId = useId().replaceAll(":", "");
  const oceanGradientId = `${markId}-tpm-earth-ocean`;
  const continentGradientId = `${markId}-tpm-earth-continent`;
  const globeClipId = `${markId}-tpm-earth-globe-clip`;

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
        <defs>
          <radialGradient id={oceanGradientId} cx="31%" cy="24%" r="72%">
            <stop offset="0%" stopColor="var(--tpm-earth-ocean-highlight)" />
            <stop offset="48%" stopColor="var(--tpm-earth-ocean-mid)" />
            <stop offset="100%" stopColor="var(--tpm-earth-ocean-deep)" />
          </radialGradient>
          <linearGradient id={continentGradientId} x1="18%" x2="84%" y1="18%" y2="84%">
            <stop offset="0%" stopColor="var(--tpm-earth-land-top)" />
            <stop offset="100%" stopColor="var(--tpm-earth-land-bottom)" />
          </linearGradient>
          <clipPath id={globeClipId}>
            <circle cx="36" cy="36" r="22.8" />
          </clipPath>
        </defs>
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
          <circle
            className="tpm-earth-fill tpm-earth-ocean"
            cx="36"
            cy="36"
            r="22.8"
            style={{ fill: `url(#${oceanGradientId})` }}
          />
          <circle className="tpm-earth-ocean-rim" cx="36" cy="36" r="22.1" />
          <g className="tpm-earth-map tpm-earth-continents" clipPath={`url(#${globeClipId})`}>
            <path
              className="tpm-earth-continent tpm-earth-continent-americas"
              d="M24.8 20.9c-3.6 1.4-6.1 4.5-7.1 8.4-.9 3.5.4 7.3 2.6 9.9 1.5 1.8 3.6 2.6 4.6 4.9.8 1.9.4 4.5 2.5 5.8 1.7 1 4.1.6 4.8-1.2.7-1.7-.9-3.5-.6-5.3.4-2.1 2.9-3.1 3-5.4.1-2.6-3.3-3.2-4.4-5.3-.9-1.8.4-3.5-.4-5.1-.9-1.9-3.6-1.8-5-3-.9-.8-.7-2.2 0-3.7Z"
              style={{ fill: `url(#${continentGradientId})` }}
            />
            <path
              className="tpm-earth-continent tpm-earth-continent-europe-africa"
              d="M36.4 22.6c2.2-1.3 5.5-1.1 7.5.7 1.2 1.1 1.1 2.7 2.5 3.4 1.4.7 3.1-.1 4.4.8 1.7 1.2.9 3.7-.8 4.5-2.1 1.1-4.5-.4-6.4.9-1.7 1.1-1.1 3.8.3 5.2 1.6 1.7 3.4 3.2 3 5.8-.4 2.7-2.6 5.5-4.9 6.9-1.2.7-2.6.5-3.3-.7-.9-1.4.2-3-.3-4.6-.5-1.7-2.4-2.4-3.4-3.8-1.1-1.6-.8-3.4.4-4.8 1.1-1.2 2.9-2.1 2.6-4-.2-1.6-2.1-2.2-3.1-3.4-1.8-2.2-.9-5.2 1.5-6.9Z"
              style={{ fill: `url(#${continentGradientId})` }}
            />
            <path
              className="tpm-earth-continent tpm-earth-continent-asia"
              d="M45.2 23.8c4.4 1.3 8.1 4.4 10 8.7 1.3 3 .8 6.2-1.4 8-1.7 1.3-3.8.7-5.5 1.7-1.8 1-2.5 3.3-4.4 4.2-1.8.8-3.8-.3-4.2-2.2-.5-2.3 1.5-3.8 3.2-4.9 1.6-1 3.8-1.8 3.9-4 .1-2.1-2.1-3.1-3.7-4-1.5-.8-3.1-1.8-3.2-3.6-.1-2.1 2.7-3.4 5.3-3.9Z"
              style={{ fill: `url(#${continentGradientId})` }}
            />
            <path
              className="tpm-earth-continent tpm-earth-continent-oceania"
              d="M50.1 46.4c1.2-.8 3.6-.4 4.3.8.8 1.4-.6 2.7-2.2 2.7-1.4 0-3.2-.9-3.1-2 .1-.6.5-1.1 1-1.5Z"
              style={{ fill: `url(#${continentGradientId})` }}
            />
            <path
              className="tpm-earth-map-edge tpm-earth-continent-edge tpm-earth-continent-americas-edge tpm-earth-map-edge-primary"
              d="M24.8 20.9c-3.6 1.4-6.1 4.5-7.1 8.4-.9 3.5.4 7.3 2.6 9.9 1.5 1.8 3.6 2.6 4.6 4.9.8 1.9.4 4.5 2.5 5.8 1.7 1 4.1.6 4.8-1.2.7-1.7-.9-3.5-.6-5.3.4-2.1 2.9-3.1 3-5.4.1-2.6-3.3-3.2-4.4-5.3-.9-1.8.4-3.5-.4-5.1-.9-1.9-3.6-1.8-5-3-.9-.8-.7-2.2 0-3.7Z"
            />
            <path
              className="tpm-earth-map-edge tpm-earth-continent-edge tpm-earth-continent-europe-africa-edge tpm-earth-map-edge-primary"
              d="M36.4 22.6c2.2-1.3 5.5-1.1 7.5.7 1.2 1.1 1.1 2.7 2.5 3.4 1.4.7 3.1-.1 4.4.8 1.7 1.2.9 3.7-.8 4.5-2.1 1.1-4.5-.4-6.4.9-1.7 1.1-1.1 3.8.3 5.2 1.6 1.7 3.4 3.2 3 5.8-.4 2.7-2.6 5.5-4.9 6.9-1.2.7-2.6.5-3.3-.7-.9-1.4.2-3-.3-4.6-.5-1.7-2.4-2.4-3.4-3.8-1.1-1.6-.8-3.4.4-4.8 1.1-1.2 2.9-2.1 2.6-4-.2-1.6-2.1-2.2-3.1-3.4-1.8-2.2-.9-5.2 1.5-6.9Z"
            />
            <path
              className="tpm-earth-map-edge tpm-earth-continent-edge tpm-earth-continent-asia-edge"
              d="M45.2 23.8c4.4 1.3 8.1 4.4 10 8.7 1.3 3 .8 6.2-1.4 8-1.7 1.3-3.8.7-5.5 1.7-1.8 1-2.5 3.3-4.4 4.2-1.8.8-3.8-.3-4.2-2.2-.5-2.3 1.5-3.8 3.2-4.9 1.6-1 3.8-1.8 3.9-4 .1-2.1-2.1-3.1-3.7-4-1.5-.8-3.1-1.8-3.2-3.6-.1-2.1 2.7-3.4 5.3-3.9Z"
            />
            <path
              className="tpm-earth-map-edge tpm-earth-continent-edge tpm-earth-continent-oceania-edge"
              d="M50.1 46.4c1.2-.8 3.6-.4 4.3.8.8 1.4-.6 2.7-2.2 2.7-1.4 0-3.2-.9-3.1-2 .1-.6.5-1.1 1-1.5Z"
            />
          </g>
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
        </g>
        <circle className="tpm-earth-pulse" cx="54.5" cy="20.5" r="5.2" />
        <circle className="tpm-earth-swiss-point" cx="54.5" cy="20.5" r="2.5" />
      </svg>
    </span>
  );
}
