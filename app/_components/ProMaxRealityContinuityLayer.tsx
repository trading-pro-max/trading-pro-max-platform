"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  getEarthImmersionCssVariables,
  getUniverseMood,
  type UniverseMood,
} from "@/lib/client/living-universe";
import styles from "./ProMaxRealityContinuityLayer.module.css";

const DEFAULT_DEVICE_DATE = new Date("2026-04-28T12:00:00.000");

type ProMaxRealityContinuityLayerProps = {
  surface?: "founder" | "trading" | "public";
  className?: string;
};

function useDeviceMood(): UniverseMood {
  const [deviceDate, setDeviceDate] = useState<Date | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDeviceDate(new Date()), 0);
    const interval = window.setInterval(() => setDeviceDate(new Date()), 60000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  return useMemo(() => getUniverseMood(deviceDate ?? DEFAULT_DEVICE_DATE), [deviceDate]);
}

export function ProMaxRealityContinuityLayer({
  surface = "public",
  className = "",
}: ProMaxRealityContinuityLayerProps) {
  const mood = useDeviceMood();
  const environmentLabel =
    surface === "public"
      ? "Local device time controls the living Earth environment."
      : "Local device time controls the living Universe.";
  const style = useMemo(
    () => getEarthImmersionCssVariables(new Date(2026, mood.season.month - 1, 28, mood.time.hour, mood.time.minute)),
    [mood.season.month, mood.time.hour, mood.time.minute]
  ) as CSSProperties;

  return (
    <section
      className={[styles.layer, styles[surface], className].join(" ")}
      style={style}
      data-testid="promax-reality-continuity-layer"
      data-earth-immersion-phase={mood.time.phase}
      data-earth-immersion-season={mood.season.season}
      aria-label="Pro Max inside outside Earth reality continuity"
    >
      <div className={styles.content}>
        <div className={styles.copy}>
          <strong data-testid="promax-inside-outside-continuity">
            Inside and outside share the same device-time reality
          </strong>
          <span>Real when sourced. Simulated when labeled.</span>
          <span>{environmentLabel} Season is based on device date.</span>
        </div>
        <div className={styles.signals} aria-label="Reality continuity signals">
          <span data-testid="promax-device-time-reality">Local phase: {mood.time.label}</span>
          <span data-testid="promax-season-reality">Season: {mood.season.label}</span>
          <span>Weather not connected</span>
          <span>Reduced motion supported</span>
        </div>
      </div>
    </section>
  );
}
