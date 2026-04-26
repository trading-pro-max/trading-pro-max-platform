import type { WeatherState } from "./types";

const weatherStates = new Set<WeatherState>([
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
]);

export function isWeatherState(value: unknown): value is WeatherState {
  return typeof value === "string" && weatherStates.has(value as WeatherState);
}

export function resolveWeatherState(input: {
  weatherPreference?: WeatherState;
} = {}): WeatherState {
  if (input.weatherPreference && input.weatherPreference !== "unknown") {
    return input.weatherPreference;
  }

  return "unknown";
}

export function getWeatherProviderReadiness() {
  return {
    status: "manual_or_future_provider_only" as const,
    liveProviderConfigured: false,
    externalWeatherCalls: false,
    gpsUsed: false,
    preciseLocationTracking: false,
    tradingAdviceAllowed: false,
    safeFallback: "unknown" as WeatherState,
  };
}
