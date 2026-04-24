import "server-only";

export type PlatformPulseState = "ready" | "degraded" | "blocked" | "fallback";

export type PlatformClockSnapshot = {
  checkedAt: string;
  mode: "swiss_precision_clock";
  utc: string;
  zurich: string;
  auditTimeBasis: "utc";
  pulse: PlatformPulseState;
  marketSession: "weekday_reference" | "weekend_reference";
  truth: {
    decorativeOnly: false;
    auditRemainsUtc: true;
    marketOpenClaim: false;
  };
};

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(date);
}

export function getPlatformClockSnapshot(
  checkedAt = new Date().toISOString(),
  pulse: PlatformPulseState = "fallback"
): PlatformClockSnapshot {
  const date = new Date(checkedAt);
  const utcDay = date.getUTCDay();

  return {
    checkedAt,
    mode: "swiss_precision_clock",
    utc: formatTime(date, "UTC"),
    zurich: formatTime(date, "Europe/Zurich"),
    auditTimeBasis: "utc",
    pulse,
    marketSession:
      utcDay === 0 || utcDay === 6 ? "weekend_reference" : "weekday_reference",
    truth: {
      decorativeOnly: false,
      auditRemainsUtc: true,
      marketOpenClaim: false,
    },
  };
}
