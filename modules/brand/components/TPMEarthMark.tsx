import type { CSSProperties } from "react";

type TPMEarthMarkVariant = "public" | "compact" | "command";

type TPMEarthMarkProps = {
  animated?: boolean;
  className?: string;
  size?: number | string;
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
  title = "Trading Pro Max Earth Mark",
  variant = "compact",
}: TPMEarthMarkProps) {
  return (
    <span
      className={[
        "tpm-earth-mark",
        `tpm-earth-mark-${variant}`,
        animated ? "tpm-earth-mark-animated" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
        <circle className="tpm-earth-fill" cx="32" cy="32" r="21.5" />
        <circle className="tpm-earth-outline" cx="32" cy="32" r="21.5" />
        <ellipse className="tpm-earth-line tpm-earth-line-wide" cx="32" cy="32" rx="21.5" ry="8.2" />
        <ellipse className="tpm-earth-line" cx="32" cy="32" rx="9.3" ry="21.5" />
        <path className="tpm-earth-line" d="M14.2 25.2h35.6M14.2 38.8h35.6" />
        <path className="tpm-earth-orbit" d="M8.8 39.3C20.7 52.6 43.3 52.2 55.4 28.1" />
        <path className="tpm-earth-orbit-soft" d="M13.7 19.6C25.1 8.6 45.1 11 53.5 25.8" />
        <path className="tpm-earth-market-bar" d="M25.2 39.6v-7.8h3.5v7.8h-3.5Z" />
        <path className="tpm-earth-market-bar" d="M31.1 39.6V27.4h3.5v12.2h-3.5Z" />
        <path className="tpm-earth-market-bar" d="M37 39.6V23.2h3.5v16.4H37Z" />
        <circle className="tpm-earth-swiss-point" cx="49.1" cy="18.3" r="2.8" />
      </svg>
    </span>
  );
}
