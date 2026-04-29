import type { DeviceTimePhase, DeviceTimeReality } from "./types";

function getPhase(hour: number): DeviceTimePhase {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "sunset";
  if (hour >= 20 && hour < 23) return "night";
  return "deep_night";
}

const phaseLabels: Record<DeviceTimePhase, string> = {
  dawn: "Dawn",
  morning: "Morning",
  day: "Day",
  sunset: "Sunset",
  night: "Night",
  deep_night: "Deep night",
};

export function getDeviceTimePhase(date = new Date()): DeviceTimeReality {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const phase = getPhase(hour);

  return {
    hour,
    minute,
    phase,
    label: phaseLabels[phase],
    simulationNotice: "Device-time simulation only",
    weatherNotice: "Weather not connected",
  };
}
