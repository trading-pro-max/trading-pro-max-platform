import type {
  EarthFocusRegion,
  LivingEarthPlan,
  LivingEarthState,
  LivingEarthSurface,
} from "@/lib/brand/earth-background-types";
import { resolveLivingEarthFocus } from "@/lib/brand/earth-focus";
import type {
  SolarPhase,
  WeatherState,
} from "@/lib/environment/client-types";
import type { PlanRealmId } from "@/lib/plans/realms/types";
import { getPublicHybridEarthPolicy } from "@/lib/brand/hybrid-earth-policy";
import {
  getLivingEarthRenderDecision,
  type LivingEarthSurface as RuntimeLivingEarthSurface,
} from "@/lib/brand/living-earth";
import ProMaxLivingEarth from "./ProMaxLivingEarth";

type LivingEarthBackgroundProps = {
  className?: string;
  locale?: string;
  plan?: LivingEarthPlan;
  region?: EarthFocusRegion;
  state?: LivingEarthState;
  surface?: LivingEarthSurface;
  timeZone?: string;
  solarPhase?: SolarPhase;
  weatherState?: WeatherState;
};

const planRealmIds: Record<LivingEarthPlan, PlanRealmId> = {
  free: "free_earth",
  pro: "pro_orbit",
  vip: "vip_lunar",
  institutional: "institutional_station",
  founder: "alkon_universe",
};

function runtimeSurfaceForBackground(
  surface: LivingEarthSurface
): RuntimeLivingEarthSurface {
  if (surface === "public_entry") return "home_hero";
  if (surface === "workstation") return "trading_workspace";
  if (surface === "settings") return "settings";
  if (surface === "diagnostics") return "diagnostics";
  if (surface === "founder_command") return "founder_private_preview";
  return "future_world_ready";
}

export default function LivingEarthBackground({
  className,
  locale,
  plan = "free",
  region,
  state = "paper_safe",
  surface = "public_entry",
  timeZone,
  solarPhase = "day",
  weatherState = "unknown",
}: LivingEarthBackgroundProps) {
  const focus = resolveLivingEarthFocus({
    locale,
    selectedRegion: region,
    timeZone,
  });
  const realmId = planRealmIds[plan];
  const hybridPolicy = getPublicHybridEarthPolicy();
  const runtimeSurface = runtimeSurfaceForBackground(surface);
  const renderDecision = getLivingEarthRenderDecision({
    surface: runtimeSurface,
    textureMode: "auto",
  });

  return (
    <div
      aria-hidden="true"
      className={["tpm-living-earth-background", className].filter(Boolean).join(" ")}
      data-code-only="true"
      data-earth-exact-city-used="false"
      data-earth-external-map-assets="false"
      data-earth-focus-region={focus.region}
      data-earth-gps-used="false"
      data-earth-render-mode={hybridPolicy.renderMode}
      data-earth-renderer="hybrid"
      data-earth-plan={plan}
      data-earth-raster-assets="false"
      data-earth-realm={realmId}
      data-earth-state={state}
      data-earth-surface={surface}
      data-earth-texture-active={hybridPolicy.textureActive ? "true" : "false"}
      data-env-solar-phase={solarPhase}
      data-env-weather-state={weatherState}
      data-environment-engine="adaptive_atmosphere"
      data-living-earth-asset-status={renderDecision.assetStatus}
      data-living-earth-chart-safe={renderDecision.chartSafe ? "true" : "false"}
      data-living-earth-mode={renderDecision.mode}
      data-living-earth-motion={renderDecision.motionMode}
      data-living-earth-runtime="active"
      data-living-earth-surface={runtimeSurface}
      data-living-earth-visual-intensity={renderDecision.visualIntensity}
      data-reduced-motion-supported="true"
    >
      <div className="tpm-living-earth-stars" />
      <div className="tpm-living-earth-weather" />
      <div className="tpm-living-earth-moon-layer" />
      <div className="tpm-living-earth-orbital-grid" />
      <div className="tpm-living-earth-realm-atmosphere" data-earth-realm={realmId} />
      <div className="tpm-living-earth-realm-orbit" data-earth-realm={realmId} />
      <div className="tpm-living-earth-horizon">
        <div className="tpm-living-earth-atmosphere-arc" />
        <div className="tpm-living-earth-globe">
          <ProMaxLivingEarth
            className="tpm-living-earth-procedural-planet"
            showAtmosphere={surface !== "settings" && surface !== "diagnostics"}
            showClouds={surface !== "workstation"}
            showTerminator
            surface={runtimeSurface}
            textureMode="auto"
          />
        </div>
        <div className="tpm-living-earth-terminator" />
        <div className="tpm-living-earth-city-lights" />
        <div className="tpm-living-earth-continent tpm-living-earth-continent-a" />
        <div className="tpm-living-earth-continent tpm-living-earth-continent-b" />
        <div className="tpm-living-earth-continent tpm-living-earth-continent-c" />
        <div className="tpm-living-earth-focus-signal" />
      </div>
    </div>
  );
}
