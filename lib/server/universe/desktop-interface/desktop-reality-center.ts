import "server-only";

import type { AlKawnDesktopRealityCenter } from "./types";

function getTimePhase(date: Date) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "sunset";
  if (hour >= 20 && hour < 23) return "night";
  return "deep_night";
}

function getSeason(date: Date) {
  const month = date.getMonth() + 1;

  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export function getAlKawnDesktopRealityCenter(date = new Date()): AlKawnDesktopRealityCenter {
  return {
    deviceTime: date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Zurich",
    }),
    deviceDate: date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Europe/Zurich",
    }),
    dayNightPhase: getTimePhase(date),
    season: getSeason(date),
    weather: "not connected",
    location: "not requested",
    soundscape: "off / user controlled",
    pulse: "Universe One pulse status: active as labeled device-time/device-date simulation.",
    sourceLabels: [
      "Real when sourced. Simulated when labeled.",
      "Device time is the active reality source.",
      "Device date is the active reality source.",
      "Weather is not connected.",
      "Location is not requested.",
    ],
  };
}
