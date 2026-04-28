import type { CSSProperties } from "react";
import { getEarthIdentity } from "@/lib/brand/earth-identity-engine";
import type { LivingEarthPlan } from "@/lib/brand/earth-background-types";
import type { HybridEarthTextureMode } from "@/lib/brand/earth-texture-types";
import type {
  BrandMotionIntensity,
  BrandOccasionThemeKey,
  BrandSurface,
} from "@/lib/brand/types";
import type { PlanRealmId } from "@/lib/plans/realms/types";
import ProMaxHybridEarth from "./ProMaxHybridEarth";

export type ProMaxEarthMarkVariant = "public" | "compact" | "command";

export type ProMaxEarthMarkState =
  | "ready"
  | "local_only"
  | "paper_safe"
  | "fallback"
  | "blocked"
  | "review_required"
  | "degraded"
  | "inactive"
  | "planned";

export type ProMaxEarthMarkProps = {
  animated?: boolean;
  className?: string;
  motionIntensity?: BrandMotionIntensity;
  occasionTheme?: BrandOccasionThemeKey;
  plan?: LivingEarthPlan;
  showAtmosphere?: boolean;
  showClouds?: boolean;
  showTerminator?: boolean;
  size?: number | string;
  state?: ProMaxEarthMarkState;
  surface?: BrandSurface;
  textureMode?: HybridEarthTextureMode;
  title?: string;
  variant?: ProMaxEarthMarkVariant;
};

function sizeStyle(size?: number | string): CSSProperties | undefined {
  if (!size) return undefined;

  return {
    "--tpm-earth-size": typeof size === "number" ? `${size}px` : size,
  } as CSSProperties;
}

const planRealmIds: Record<LivingEarthPlan, PlanRealmId> = {
  free: "free_earth",
  pro: "pro_orbit",
  vip: "vip_lunar",
  institutional: "institutional_station",
  founder: "alkon_universe",
};

export default function ProMaxEarthMark({
  animated = false,
  className,
  motionIntensity = animated ? "low" : "none",
  occasionTheme = "default",
  plan = "free",
  showAtmosphere = true,
  showClouds,
  showTerminator = true,
  size,
  state = "ready",
  surface,
  textureMode = "auto",
  title = "Pro Max Earth Mark",
  variant = "compact",
}: ProMaxEarthMarkProps) {
  const identity = getEarthIdentity({
    plan,
    surface,
    state:
      state === "ready" || state === "degraded" || state === "inactive" || state === "planned"
        ? "paper_safe"
        : state,
  });
  const stateClassName = state.replaceAll("_", "-");
  const occasionClassName = occasionTheme.replaceAll("_", "-");
  const surfaceClassName = surface?.replaceAll("_", "-");
  const realmId = planRealmIds[plan];
  const hybridVariant =
    variant === "public" ? "hero" : variant === "command" ? "workspace" : "compact";

  return (
    <span
      className={[
        "tpm-earth-mark",
        `tpm-earth-mark--${variant}`,
        `tpm-earth-mark-${variant}`,
        `tpm-earth-mark--${stateClassName}`,
        `tpm-earth-mark-${stateClassName}`,
        `tpm-earth-mark--plan-${plan}`,
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
      data-earth-external-map-assets="false"
      data-earth-swiss-regulatory-claim="false"
      data-earth-visual-direction="swiss-inspired-procedural"
      data-earth-plan={plan}
      data-earth-precise-location="false"
      data-earth-raster-assets="false"
      data-earth-realm={realmId}
      data-motion-intensity={motionIntensity}
      data-occasion-theme={occasionTheme}
      data-state={state}
      data-surface={surface}
      data-variant={variant}
      style={{ ...identity.cssVariables, ...sizeStyle(size) } as CSSProperties}
    >
      <span className="tpm-earth-realm-shape" aria-hidden="true" data-earth-realm={realmId} />
      <ProMaxHybridEarth
        intensity={variant === "public" ? "high" : variant === "command" ? "medium" : "soft"}
        showAtmosphere={showAtmosphere}
        showClouds={showClouds ?? variant !== "command"}
        showTerminator={showTerminator}
        size={size}
        textureMode={textureMode}
        title={title}
        variant={hybridVariant}
      />
    </span>
  );
}
