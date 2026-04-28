import { useId, type CSSProperties } from "react";
import type { LivingEarthMotionMode } from "@/lib/brand/living-earth";

export type ProMaxProceduralEarthVariant =
  | "logo"
  | "hero"
  | "background"
  | "workspace"
  | "compact";

export type EarthIntensity = "soft" | "medium" | "high" | number;

type ProMaxProceduralEarthProps = {
  className?: string;
  intensity?: EarthIntensity;
  showAtmosphere?: boolean;
  showClouds?: boolean;
  showEarthPulse?: boolean;
  showSwissPrecisionLayer?: boolean;
  showTerminator?: boolean;
  motionMode?: LivingEarthMotionMode;
  size?: number | string;
  staticMode?: boolean;
  style?: CSSProperties;
  title?: string;
  variant?: ProMaxProceduralEarthVariant;
};

function sizeStyle(size?: number | string): CSSProperties | undefined {
  if (!size) return undefined;

  return {
    "--tpm-procedural-earth-size": typeof size === "number" ? `${size}px` : size,
  } as CSSProperties;
}

function intensityValue(intensity: EarthIntensity = "medium") {
  if (typeof intensity === "number") {
    return Math.max(0.45, Math.min(1.25, intensity));
  }

  if (intensity === "soft") return 0.72;
  if (intensity === "high") return 1.08;
  return 0.92;
}

function haloRadiusForVariant(variant: ProMaxProceduralEarthVariant) {
  if (variant === "background") return 30.2;
  if (variant === "hero") return 28.6;
  if (variant === "workspace") return 26.4;
  if (variant === "compact") return 25.2;
  return 27.4;
}

