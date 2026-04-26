import type { EarthRealityCheck } from "./types";

export function getEarthEnvironmentLayerChecks(): EarthRealityCheck[] {
  return [
    {
      checkId: "earth_environment_code_only",
      layer: "environment",
      surface: "environment",
      requirement:
        "Earth identity and Adaptive Atmosphere must remain code-only with no images or raster assets.",
      decision: "pass",
      reason:
        "Living Earth, plan identity, and atmosphere are implemented with React/CSS/SVG concepts only.",
      userImpact: "Visual identity stays lightweight and local.",
      trustImpact: "No external image dependency is hidden.",
      safetyImpact: "No external map/weather/image asset is requested.",
      requiredFix: "Keep future visual work code-native unless explicitly approved.",
      publicCopyRule: "Use Earth-native and Adaptive Atmosphere.",
      validationRule: "Source and DOM must contain no raster assets or img tags.",
    },
    {
      checkId: "earth_environment_workspace_chart_safe",
      layer: "environment",
      surface: "trading_workspace",
      requirement:
        "Workspace atmosphere must remain chart-safe and never visually dominate the chart.",
      decision: "pass",
      reason:
        "Workspace surface intensity is subtle and chart surface intensity is none or ultra-subtle.",
      userImpact: "Users can focus on chart and paper ticket.",
      trustImpact: "Visual personality does not interfere with real use.",
      safetyImpact: "Reduced motion/static controls protect attention.",
      requiredFix: "Do not add noisy motion or heavy glow inside chart surfaces.",
      publicCopyRule: "Say chart-safe environment.",
      validationRule: "Workspace screenshots must show chart-first hierarchy.",
    },
  ];
}
