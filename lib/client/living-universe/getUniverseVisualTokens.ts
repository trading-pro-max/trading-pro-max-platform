import { getUniverseMood } from "./getUniverseMood";

export function getUniverseVisualTokens(date = new Date()) {
  const mood = getUniverseMood(date);

  return {
    phase: mood.time.phase,
    season: mood.season.season,
    atmosphereOpacity: mood.atmosphereStrength,
    starOpacity: mood.starVisibility,
    cloudOpacity: mood.cloudOpacity,
    nightLightsOpacity: mood.nightLightsOpacity,
    orbitDurationSeconds: mood.orbitSpeedSeconds,
    horizonGlow: mood.horizonGlow,
    backgroundDepth: mood.backgroundDepth,
    motionIntensity: mood.motionIntensity,
    reducedMotionSafe: true,
  };
}
