import type { CSSProperties } from "react";

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
  size?: number | string;
  state?: TPMEarthMarkState;
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
  size,
  state = "ready",
  title = "Trading Pro Max Earth Mark",
  variant = "compact",
}: TPMEarthMarkProps) {
  const stateClassName = state.replaceAll("_", "-");

  return (
    <span
      className={[
        "tpm-earth-mark",
        `tpm-earth-mark--${variant}`,
        `tpm-earth-mark-${variant}`,
        `tpm-earth-mark--${stateClassName}`,
        `tpm-earth-mark-${stateClassName}`,
        animated ? "tpm-earth-mark--animated" : null,
        animated ? "tpm-earth-mark-animated" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-animated={animated ? "true" : "false"}
      data-state={state}
      data-variant={variant}
      style={sizeStyle(size)}
    >
      <svg
        aria-hidden={title ? undefined : true}
        focusable="false"
        role={title ? "img" : undefined}
        viewBox="0 0 64 64"
      >
        {title ? <title>{title}</title> : null}
        <circle className="tpm-earth-halo" cx="32" cy="32" r="25.5" />
        <g className="tpm-earth-globe" aria-hidden="true">
          <circle className="tpm-earth-fill" cx="32" cy="32" r="21.5" />
          <circle className="tpm-earth-outline" cx="32" cy="32" r="21.5" />
          <ellipse
            className="tpm-earth-line tpm-earth-line-wide"
            cx="32"
            cy="32"
            rx="21.5"
            ry="8.2"
          />
          <ellipse className="tpm-earth-line" cx="32" cy="32" rx="9.3" ry="21.5" />
          <path className="tpm-earth-line" d="M14.2 25.2h35.6M14.2 38.8h35.6" />
        </g>
        <g className="tpm-earth-orbits" aria-hidden="true">
          <path
            className="tpm-earth-orbit"
            d="M8.8 39.3C20.7 52.6 43.3 52.2 55.4 28.1"
          />
          <path
            className="tpm-earth-orbit tpm-earth-orbit-segment"
            d="M18.9 49.6C29.2 57.8 46.2 51.9 55.3 31.1"
          />
          <path
            className="tpm-earth-orbit-soft"
            d="M13.7 19.6C25.1 8.6 45.1 11 53.5 25.8"
          />
        </g>
        <g className="tpm-earth-market" aria-hidden="true">
          <path className="tpm-earth-market-bar" d="M25.2 39.6v-7.8h3.5v7.8h-3.5Z" />
          <path className="tpm-earth-market-bar" d="M31.1 39.6V27.4h3.5v12.2h-3.5Z" />
          <path className="tpm-earth-market-bar" d="M37 39.6V23.2h3.5v16.4H37Z" />
          <path className="tpm-earth-market-move" d="M24.9 29.9l5.6-4.5 4.7 3.1 6.2-7.6" />
        </g>
        <circle className="tpm-earth-pulse" cx="49.1" cy="18.3" r="5.4" />
        <circle className="tpm-earth-swiss-point" cx="49.1" cy="18.3" r="2.8" />
      </svg>
    </span>
  );
}
