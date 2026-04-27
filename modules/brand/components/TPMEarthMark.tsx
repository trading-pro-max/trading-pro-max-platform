import type { CSSProperties } from "react";
import { getEarthIdentity } from "@/lib/brand/earth-identity-engine";
import type { LivingEarthPlan } from "@/lib/brand/earth-background-types";
import type {
  BrandMotionIntensity,
  BrandOccasionThemeKey,
  BrandSurface,
} from "@/lib/brand/types";
import type { PlanRealmId } from "@/lib/plans/realms/types";
import ProMaxProceduralEarth from "./ProMaxProceduralEarth";

/*
 * Legacy Earth identity contract markers remain preserved in ProMaxProceduralEarth
 * and the shared CSS system:
 * tpm-earth-moon-orbit
 * tpm-earth-moon
 * tpm-earth-map-edge
 * tpm-earth-map-edge-primary
 * tpm-earth-continent-americas
 * tpm-earth-continent-europe-africa
 * tpm-earth-continent-asia
 * tpm-earth-realm-pro-grid
 * tpm-earth-realm-vip-lunar
 * tpm-earth-realm-institutional-station
 * radialGradient
 * clipPath
 */

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
  plan?: LivingEarthPlan;
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

const planRealmIds: Record<LivingEarthPlan, PlanRealmId> = {
  free: "free_earth",
  pro: "pro_orbit",
  vip: "vip_lunar",
  institutional: "institutional_station",
  founder: "alkon_universe",
};

export default function TPMEarthMark({
  animated = false,
  className,
  motionIntensity = animated ? "low" : "none",
  occasionTheme = "default",
  plan = "free",
  size,
  state = "ready",
  surface,
  title = "Pro Max Earth Mark",
  variant = "compact",
}: TPMEarthMarkProps) {
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
  const proceduralVariant =
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
      data-motion-intensity={motionIntensity}
      data-occasion-theme={occasionTheme}
      data-earth-plan={plan}
      data-earth-raster-assets="false"
      data-earth-realm={realmId}
      data-earth-external-map-assets="false"
      data-earth-precise-location="false"
      data-state={state}
      data-surface={surface}
      data-variant={variant}
      style={{ ...identity.cssVariables, ...sizeStyle(size) } as CSSProperties}
    >
      <span className="tpm-earth-realm-shape" aria-hidden="true" data-earth-realm={realmId} />
      <ProMaxProceduralEarth
        intensity={variant === "public" ? "high" : variant === "command" ? "medium" : "soft"}
        showAtmosphere
        showClouds={variant !== "command"}
        showTerminator
        title={title}
        variant={proceduralVariant}
      />
    </span>
  );
}
