import { resolveMarketSession } from "./market-session";
import { resolveRealmAtmosphere } from "./realm-atmosphere";
import { resolveSolarPhase } from "./solar-phase";
import { resolveSurfaceIntensity } from "./surface-intensity";
import { resolveSystemWeather } from "./system-weather";
import { resolveEnvironmentTime } from "./time-resolver";
import type {
  EnvironmentMode,
  PlanetaryEnvironmentInput,
  PlanetaryEnvironmentSnapshot,
} from "./types";
import { resolveWeatherState } from "./weather";

const userControls: EnvironmentMode[] = [
  "system",
  "adaptive",
  "solar_only",
  "weather_only",
  "light",
  "dark",
  "high_contrast",
  "static",
];

function publicLabelForMode(mode: EnvironmentMode) {
  if (mode === "solar_only") return "Solar Theme";
  if (mode === "weather_only") return "Weather Theme";
  if (mode === "static") return "Static Mode";
  if (mode === "light") return "Light";
  if (mode === "dark") return "Dark";
  if (mode === "high_contrast") return "High Contrast";
  return "Adaptive Atmosphere";
}

function resolveTheme(input: PlanetaryEnvironmentInput, hour: number) {
  if (input.mode === "light" || input.themePreference === "light") return "light";
  if (input.mode === "dark" || input.themePreference === "dark") return "dark";
  if (input.mode === "high_contrast" || input.themePreference === "high_contrast") {
    return "high_contrast";
  }

  return hour >= 7 && hour < 19 ? "light" : "dark";
}

function kebab(value: string) {
  return value.replaceAll("_", "-");
}

export function getPlanetaryEnvironmentSnapshot(
  input: PlanetaryEnvironmentInput = {}
): PlanetaryEnvironmentSnapshot {
  const mode = input.mode ?? "adaptive";
  const time = resolveEnvironmentTime(input);
  const solarPhase = resolveSolarPhase(time);
  const weatherState = resolveWeatherState({
    weatherPreference: input.weatherPreference,
  });
  const marketSession = resolveMarketSession({
    timestamp: time.date,
    utcDayOfWeek: time.utcDayOfWeek,
    utcHour: time.utcHour,
  });
  const systemWeather = resolveSystemWeather(input.systemStatus);
  const planRealm = input.planRealm ?? "free_earth";
  const surface = input.surface ?? "public_entry";
  const realmAtmosphere = resolveRealmAtmosphere(planRealm);
  const surfaceIntensity = resolveSurfaceIntensity(surface);
  const themeResolved = resolveTheme(input, time.hour);
  const reducedMotion = Boolean(input.reducedMotion) || mode === "static";
  const motionAllowed =
    !reducedMotion &&
    surfaceIntensity !== "none" &&
    surfaceIntensity !== "subtle" ? true : !reducedMotion && surface === "workspace";

  const cssClassNames = [
    `tpm-env-${kebab(mode)}`,
    `tpm-env-${kebab(solarPhase)}`,
    `tpm-weather-${kebab(weatherState)}`,
    `tpm-market-${kebab(marketSession)}`,
    `tpm-system-${kebab(systemWeather)}`,
    realmAtmosphere.cssClassName,
    `tpm-surface-${kebab(surfaceIntensity)}`,
    motionAllowed ? "tpm-env-motion" : "tpm-env-static",
    themeResolved === "high_contrast" ? "tpm-env-high-contrast" : `tpm-env-theme-${themeResolved}`,
  ];

  return {
    mode,
    solarPhase,
    lunarLayer: {
      publicLabel: "Moon layer",
      readiness: "visual_hint_only",
      source: "calendar_cycle_estimate",
      affectsTrading: false,
    },
    weatherState,
    marketSession,
    systemWeather,
    planRealm,
    surface,
    surfaceIntensity,
    themeResolved,
    motionAllowed,
    reducedMotion,
    privacySource: time.privacySource,
    publicLabel: publicLabelForMode(mode),
    internalLabel: "TPM Planetary Environment Engine",
    cssClassNames,
    safeCopy: [
      "Adaptive Atmosphere adjusts the platform's visual mood by time, selected region, system state, and your motion preference.",
      "It does not use precise location and does not affect trading decisions.",
      "Weather and market-session awareness are atmosphere only, not live feed or trading advice.",
    ],
    blockedReasons: [
      "GPS and precise location tracking are blocked.",
      "External weather calls are inactive until a reviewed provider exists.",
      "Weather, time, and market session never enable trading decisions.",
      "Live execution, real money, broker/feed, billing, launch, and social publishing stay inactive.",
    ],
    userControls,
    diagnostics: {
      mode,
      solarPhase,
      weatherState,
      weatherSource: "manual_or_unavailable",
      marketSession,
      marketSessionTruth: "atmosphere_only_no_live_feed",
      systemWeather,
      privacy: "no_gps_no_precise_location_no_hidden_tracking",
    },
    truth: {
      gpsUsed: false,
      preciseLocationTracking: false,
      exactLocationStored: false,
      externalWeatherCalls: false,
      externalMapAssets: false,
      weatherTradingAdvice: false,
      liveExecution: "blocked",
      realMoney: "blocked",
      brokerFeedBillingLaunch: "inactive",
      socialPublishing: "inactive",
      rasterAssets: false,
    },
  };
}
