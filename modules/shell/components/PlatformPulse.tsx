"use client";

import { useEffect, useState } from "react";
import {
  getPlatformPulseCopy,
  type LivingPlatformPulseState,
} from "../../../lib/time/platform-time";

type PlatformPulseProps = {
  checkedAtLabel?: string;
  executionMode?: "paper-only" | "live-blocked";
  feedState?: "fallback" | "ready" | "degraded" | "blocked";
  state?: LivingPlatformPulseState;
};

export default function PlatformPulse({
  checkedAtLabel = "local",
  executionMode = "paper-only",
  feedState = "fallback",
  state = "fallback",
}: PlatformPulseProps) {
  const [mountedAt, setMountedAt] = useState<string>("syncing");

  useEffect(() => {
    const updateMountedAt = () =>
      setMountedAt(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );
    const initial = window.setTimeout(updateMountedAt, 0);
    const interval = window.setInterval(updateMountedAt, 30_000);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="tpm-platform-pulse"
      data-pulse={state}
      aria-label="Platform pulse"
    >
      <span aria-hidden="true" />
      <div>
        <strong>{getPlatformPulseCopy(state)}</strong>
        <small>
          Feed {feedState}; execution {executionMode}
        </small>
      </div>
      <em>
        {checkedAtLabel} {mountedAt}
      </em>
    </div>
  );
}
