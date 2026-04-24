export type LivingPlatformPulseState = "ready" | "degraded" | "blocked" | "fallback";

export function formatPlatformTime(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(date);
}

export function getReferenceSessionLabel(date: Date) {
  const day = date.getUTCDay();
  if (day === 0 || day === 6) return "Weekend reference";
  return "Weekday reference";
}

export function getPlatformPulseCopy(state: LivingPlatformPulseState) {
  if (state === "ready") return "Ready";
  if (state === "degraded") return "Degraded";
  if (state === "blocked") return "Blocked";
  return "Fallback";
}
