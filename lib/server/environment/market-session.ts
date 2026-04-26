import type { MarketSession } from "./types";

export function resolveMarketSession(input: {
  timestamp?: string | number | Date;
  utcHour?: number;
  utcDayOfWeek?: number;
} = {}): MarketSession {
  const date = input.timestamp === undefined ? new Date() : new Date(input.timestamp);
  const utcHour = input.utcHour ?? (Number.isNaN(date.getTime()) ? 0 : date.getUTCHours());
  const day = input.utcDayOfWeek ?? (Number.isNaN(date.getTime()) ? 0 : date.getUTCDay());

  if (day === 0 || day === 6) return "weekend";
  if (utcHour >= 0 && utcHour < 7) return "asia";
  if (utcHour >= 7 && utcHour < 13) return "europe";
  if (utcHour >= 13 && utcHour < 21) return "us";
  if (utcHour >= 21 && utcHour <= 23) return "after_hours";

  return "closed";
}