export default function ProMaxProceduralEarth({
  className,
  intensity = "medium",
  showAtmosphere = true,
  showClouds = true,
  showEarthPulse = true,
  showSwissPrecisionLayer = true,
  showTerminator = true,
  size,
  staticMode = false,
  motionMode = staticMode ? "static" : "subtle",
  style,
  title,
  variant = "logo",
}: ProMaxProceduralEarthProps) {
  const earthId = useId().replaceAll(":", "");
  const oceanGradientId = `${earthId}-ocean`;
  const continentGradientId = `${earthId}-continent`;
  const atmosphereGradientId = `${earthId}-atmosphere`;
  const sunlightGradientId = `${earthId}-sunlight`;
  const terminatorGradientId = `${earthId}-terminator`;
  const cloudGradientId = `${earthId}-clouds`;
  const polarGradientId = `${earthId}-polar`;
  const globeClipId = `${earthId}-globe-clip`;
  const intensityScale = intensityValue(intensity);

  return (
    <span
      className={[
        "tpm-procedural-earth",
        `tpm-procedural-earth--${variant}`,
        staticMode ? "tpm-procedural-earth--static" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--tpm-procedural-earth-intensity": `${intensityScale}`,
          ...sizeStyle(size),
          ...style,
        } as CSSProperties
      }
      data-static-mode={staticMode ? "true" : "false"}
      data-earth-visual-direction="swiss-inspired-realistic-procedural"
      data-living-earth-motion={motionMode}
      data-living-earth-pulse={showEarthPulse ? "true" : "false"}
      data-living-earth-swiss-layer={showSwissPrecisionLayer ? "true" : "false"}
    >
      <svg
        aria-hidden={title ? undefined : true}
        className="tpm-procedural-earth-svg"
        focusable="false"
        role={title ? "img" : undefined}
        viewBox="0 0 72 72"
      >
        {title ? <title>{title}</title> : null}
        <defs>
          <radialGradient id={oceanGradientId} cx="30%" cy="22%" r="78%">
            <stop offset="0%" stopColor="var(--tpm-earth-ocean-highlight)" />
            <stop offset="38%" stopColor="var(--tpm-earth-ocean-mid)" />
            <stop offset="100%" stopColor="var(--tpm-earth-ocean-deep)" />
          </radialGradient>
          <linearGradient id={continentGradientId} x1="16%" x2="82%" y1="20%" y2="84%">
            <stop offset="0%" stopColor="var(--tpm-earth-land-top)" />
            <stop offset="100%" stopColor="var(--tpm-earth-land-bottom)" />
          </linearGradient>
          <radialGradient id={sunlightGradientId} cx="30%" cy="20%" r="74%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.72)" />
            <stop offset="24%" stopColor="rgba(171, 232, 255, 0.26)" />
            <stop offset="62%" stopColor="rgba(97, 191, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(97, 191, 255, 0)" />
          </radialGradient>
          <linearGradient id={atmosphereGradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(176, 236, 255, 0.9)" />
            <stop offset="48%" stopColor="rgba(87, 196, 255, 0.48)" />
            <stop offset="100%" stopColor="rgba(87, 196, 255, 0)" />
          </linearGradient>
          <linearGradient id={terminatorGradientId} x1="18%" x2="78%" y1="18%" y2="82%">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0.68)" />
            <stop offset="46%" stopColor="rgba(0, 0, 0, 0.28)" />
            <stop offset="66%" stopColor="rgba(255, 255, 255, 0.06)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <linearGradient id={cloudGradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.52)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
          </linearGradient>
          <radialGradient id={polarGradientId} cx="48%" cy="16%" r="62%">
            <stop offset="0%" stopColor="rgba(238, 250, 255, 0.54)" />
            <stop offset="52%" stopColor="rgba(188, 232, 255, 0.16)" />
            <stop offset="100%" stopColor="rgba(188, 232, 255, 0)" />
          </radialGradient>
          <clipPath id={globeClipId}>
            <circle cx="36" cy="36" r="22.8" />
          </clipPath>
        </defs>

        {showAtmosphere ? (
          <g className="tpm-earth-atmosphere-shell" aria-hidden="true">
            <circle
              className="tpm-earth-halo"
              cx="36"
              cy="36"
              r={haloRadiusForVariant(variant)}
            />
            <ellipse
              className="tpm-earth-atmosphere-rim"
              cx="36"
              cy="36"
              rx="25.9"
              ry="25"
            />
          </g>
        ) : null}

        <g
          className="tpm-earth-moon-orbit"
          aria-hidden="true"
          data-legacy-visual-marker="suppressed"
        >
          <ellipse
            className="tpm-earth-moon-track"
            cx="36"
            cy="36"
            rx="28.8"
            ry="18.4"
            transform="rotate(-18 36 36)"
          />
          <g className="tpm-earth-moon-carrier">
            <circle className="tpm-earth-moon-shadow" cx="62.8" cy="25.7" r="3.5" />
            <circle className="tpm-earth-moon" cx="62.8" cy="25.7" r="2.75" />
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
          <circle className="tpm-earth-surface-depth" cx="36" cy="36" r="22.8" />
          <circle className="tpm-earth-ocean-rim" cx="36" cy="36" r="22.1" />
          <circle
            className="tpm-earth-daylight"
            cx="36"
            cy="36"
            r="22.8"
            style={{ fill: `url(#${sunlightGradientId})` }}
          />
          <g className="tpm-earth-polar-haze" clipPath={`url(#${globeClipId})`}>
            <ellipse
              className="tpm-earth-polar-haze-north"
              cx="36"
              cy="18.7"
              rx="16.4"
              ry="5.2"
              style={{ fill: `url(#${polarGradientId})` }}
            />
            <ellipse
              className="tpm-earth-polar-haze-south"
              cx="37.8"
              cy="55.2"
              rx="14.2"
              ry="4.5"
              style={{ fill: `url(#${polarGradientId})` }}
            />
          </g>

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

            {showSwissPrecisionLayer ? (
              <>
                <path
                  className="tpm-earth-alpine-light"
                  d="M31.4 25.5 34.8 23l2.2 2.4 2.9-3.9 4.4 5.1"
                />
                <path
                  className="tpm-earth-precision-meridian"
                  d="M36 13.2c2.8 6 4.2 13.4 4.2 22.4S38.8 52 36 58.8"
                />
              </>
            ) : null}

            {showClouds ? (
              <g className="tpm-earth-clouds">
                <path
                  className="tpm-earth-cloud-bank tpm-earth-cloud-bank-a"
                  d="M19.8 28.4c2.6-3.6 7.3-5.2 11.3-4.1 1.7-2.7 4.7-4.2 7.8-4 3.1.1 6 2 7.5 4.6 4.1-.4 8.2 1.9 10 5.7 1.4 3 .7 6.7-1.8 8.8-2.4 2.1-5.9 2.7-8.9 1.5-1.8 2.3-4.9 3.5-7.9 3-3-.5-5.7-2.5-6.9-5.3-2.2 1.4-5.1 1.6-7.5.5-2.4-1-4.3-3.2-4.8-5.7-.4-1.7-.1-3.4.7-5Z"
                  style={{ fill: `url(#${cloudGradientId})` }}
                />
                <path
                  className="tpm-earth-cloud-bank tpm-earth-cloud-bank-b"
                  d="M24.1 43.2c1.4-1.9 3.7-2.9 6-2.6 1.1-1.7 3.1-2.6 5.1-2.4 2 .1 3.8 1.3 4.9 3.1 2.2-.4 4.6.2 6.2 1.7 1.7 1.5 2.4 3.8 1.9 6-1 4-5.5 6.3-9.2 4.8-1.4 1.6-3.5 2.4-5.6 2.2-2.2-.2-4.1-1.6-5.1-3.5-1.6.7-3.5.8-5.1 0-1.6-.7-2.9-2.2-3.3-3.9-.4-1.8 0-3.8 1.2-5.4Z"
                  style={{ fill: `url(#${cloudGradientId})` }}
                />
                <path
                  className="tpm-earth-cloud-bank tpm-earth-cloud-bank-c"
                  d="M16.9 36.8c6.1-1.7 12.1-1.2 17.7 1.3 6.9 3.1 13.1 3.5 20.7 1.1"
                />
                <path
                  className="tpm-earth-cloud-bank tpm-earth-cloud-bank-d"
                  d="M20.6 24.8c4.6-1 8.8-.6 12.7 1.1 5.8 2.6 11.4 2.8 17.8.7"
                />
              </g>
            ) : null}

            {showTerminator ? (
              <ellipse
                className="tpm-earth-terminator"
                cx="43.4"
                cy="38"
                rx="18.8"
                ry="24.2"
                transform="rotate(14 43.4 38)"
                style={{ fill: `url(#${terminatorGradientId})` }}
              />
            ) : null}

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
            <ellipse
              className="tpm-earth-line tpm-earth-latitude"
              cx="36"
              cy="36"
              rx="20.6"
              ry="14.9"
            />
            <ellipse
              className="tpm-earth-line tpm-earth-longitude"
              cx="36"
              cy="36"
              rx="9.2"
              ry="22.8"
            />
            <ellipse
              className="tpm-earth-line tpm-earth-longitude"
              cx="36"
              cy="36"
              rx="15.7"
              ry="22.8"
            />
            <path className="tpm-earth-line tpm-earth-equator" d="M17.2 29.4h37.6M16.8 42.6h38.4" />
          </g>
        </g>

        {showEarthPulse ? (
          <>
            <circle className="tpm-earth-pulse" cx="54.5" cy="20.5" r="5.2" />
            <circle className="tpm-earth-swiss-point" cx="54.5" cy="20.5" r="2.5" />
          </>
        ) : null}
      </svg>
    </span>
  );
}
