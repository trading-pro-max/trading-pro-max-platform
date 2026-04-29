import { getDeviceTimePhase } from "./getDeviceTimePhase";
import { getSeasonPhase } from "./getSeasonPhase";
import type { DeviceTimePhase, UniverseMood } from "./types";

const phaseMood: Record<
  DeviceTimePhase,
  Pick<
    UniverseMood,
    | "visualIntensity"
    | "starVisibility"
    | "atmosphereStrength"
    | "cloudOpacity"
    | "nightLightsOpacity"
    | "orbitSpeedSeconds"
    | "particleDensity"
    | "backgroundDepth"
    | "horizonGlow"
    | "motionIntensity"
    | "soundscapeMood"
  >
> = {
  dawn: {
    visualIntensity: 0.74,
    starVisibility: 0.24,
    atmosphereStrength: 0.78,
    cloudOpacity: 0.44,
    nightLightsOpacity: 0.26,
    orbitSpeedSeconds: 36,
    particleDensity: 0.38,
    backgroundDepth: 0.58,
    horizonGlow: 0.62,
    motionIntensity: 0.68,
    soundscapeMood: "quiet_dawn",
  },
  morning: {
    visualIntensity: 0.78,
    starVisibility: 0.08,
    atmosphereStrength: 0.7,
    cloudOpacity: 0.4,
    nightLightsOpacity: 0.08,
    orbitSpeedSeconds: 38,
    particleDensity: 0.26,
    backgroundDepth: 0.42,
    horizonGlow: 0.48,
    motionIntensity: 0.6,
    soundscapeMood: "clear_day",
  },
  day: {
    visualIntensity: 0.84,
    starVisibility: 0.04,
    atmosphereStrength: 0.64,
    cloudOpacity: 0.36,
    nightLightsOpacity: 0.02,
    orbitSpeedSeconds: 40,
    particleDensity: 0.18,
    backgroundDepth: 0.36,
    horizonGlow: 0.4,
    motionIntensity: 0.54,
    soundscapeMood: "clear_day",
  },
  sunset: {
    visualIntensity: 0.82,
    starVisibility: 0.28,
    atmosphereStrength: 0.8,
    cloudOpacity: 0.48,
    nightLightsOpacity: 0.22,
    orbitSpeedSeconds: 37,
    particleDensity: 0.44,
    backgroundDepth: 0.64,
    horizonGlow: 0.72,
    motionIntensity: 0.7,
    soundscapeMood: "amber_sunset",
  },
  night: {
    visualIntensity: 0.72,
    starVisibility: 0.72,
    atmosphereStrength: 0.86,
    cloudOpacity: 0.38,
    nightLightsOpacity: 0.66,
    orbitSpeedSeconds: 34,
    particleDensity: 0.62,
    backgroundDepth: 0.82,
    horizonGlow: 0.56,
    motionIntensity: 0.72,
    soundscapeMood: "deep_cosmic",
  },
  deep_night: {
    visualIntensity: 0.68,
    starVisibility: 0.9,
    atmosphereStrength: 0.92,
    cloudOpacity: 0.34,
    nightLightsOpacity: 0.82,
    orbitSpeedSeconds: 32,
    particleDensity: 0.72,
    backgroundDepth: 0.92,
    horizonGlow: 0.46,
    motionIntensity: 0.74,
    soundscapeMood: "deep_cosmic",
  },
};

export function getUniverseMood(date = new Date()): UniverseMood {
  const time = getDeviceTimePhase(date);
  const season = getSeasonPhase(date);
  const phase = phaseMood[time.phase];
  const dayProgress = (time.hour * 60 + time.minute) / 1440;

  return {
    time,
    season,
    ...phase,
    earthLightAngle: Math.round(dayProgress * 360 - 90),
    productTruthOverlayPriority: "always_visible",
    sourceLabels: {
      deviceTime: "Local device time controls the living Universe",
      season: "Season is based on device date",
      soundscape: "Soundscape is user controlled and off by default",
      weather: "Weather not connected",
    },
  };
}
