import type { PlanetaryEnvironmentInput, SystemWeather } from "./types";

export function resolveSystemWeather(
  systemStatus: PlanetaryEnvironmentInput["systemStatus"] = "ready"
): SystemWeather {
  if (systemStatus === "fallback") return "fallback_fog";
  if (systemStatus === "blocked") return "blocked_red_signal";
  if (systemStatus === "review") return "review_clouds";
  if (systemStatus === "maintenance") return "maintenance_cold";
  if (systemStatus === "degraded") return "degraded_dim";
  if (systemStatus === "build_failed") return "build_failed_storm";

  return "ready_clear";
}
