import TPMEarthMark, {
  type TPMEarthMarkState,
  type TPMEarthMarkVariant,
} from "./TPMEarthMark";

type ProductLogoProps = {
  animated?: boolean;
  className?: string;
  markTitle?: string;
  mode?: "lockup" | "mark-only" | "wordmark-only";
  showSubtitle?: boolean;
  state?: TPMEarthMarkState;
  subtitle?: string;
  variant?: "nav" | "topbar" | "hero" | "auth" | "compact" | "command";
};

type BrandMarkProps = {
  animated?: boolean;
  className?: string;
  state?: TPMEarthMarkState;
  title?: string;
  variant?: TPMEarthMarkVariant;
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
  animated = false,
  className,
  state = "paper_safe",
  title = "Trading Pro Max Earth Mark",
  variant = "compact",
}: BrandMarkProps) {
  return (
    <TPMEarthMark
      animated={animated}
      className={["tpm-brand-mark", className].filter(Boolean).join(" ")}
      state={state}
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
  animated,
  className,
  markTitle = "Trading Pro Max Earth Mark",
  mode = "lockup",
  showSubtitle = true,
  state,
  subtitle = "Global trading foundation",
  variant = "nav",
}: ProductLogoProps) {
  const showMark = mode !== "wordmark-only";
  const showWordmark = mode !== "mark-only";
  const markVariant = markVariantForLogo(variant);
  const markState = state ?? (variant === "command" ? "local_only" : "paper_safe");
  const markAnimated = animated ?? (variant === "hero" || variant === "command");

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
          animated={markAnimated}
          className="tpm-brand-lockup-mark"
          state={markState}
          title={markTitle}
          variant={markVariant}
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
