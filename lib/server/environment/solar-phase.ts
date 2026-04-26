import type { SolarPhase, SolarPhaseWindow } from "./types";

export const DEFAULT_SOLAR_PHASE_WINDOWS: SolarPhaseWindow[] = [
  { phase: "dawn", startMinutes: 270, endMinutes: 360 },
  { phase: "sunrise", startMinutes: 360, endMinutes: 480 },
  { phase: "morning", startMinutes: 480, endMinutes: 690 },
  { phase: "day", startMinutes: 690, endMinutes: 990 },
  { phase: "golden_hour", startMinutes: 990, endMinutes: 1110 },
  { phase: "sunset", startMinutes: 1110, endMinutes: 1230 },
  { phase: "night", startMinutes: 1230, endMinutes: 1410 },
  { phase: "deep_night", startMinutes: 1410, endMinutes: 270 },
];

export function resolveSolarPhaseFromMinutes(
  minutes: number,
  windows = DEFAULT_SOLAR_PHASE_WINDOWS
): SolarPhase {
  const normalized = ((minutes % 1440) + 1440) % 1440;

  for (const window of windows) {
    if (window.startMinutes <= window.endMinutes) {
      if (normalized >= window.startMinutes && normalized < window.endMinutes) {
        return window.phase;
      }
      continue;
    }

    if (normalized >= window.startMinutes || normalized < window.endMinutes) {
      return window.phase;
    }
  }

  return "day";
}

export function resolveSolarPhase(input: { hour: number; minute: number }) {
  return resolveSolarPhaseFromMinutes(input.hour * 60 + input.minute);
}
