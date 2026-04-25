import TPMEarthMark, {
  type TPMEarthMarkState,
  type TPMEarthMarkVariant,
} from "./TPMEarthMark";
import type {
  BrandMotionIntensity,
  BrandOccasionThemeKey,
  BrandSurface,
} from "@/lib/brand/types";

type ProductLogoProps = {
  animated?: boolean;
  className?: string;
  markTitle?: string;
  mode?: "lockup" | "mark-only" | "wordmark-only";
  motionIntensity?: BrandMotionIntensity;
  occasionTheme?: BrandOccasionThemeKey;
  showSubtitle?: boolean;
  state?: TPMEarthMarkState;
  surface?: BrandSurface;
  subtitle?: string;
  variant?: "nav" | "topbar" | "hero" | "auth" | "compact" | "command";
};

type BrandMarkProps = {
  animated?: boolean;
  className?: string;
  motionIntensity?: BrandMotionIntensity;
  occasionTheme?: BrandOccasionThemeKey;
  state?: TPMEarthMarkState;
  surface?: BrandSurface;
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
  motionIntensity,
  occasionTheme,
  state = "paper_safe",
  surface,
  title = "Trading Pro Max Celestial Swiss Earth Mark",
  variant = "compact",
}: BrandMarkProps) {
  return (
    <TPMEarthMark
      animated={animated}
      className={["tpm-brand-mark", className].filter(Boolean).join(" ")}
      motionIntensity={motionIntensity}
      occasionTheme={occasionTheme}
      state={state}
      surface={surface}
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
  markTitle = "Trading Pro Max Celestial Swiss Earth Mark",
  mode = "lockup",
  motionIntensity,
  occasionTheme,
  showSubtitle = true,
  state,
  surface,
  subtitle = "Swiss-inspired trading workspace",
  variant = "nav",
}: ProductLogoProps) {
  const showMark = mode !== "wordmark-only";
  const showWordmark = mode !== "mark-only";
  const markVariant = markVariantForLogo(variant);
  const markState = state ?? (variant === "command" ? "local_only" : "paper_safe");
  const markAnimated =
    animated ?? (variant === "hero" || variant === "command" || variant === "topbar");
  const resolvedMotion =
    motionIntensity ??
    (variant === "command"
      ? "command"
      : markAnimated
      ? "low"
      : "none");

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
          motionIntensity={resolvedMotion}
          occasionTheme={occasionTheme}
          state={markState}
          surface={surface}
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
