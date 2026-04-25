import TPMEarthMark from "./TPMEarthMark";

type ProductLogoProps = {
  className?: string;
  markTitle?: string;
  mode?: "lockup" | "mark-only" | "wordmark-only";
  showSubtitle?: boolean;
  subtitle?: string;
  variant?: "nav" | "topbar" | "hero" | "auth" | "compact" | "command";
};

type BrandMarkProps = {
  className?: string;
  title?: string;
  variant?: "public" | "compact" | "command";
};

type BrandWordmarkProps = {
  className?: string;
};

function markVariantForLogo(
  variant: NonNullable<ProductLogoProps["variant"]>
): BrandMarkProps["variant"] {
  if (variant === "hero" || variant === "auth") return "public";
  if (variant === "command") return "command";
  return "compact";
}

export function BrandMark({
  className,
  title = "Trading Pro Max Earth Mark",
  variant = "compact",
}: BrandMarkProps) {
  return (
    <TPMEarthMark
      className={["tpm-brand-mark", className].filter(Boolean).join(" ")}
      title={title}
      variant={variant}
    />
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
  markTitle = "Trading Pro Max Earth Mark",
  mode = "lockup",
  showSubtitle = true,
  subtitle = "Global trading foundation",
  variant = "nav",
}: ProductLogoProps) {
  const showMark = mode !== "wordmark-only";
  const showWordmark = mode !== "mark-only";

  return (
    <div
      className={[
        "tpm-brand-lockup",
        `tpm-brand-lockup-${variant}`,
        `tpm-brand-lockup-${mode}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showMark ? (
        <BrandMark
          className="tpm-brand-lockup-mark"
          title={markTitle}
          variant={markVariantForLogo(variant)}
        />
      ) : null}
      {showWordmark ? (
        <div className="tpm-brand-lockup-copy">
          <BrandWordmark />
          {showSubtitle ? <span className="tpm-brand-subline">{subtitle}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
