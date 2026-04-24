type ProductLogoProps = {
  className?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  variant?: "nav" | "topbar" | "hero" | "auth" | "compact";
};

type BrandMarkProps = {
  className?: string;
  title?: string;
};

type BrandWordmarkProps = {
  className?: string;
};

export function BrandMark({ className, title = "Trading Pro Max" }: BrandMarkProps) {
  return (
    <span className={["tpm-brand-mark", className].filter(Boolean).join(" ")} aria-label={title}>
      <svg viewBox="0 0 64 64" role="img" focusable="false">
        <path
          className="tpm-brand-mark-shell"
          d="M32 4 55 16.8v29.9L32 60 9 46.7V16.8L32 4Z"
        />
        <path
          className="tpm-brand-mark-inner"
          d="M32 10.7 49.1 20v22.2L32 52.1 14.9 42.2V20L32 10.7Z"
        />
        <path className="tpm-brand-mark-candle" d="M22 35.5h5.2v10H22v-10Z" />
        <path className="tpm-brand-mark-candle" d="M29.4 27.8h5.2v17.7h-5.2V27.8Z" />
        <path className="tpm-brand-mark-candle" d="M36.8 21.4H42v24.1h-5.2V21.4Z" />
        <path
          className="tpm-brand-mark-arrow"
          d="M21.4 27.8 30.6 21l5.4 4.6 8.5-10.1 1.8 8.8-8.3 9.8-5.7-4.8-8.8 6.4-2.1-7.9Z"
        />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className }: BrandWordmarkProps) {
  return (
    <span className={["tpm-brand-wordmark", className].filter(Boolean).join(" ")}>
      Trading Pro <span>Max</span>
    </span>
  );
}

export default function ProductLogo({
  className,
  showSubtitle = true,
  subtitle = "Global trading foundation",
  variant = "nav",
}: ProductLogoProps) {
  return (
    <div
      className={[
        "tpm-brand-lockup",
        `tpm-brand-lockup-${variant}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <BrandMark className="tpm-brand-lockup-mark" />
      <div className="tpm-brand-lockup-copy">
        <BrandWordmark />
        {showSubtitle ? <span className="tpm-brand-subline">{subtitle}</span> : null}
      </div>
    </div>
  );
}
