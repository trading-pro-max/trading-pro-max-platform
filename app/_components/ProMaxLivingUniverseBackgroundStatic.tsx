import type { CSSProperties } from "react";
import { getUniverseAssetSet } from "@/lib/client/living-universe/getUniverseAssetSet";
import { getUniverseMood } from "@/lib/client/living-universe/getUniverseMood";
import styles from "./ProMaxLivingUniverseBackground.module.css";

const STATIC_DEVICE_DATE = new Date("2026-04-28T12:00:00.000");

type ProMaxLivingUniverseBackgroundStaticProps = {
  surface?: "trading" | "founder";
  className?: string;
};

export function ProMaxLivingUniverseBackgroundStatic({
  surface = "trading",
  className = "",
}: ProMaxLivingUniverseBackgroundStaticProps) {
  const mood = getUniverseMood(STATIC_DEVICE_DATE);
  const assets = getUniverseAssetSet(mood.time.phase, mood.season.season);
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
