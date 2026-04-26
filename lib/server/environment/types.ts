export type EnvironmentMode =
  | "system"
  | "adaptive"
  | "solar_only"
  | "weather_only"
  | "light"
  | "dark"
  | "high_contrast"
  | "static";

export type SolarPhase =
  | "dawn"
  | "sunrise"
  | "morning"
  | "day"
  | "golden_hour"
  | "sunset"
  | "night"
  | "deep_night";

export type WeatherState =
  | "unknown"
  | "clear"
  | "cloudy"
  | "rain"
  | "storm"
  | "snow"
  | "fog"
  | "heat"
  | "wind"
  | "manual";

export type MarketSession =
  | "asia"
  | "europe"
  | "us"
  | "after_hours"
  | "weekend"
  | "closed"
  | "unknown";

export type SystemWeather =
  | "ready_clear"
  | "fallback_fog"
  | "blocked_red_signal"
  | "review_clouds"
  | "maintenance_cold"
  | "degraded_dim"
  | "build_failed_storm";

export type PlanRealmAtmosphere =
  | "free_earth"
  | "pro_orbit"
  | "vip_lunar"
  | "institutional_station"
  | "alkon_universe_private";

export type SurfaceIntensity =
  | "none"
  | "subtle"
  | "standard"
  | "expressive"
  | "command_private";

export type EnvironmentPrivacySource =
  | "browser_time"
  | "timezone"
  | "locale"
  | "country"
  | "user_selected_region"
  | "user_selected_city"
  | "manual"
  | "unavailable";

export type EnvironmentSurface =
  | "public_entry"
  | "workspace"
  | "chart"
  | "settings"
  | "diagnostics"
  | "assistant"
  | "journal"
  | "founder_alkon";

export type LunarLayer = {
  publicLabel: "Moon layer";
  readiness: "visual_hint_only";
  source: "calendar_cycle_estimate";
  affectsTrading: false;
};

export type PlanetaryEnvironmentInput = {
  mode?: EnvironmentMode;
  timestamp?: string | number | Date;
  timezone?: string;
  locale?: string;
  country?: string;
  userSelectedRegion?: string;
  userSelectedCity?: string;
  weatherPreference?: WeatherState;
  planRealm?: PlanRealmAtmosphere;
  surface?: EnvironmentSurface;
  systemStatus?:
    | "ready"
    | "fallback"
    | "blocked"
    | "review"
    | "maintenance"
    | "degraded"
    | "build_failed";
  reducedMotion?: boolean;
  themePreference?: "system" | "light" | "dark" | "high_contrast";
};

export type PlanetaryEnvironmentSnapshot = {
  mode: EnvironmentMode;
  solarPhase: SolarPhase;
  lunarLayer: LunarLayer;
  weatherState: WeatherState;
  marketSession: MarketSession;
  systemWeather: SystemWeather;
  planRealm: PlanRealmAtmosphere;
  surface: EnvironmentSurface;
  surfaceIntensity: SurfaceIntensity;
  themeResolved: "light" | "dark" | "high_contrast";
  motionAllowed: boolean;
  reducedMotion: boolean;
  privacySource: EnvironmentPrivacySource;
  publicLabel: string;
  internalLabel: "TPM Planetary Environment Engine";
  cssClassNames: string[];
  safeCopy: string[];
  blockedReasons: string[];
  userControls: EnvironmentMode[];
  diagnostics: {
    mode: EnvironmentMode;
    solarPhase: SolarPhase;
    weatherState: WeatherState;
    weatherSource: "manual_or_unavailable";
    marketSession: MarketSession;
    marketSessionTruth: "atmosphere_only_no_live_feed";
    systemWeather: SystemWeather;
    privacy: "no_gps_no_precise_location_no_hidden_tracking";
  };
  truth: {
    gpsUsed: false;
    preciseLocationTracking: false;
    exactLocationStored: false;
    externalWeatherCalls: false;
    externalMapAssets: false;
    weatherTradingAdvice: false;
    liveExecution: "blocked";
    realMoney: "blocked";
    brokerFeedBillingLaunch: "inactive";
    socialPublishing: "inactive";
    rasterAssets: false;
  };
};

export type SolarPhaseWindow = {
  phase: SolarPhase;
  startMinutes: number;
  endMinutes: number;
};
