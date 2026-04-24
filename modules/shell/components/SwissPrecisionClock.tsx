"use client";

import { useEffect, useMemo, useState } from "react";

type SwissPrecisionClockProps = {
  compact?: boolean;
  pulse?: "ready" | "degraded" | "blocked" | "fallback";
};

function formatTime(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(date);
}

function sessionLabel(date: Date) {
  const day = date.getUTCDay();
  if (day === 0 || day === 6) return "Weekend reference";
  return "Weekday reference";
}

export default function SwissPrecisionClock({
  compact = true,
  pulse = "fallback",
}: SwissPrecisionClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    const initial = window.setTimeout(updateClock, 0);
    const interval = window.setInterval(updateClock, 30_000);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  const values = useMemo(() => {
    if (!now) {
      return {
        local: "--:--",
        zurich: "--:--",
        utc: "--:--",
        session: "Syncing",
      };
    }

    return {
      local: formatTime(now),
      zurich: formatTime(now, "Europe/Zurich"),
      utc: formatTime(now, "UTC"),
      session: sessionLabel(now),
    };
  }, [now]);

  return (
    <div
      className={compact ? "tpm-precision-clock compact" : "tpm-precision-clock"}
      data-pulse={pulse}
      aria-label="Swiss precision platform clock"
    >
      <span className="tpm-precision-pulse" data-pulse={pulse} aria-hidden="true" />
      <div>
        <strong>{values.local}</strong>
        <small>
          Zurich {values.zurich} / UTC {values.utc}
        </small>
      </div>
      <em>{values.session}</em>
    </div>
  );
}
