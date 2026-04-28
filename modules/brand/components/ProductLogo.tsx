import ProMaxEarthMark, {
  type ProMaxEarthMarkState,
  type ProMaxEarthMarkVariant,
} from "./ProMaxEarthMark";
import type {
  BrandMotionIntensity,
  BrandOccasionThemeKey,
  BrandSurface,
} from "@/lib/brand/types";
import type { LivingEarthPlan } from "@/lib/brand/earth-background-types";
import type { LivingEarthSurface as RuntimeLivingEarthSurface } from "@/lib/brand/living-earth";

type ProductLogoProps = {
  animated?: boolean;
  className?: string;
  markTitle?: string;
  livingEarthSurface?: RuntimeLivingEarthSurface;
  mode?: "lockup" | "mark-only" | "wordmark-only";
  motionIntensity?: BrandMotionIntensity;
  occasionTheme?: BrandOccasionThemeKey;
  plan?: LivingEarthPlan;
  showSubtitle?: boolean;
  state?: ProMaxEarthMarkState;
  surface?: BrandSurface;
  subtitle?: string;
  variant?: "nav" | "topbar" | "hero" | "auth" | "compact" | "command";
};

type BrandMarkProps = {
  animated?: boolean;
  className?: string;
  motionIntensity?: BrandMotionIntensity;
  occasionTheme?: BrandOccasionThemeKey;
  plan?: LivingEarthPlan;
  livingEarthSurface?: RuntimeLivingEarthSurface;
  state?: ProMaxEarthMarkState;
  surface?: BrandSurface;
  title?: string;
  variant?: ProMaxEarthMarkVariant;
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

function livingEarthSurfaceForLogo(
  variant: NonNullable<ProductLogoProps["variant"]>
): RuntimeLivingEarthSurface {
  if (variant === "hero") return "home_hero";
  if (variant === "nav") return "public_header_logo";
  if (variant === "command") return "founder_private_preview";
  return "compact_logo";
}

export function BrandMark({
  animated = false,
  className,
  livingEarthSurface,
  motionIntensity,
  occasionTheme,
  plan = "free",
  state = "paper_safe",
  surface,
  title = "Pro Max Earth Mark",
  variant = "compact",
}: BrandMarkProps) {
  return (
    <ProMaxEarthMark
      animated={animated}
      className={["tpm-brand-mark", className].filter(Boolean).join(" ")}
      livingEarthSurface={livingEarthSurface}
      motionIntensity={motionIntensity}
      occasionTheme={occasionTheme}
      plan={plan}
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
      Pro <span>Max</span>
    </span>
  );
}

export default function ProductLogo({
  animated,
  className,
  livingEarthSurface,
  markTitle = "Pro Max Earth Mark",
  mode = "lockup",
  motionIntensity,
  occasionTheme,
  plan,
  showSubtitle,
  state,
  surface,
  subtitle = "Trading",
  variant = "nav",
}: ProductLogoProps) {
  const showMark = mode !== "wordmark-only";
  const showWordmark = mode !== "mark-only";
  const markVariant = markVariantForLogo(variant);
  const markState = state ?? (variant === "command" ? "local_only" : "paper_safe");
  const markAnimated =
    animated ?? (variant === "hero" || variant === "command");
  const resolvedMotion =
    motionIntensity ??
    (variant === "command"
      ? "command"
      : markAnimated
      ? "low"
      : "none");
  const resolvedShowSubtitle = showSubtitle ?? variant === "command";
  const resolvedLivingEarthSurface =
    livingEarthSurface ?? livingEarthSurfaceForLogo(variant);

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
      data-brand-renderer="hybrid-earth-code-only"
      data-brand-swiss-regulatory-claim="false"
      data-brand-visual-origin="pro-max-swiss-earth-financial"
      data-living-earth-logo-surface={resolvedLivingEarthSurface}
      data-living-earth-runtime="active"
      data-swiss-inspired-precision="true"
    >
      {showMark ? (
        <BrandMark
          animated={markAnimated}
          className="tpm-brand-lockup-mark"
          livingEarthSurface={resolvedLivingEarthSurface}
          motionIntensity={resolvedMotion}
          occasionTheme={occasionTheme}
          plan={plan ?? (variant === "command" ? "founder" : "free")}
          state={markState}
          surface={surface}
          title={markTitle}
          variant={markVariant}
        />
      ) : null}
      {showWordmark ? (
        <div className="tpm-brand-lockup-copy">
          <BrandWordmark />
          {resolvedShowSubtitle ? <span className="tpm-brand-subline">{subtitle}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
