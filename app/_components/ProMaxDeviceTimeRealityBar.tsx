"use client";

import { useEffect, useMemo, useState } from "react";
import { getUniverseMood } from "@/lib/client/living-universe";
import styles from "./ProMaxDeviceTimeRealityBar.module.css";

const DEFAULT_DEVICE_DATE = new Date("2026-04-28T12:00:00.000");

type ProMaxDeviceTimeRealityBarProps = {
  variant?: "compact" | "full";
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ProMaxDeviceTimeRealityBar({
  variant = "full",
}: ProMaxDeviceTimeRealityBarProps) {
  const [deviceDate, setDeviceDate] = useState<Date | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDeviceDate(new Date()), 1200);
    const interval = window.setInterval(() => setDeviceDate(new Date()), 60000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  const date = deviceDate ?? DEFAULT_DEVICE_DATE;
  const mood = useMemo(() => getUniverseMood(date), [date]);

  return (
    <section
      className={`${styles.bar} ${styles[variant]}`}
      data-testid="promax-device-time-reality-bar"
      data-device-time-simulation="true"
      aria-label="Device-time reality"
    >
      <span>Device-time reality</span>
      <strong>Device time: {formatTime(date)}</strong>
      <span>Local phase: {mood.time.label}</span>
      <span>Device-date simulation only</span>
      <span>Season: {mood.season.label}</span>
      <span>Weather is not connected</span>
      <span>Assets: local/legal-safe/procedural</span>
      <span>Soundscape: user controlled</span>
      <span>Motion: normal/reduced-safe</span>
      <span>Product Truth</span>
    </section>
  );
}
