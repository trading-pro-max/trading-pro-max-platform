import {
  getPlanetaryEnvironmentSnapshot,
  isWeatherState,
  type EnvironmentMode,
  type EnvironmentSurface,
  type PlanetaryEnvironmentInput,
  type PlanRealmAtmosphere,
} from "@/lib/server/environment";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const modes = new Set<EnvironmentMode>([
  "system",
  "adaptive",
  "solar_only",
  "weather_only",
  "light",
  "dark",
  "high_contrast",
  "static",
]);
const realms = new Set<PlanRealmAtmosphere>([
  "free_earth",
  "pro_orbit",
  "vip_lunar",
  "institutional_station",
  "alkon_universe_private",
]);
const surfaces = new Set<EnvironmentSurface>([
  "public_entry",
  "workspace",
  "chart",
  "settings",
  "diagnostics",
  "assistant",
  "journal",
  "founder_alkon",
]);

function getParam(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key)?.trim() || undefined;
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const mode = getParam(searchParams, "mode");
  const weather = getParam(searchParams, "weather");
  const planRealm = getParam(searchParams, "planRealm");
  const surface = getParam(searchParams, "surface");
  const reducedMotion = getParam(searchParams, "reducedMotion");
  const input: PlanetaryEnvironmentInput = {
    timestamp: getParam(searchParams, "timestamp"),
    timezone: getParam(searchParams, "timezone"),
    locale: getParam(searchParams, "locale"),
    country: getParam(searchParams, "country"),
    userSelectedRegion: getParam(searchParams, "region"),
    userSelectedCity: getParam(searchParams, "city"),
    mode: modes.has(mode as EnvironmentMode) ? (mode as EnvironmentMode) : undefined,
    weatherPreference: isWeatherState(weather) ? weather : undefined,
    planRealm: realms.has(planRealm as PlanRealmAtmosphere)
      ? (planRealm as PlanRealmAtmosphere)
      : undefined,
    surface: surfaces.has(surface as EnvironmentSurface)
      ? (surface as EnvironmentSurface)
      : undefined,
    reducedMotion: reducedMotion === "true",
  };

  return noStoreJson({
    ok: true,
    snapshot: getPlanetaryEnvironmentSnapshot(input),
  });
}
