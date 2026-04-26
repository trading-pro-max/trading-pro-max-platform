import { getPlanetaryEnvironmentSnapshot } from "@/lib/server/environment";
import type { EarthRealityCheck } from "./types";

export function getEarthTimeLayerChecks(
  checkedAt = new Date().toISOString()
): EarthRealityCheck[] {
  const environment = getPlanetaryEnvironmentSnapshot({
    timestamp: checkedAt,
    mode: "adaptive",
    planRealm: "free_earth",
    surface: "public_entry",
    systemStatus: "ready",
  });

  return [
    {
      checkId: "earth_time_adaptive_atmosphere",
      layer: "time",
      surface: "environment",
      requirement:
        "Time, solar, weather, and market-session atmosphere must be informational only.",
      decision: "pass",
      reason:
        `Adaptive Atmosphere resolves ${environment.solarPhase}, ${environment.weatherState}, ${environment.marketSession}, and ${environment.systemWeather} without external calls.`,
      userImpact: "Users receive visual mood, not trading instructions.",
      trustImpact: "Time and session labels do not overclaim live status.",
      safetyImpact: "No weather, time, or session trading advice is allowed.",
      requiredFix: "Keep preview deterministic and user-overridable.",
      publicCopyRule: "Use Adaptive Atmosphere, Solar Theme, Weather Theme, and Static Mode.",
      validationRule: "Environment truth must report no GPS and no trading advice.",
    },
    {
      checkId: "earth_time_local_day_private",
      layer: "time",
      surface: "diagnostics",
      requirement:
        "Local Day Cycle and private command time language must not appear to normal users.",
      decision: "pass",
      reason:
        "Public diagnostics use environment readiness language while private day-cycle systems remain internal.",
      userImpact: "Users see simple readiness, not internal operating terms.",
      trustImpact: "Public/private language stays separated.",
      safetyImpact: "Internal command systems are not exposed as user controls.",
      requiredFix: "Keep private time language restricted to internal surfaces.",
      publicCopyRule: "Say System readiness or Adaptive Atmosphere readiness.",
      validationRule: "Public UI must not show private time-command terms.",
    },
  ];
}
