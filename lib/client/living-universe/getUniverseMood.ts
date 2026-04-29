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
    soundscapeMood: "quiet_dawn",
  },
  morning: {
    visualIntensity: 0.78,
    starVisibility: 0.08,
    atmosphereStrength: 0.7,
    cloudOpacity: 0.4,
    nightLightsOpacity: 0.08,
    orbitSpeedSeconds: 38,
    soundscapeMood: "clear_day",
  },
  day: {
    visualIntensity: 0.84,
    starVisibility: 0.04,
    atmosphereStrength: 0.64,
    cloudOpacity: 0.36,
    nightLightsOpacity: 0.02,
    orbitSpeedSeconds: 40,
    soundscapeMood: "clear_day",
  },
  sunset: {
    visualIntensity: 0.82,
    starVisibility: 0.28,
    atmosphereStrength: 0.8,
    cloudOpacity: 0.48,
    nightLightsOpacity: 0.22,
    orbitSpeedSeconds: 37,
    soundscapeMood: "amber_sunset",
  },
  night: {
    visualIntensity: 0.72,
    starVisibility: 0.72,
    atmosphereStrength: 0.86,
    cloudOpacity: 0.38,
    nightLightsOpacity: 0.66,
    orbitSpeedSeconds: 34,
    soundscapeMood: "deep_cosmic",
  },
  deep_night: {
    visualIntensity: 0.68,
    starVisibility: 0.9,
    atmosphereStrength: 0.92,
    cloudOpacity: 0.34,
    nightLightsOpacity: 0.82,
    orbitSpeedSeconds: 32,
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
  };
}
