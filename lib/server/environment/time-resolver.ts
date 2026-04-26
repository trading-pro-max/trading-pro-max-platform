import type { EnvironmentPrivacySource } from "./types";

export type EnvironmentTimeResolution = {
  date: Date;
  hour: number;
  minute: number;
  dayOfWeek: number;
  utcHour: number;
  utcDayOfWeek: number;
  privacySource: EnvironmentPrivacySource;
  timezoneUsed: string | null;
};

function safeDate(timestamp?: string | number | Date) {
  if (timestamp instanceof Date) return Number.isNaN(timestamp.getTime()) ? new Date(0) : timestamp;
  if (timestamp === undefined) return new Date();

  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function getZonedParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Sun";
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);

  return {
    hour,
    minute,
    dayOfWeek: dayOfWeek >= 0 ? dayOfWeek : date.getUTCDay(),
  };
}

export function resolveEnvironmentTime(input: {
  timestamp?: string | number | Date;
  timezone?: string;
  locale?: string;
  country?: string;
  userSelectedRegion?: string;
  userSelectedCity?: string;
} = {}): EnvironmentTimeResolution {
  const date = safeDate(input.timestamp);
  const timezone = input.timezone?.trim();
  const utcHour = date.getUTCHours();
  const utcDayOfWeek = date.getUTCDay();

  if (timezone) {
    try {
      const zoned = getZonedParts(date, timezone);
      return {
        date,
        ...zoned,
        utcHour,
        utcDayOfWeek,
        privacySource: "timezone",
        timezoneUsed: timezone,
      };
    } catch {}
  }

  return {
    date,
    hour: utcHour,
    minute: date.getUTCMinutes(),
    dayOfWeek: utcDayOfWeek,
    utcHour,
    utcDayOfWeek,
    privacySource: input.userSelectedCity
      ? "user_selected_city"
      : input.userSelectedRegion
      ? "user_selected_region"
      : input.country
      ? "country"
      : input.locale
      ? "locale"
      : input.timestamp
      ? "browser_time"
      : "unavailable",
    timezoneUsed: null,
  };
}
