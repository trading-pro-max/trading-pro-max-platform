import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";
import { getPlanetaryEnvironmentSnapshot } from "./engine";

export function getPlanetaryEnvironmentReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getPlanetaryEnvironmentSnapshot({
    timestamp: checkedAt,
    mode: "adaptive",
    planRealm: "free_earth",
    surface: "public_entry",
    systemStatus: "ready",
  });

  return {
    checkedAt,
    status: "ready" as const,
    publicName: "Adaptive Atmosphere",
    internalName: snapshot.internalLabel,
    snapshot,
    privacy: snapshot.truth,
    publicExposure: {
      allowedPublicTerms: [
        "Adaptive Atmosphere",
        "Solar Theme",
        "Weather Theme",
        "Static Mode",
      ],
      privateTermsPublic: false,
    },
    nextSafeActions: [
      "Keep weather manual or future-provider-only until reviewed.",
      "Keep workspace atmosphere subtle and chart-safe.",
      "Let users override Adaptive Atmosphere with Light, Dark, System, High Contrast, or Static.",
    ],
  };
}

export function getPlanetaryEnvironmentDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const readiness = getPlanetaryEnvironmentReadinessSnapshot(checkedAt);

  return {
    key: "planetary_environment_engine",
    label: "Adaptive Atmosphere readiness",
    status: "ready",
    summary: "Privacy-safe time, weather, market-session, and system atmosphere ready",
    detail:
      `${readiness.snapshot.publicLabel} resolves ${readiness.snapshot.solarPhase}, ${readiness.snapshot.weatherState}, ${readiness.snapshot.marketSession}, ${readiness.snapshot.systemWeather}, ${readiness.snapshot.planRealm}, and ${readiness.snapshot.surfaceIntensity}. GPS, precise tracking, external weather calls, raster assets, and weather-based trading advice are disabled.`,
    checkedAt,
  };
}
