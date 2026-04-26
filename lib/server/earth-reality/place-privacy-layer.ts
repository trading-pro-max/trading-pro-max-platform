import type { EarthRealityCheck } from "./types";

export function getEarthPlacePrivacyLayerChecks(): EarthRealityCheck[] {
  return [
    {
      checkId: "earth_privacy_no_precise_location",
      layer: "place_privacy",
      surface: "settings",
      requirement:
        "Earth-native atmosphere must not require GPS, precise location, hidden tracking, or exact-location storage.",
      decision: "pass",
      reason:
        "Adaptive Atmosphere uses browser time, timezone, locale, or optional manual selection only.",
      userImpact: "Users stay in control of privacy and location context.",
      trustImpact: "No precise tracking is hidden inside visual personalization.",
      safetyImpact: "Weather/place context cannot become surveillance or advice.",
      requiredFix: "Add reviewed consent before any future city/provider integration.",
      publicCopyRule: "Say no precise location tracking.",
      validationRule: "Privacy API must report GPS false and external weather calls false.",
    },
    {
      checkId: "earth_privacy_public_copy",
      layer: "place_privacy",
      surface: "diagnostics",
      requirement: "Public Diagnostics must explain privacy in user-safe language.",
      decision: "pass",
      reason:
        "Diagnostics can say Environment readiness and no precise location tracking without exposing internal systems.",
      userImpact: "Users can verify what is and is not tracked.",
      trustImpact: "Transparent privacy copy raises confidence.",
      safetyImpact: "Private command details remain hidden.",
      requiredFix: "Keep diagnostics compact and public-safe.",
      publicCopyRule: "Avoid private command and internal governance language.",
      validationRule: "Diagnostics must not contain forbidden private terms.",
    },
  ];
}
