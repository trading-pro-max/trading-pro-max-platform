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

export type ClientEnvironmentSnapshot = {
  mode: EnvironmentMode;
  solarPhase: SolarPhase;
  weatherState: WeatherState;
  motionAllowed: boolean;
  publicLabel: string;
};

export const ENVIRONMENT_MODES: EnvironmentMode[] = [
  "system",
  "adaptive",
  "solar_only",
  "weather_only",
  "light",
  "dark",
  "high_contrast",
  "static",
];

export const ENVIRONMENT_MODE_LABELS: Record<EnvironmentMode, string> = {
  system: "System",
  adaptive: "Adaptive",
  solar_only: "Solar",
  weather_only: "Weather",
  light: "Light",
  dark: "Dark",
  high_contrast: "High Contrast",
  static: "Static",
};

export const WEATHER_STATES: WeatherState[] = [
  "unknown",
  "clear",
  "cloudy",
  "rain",
  "storm",
  "snow",
  "fog",
  "heat",
  "wind",
  "manual",
];
