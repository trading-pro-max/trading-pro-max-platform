"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPlatformTime, getReferenceSessionLabel } from "../../../lib/time/platform-time";

type SwissPrecisionClockProps = {
  compact?: boolean;
  pulse?: "ready" | "degraded" | "blocked" | "fallback";
};

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
      local: formatPlatformTime(now),
      zurich: formatPlatformTime(now, "Europe/Zurich"),
      utc: formatPlatformTime(now, "UTC"),
      session: getReferenceSessionLabel(now),
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
        <strong>
          <time>{values.local}</time>
        </strong>
        <small>
          Zurich {values.zurich} / UTC {values.utc}
        </small>
      </div>
      <em>{values.session}</em>
    </div>
  );
}
