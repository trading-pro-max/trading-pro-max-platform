"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { getUniverseAssetSet, getUniverseMood } from "@/lib/client/living-universe";
import styles from "./ProMaxLivingUniverseBackground.module.css";

const DEFAULT_DEVICE_DATE = new Date("2026-04-28T12:00:00.000");

type ProMaxLivingUniverseBackgroundProps = {
  surface?: "trading" | "founder";
  className?: string;
};

export function ProMaxLivingUniverseBackground({
  surface = "trading",
  className = "",
}: ProMaxLivingUniverseBackgroundProps) {
  const [deviceDate, setDeviceDate] = useState<Date | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDeviceDate(new Date()), 1200);
    const interval = window.setInterval(() => setDeviceDate(new Date()), 60000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  const mood = useMemo(() => getUniverseMood(deviceDate ?? DEFAULT_DEVICE_DATE), [deviceDate]);
  const assets = useMemo(
    () => getUniverseAssetSet(mood.time.phase, mood.season.season),
    [mood.time.phase, mood.season.season]
  );
  const style = {
    "--pmx-star-field": `url("${assets.starField}")`,
    "--pmx-grid": `url("${assets.swissPrecisionGrid}")`,
    "--pmx-phase-overlay": `url("${assets.phaseOverlay}")`,
    "--pmx-season-overlay": `url("${assets.seasonOverlay}")`,
    "--pmx-star-visibility": mood.starVisibility.toString(),
    "--pmx-atmosphere-strength": mood.atmosphereStrength.toString(),
  } as CSSProperties;

  return (
    <div
      className={[styles.background, styles[surface], className].join(" ")}
      style={style}
      data-testid="promax-living-universe-background"
      data-living-universe-background="true"
      data-time-phase={mood.time.phase}
      data-season={mood.season.season}
      aria-hidden="true"
    >
      <span className={styles.stars} />
      <span className={styles.phase} />
      <span className={styles.season} />
      <span className={styles.grid} />
      <span className={styles.orbits} />
      <span className={styles.horizon} />
    </div>
  );
}
