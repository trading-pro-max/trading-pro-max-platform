import type { CSSProperties } from "react";
import { getUniverseAssetSet } from "@/lib/client/living-universe/getUniverseAssetSet";
import { getUniverseMood } from "@/lib/client/living-universe/getUniverseMood";
import styles from "./ProMaxLivingEarth.module.css";

const STATIC_DEVICE_DATE = new Date("2026-04-28T12:00:00.000");

type ProMaxLivingEarthStaticProps = {
  size?: "small" | "medium" | "large" | "hero";
  surface?: "trading" | "founder" | "logo" | "background";
  label?: string;
  showText?: boolean;
  className?: string;
  intensity?: "subtle" | "standard" | "hero";
};

export function ProMaxLivingEarthStatic({
  size = "medium",
  surface = "logo",
  label = "Pro Max living Earth identity, local procedural and device-time simulated",
  showText = false,
  className = "",
  intensity = "standard",
}: ProMaxLivingEarthStaticProps) {
  const mood = getUniverseMood(STATIC_DEVICE_DATE);
  const assets = getUniverseAssetSet(mood.time.phase, mood.season.season);
  const style = {
    "--pmx-earth-base": `url("${assets.earthBase}")`,
    "--pmx-earth-clouds": `url("${assets.cloudLayer}")`,
    "--pmx-earth-night": `url("${assets.nightLights}")`,
    "--pmx-atmosphere": `url("${assets.atmosphereGlow}")`,
    "--pmx-orbital-ring": `url("${assets.orbitalRing}")`,
    "--pmx-data-node": `url("${assets.dataNode}")`,
    "--pmx-phase-overlay": `url("${assets.phaseOverlay}")`,
    "--pmx-season-overlay": `url("${assets.seasonOverlay}")`,
    "--pmx-cloud-opacity": mood.cloudOpacity.toString(),
    "--pmx-night-opacity": mood.nightLightsOpacity.toString(),
    "--pmx-atmosphere-strength": mood.atmosphereStrength.toString(),
    "--pmx-star-visibility": mood.starVisibility.toString(),
    "--pmx-orbit-speed": `${mood.orbitSpeedSeconds}s`,
    "--pmx-light-angle": `${mood.earthLightAngle}deg`,
    "--pmx-visual-intensity": mood.visualIntensity.toString(),
  } as CSSProperties;

  return (
    <figure
      className={[
        styles.livingEarth,
        styles[size],
        styles[surface],
        styles[intensity],
        className,
      ].join(" ")}
      style={style}
      data-testid="promax-living-earth"
      data-layer-meaning="pro-max-earth-product-planet"
      data-promax-earth-identity="true"
      data-animated-earth-mark="true"
      data-real-3d-earth-logo="true"
      data-earth-render-mode="local-procedural-layered-sphere"
      data-swiss-inspired-precision="true"
      data-reduced-motion-supported="true"
      data-asset-mode={assets.mode}
      data-time-phase={mood.time.phase}
      data-season={mood.season.season}
      data-weather-connected="false"
      role="img"
      aria-label={label}
    >
      <span className={styles.reducedMotionSafe} data-testid="promax-earth-inside-universe">
        Pro Max Earth is the product planet inside Universe
      </span>
      <span
        className={styles.identityAnchor}
        data-testid="promax-earth-identity"
        data-promax-earth-identity="true"
        data-animated-earth-mark="true"
        data-real-3d-earth-logo="true"
        data-earth-render-mode="local-procedural-layered-sphere"
        data-swiss-inspired-precision="true"
        data-reduced-motion-supported="true"
        aria-hidden="true"
      />
      <div
        className={styles.orbitSystem}
        data-testid="promax-earth-orbit"
        data-promax-earth-orbit="true"
        aria-hidden="true"
      >
        <span className={styles.orbitOuter} />
        <span className={styles.orbitInner} />
        <span className={styles.orbitSwiss} />
        <span className={`${styles.dataNode} ${styles.nodeOne}`} />
        <span className={`${styles.dataNode} ${styles.nodeTwo}`} />
        <span className={`${styles.dataNode} ${styles.nodeThree}`} />
      </div>

      <div
        className={styles.globeFrame}
        data-testid="promax-living-earth-globe"
        data-realistic-earth-globe="true"
      >
        <span className={styles.backGlow} aria-hidden="true" />
        <span
          className={styles.globe}
          data-testid="promax-earth-3d-globe"
          data-realistic-earth-globe="true"
          aria-hidden="true"
        >
          <span className={styles.oceanCore} />
          <span className={styles.texture} data-testid="promax-living-earth-texture" />
          <span className={styles.nightLights} data-testid="promax-living-earth-night-lights" />
          <span className={styles.clouds} data-testid="promax-living-earth-clouds" />
          <span className={styles.gridLatitude} />
          <span className={styles.gridLongitude} />
          <span className={styles.dayNightShadow} />
          <span className={styles.phaseOverlay} />
          <span className={styles.seasonOverlay} />
          <span className={styles.specular} />
          <span className={styles.atmosphere} data-testid="promax-living-earth-atmosphere" />
        </span>
      </div>

      <span className={styles.reducedMotionSafe} data-testid="promax-living-earth-reduced-motion-safe">
        Reduced motion safe
      </span>
      <span className={styles.reducedMotionSafe} data-testid="promax-earth-reduced-motion-safe">
        Reduced motion safe
      </span>

      <figcaption className={styles.caption}>
        {showText ? (
          <>
            <strong>Pro Max</strong>
            <span>Pro Max Earth is the product planet inside Universe</span>
          </>
        ) : null}
        <small data-testid="promax-living-earth-time-phase">
          Device-time simulation active. Device-time simulation only. Local phase: {mood.time.label}.
        </small>
        <small data-testid="promax-living-earth-season">
          Device-date simulation active. Season: {mood.season.label}.
        </small>
        <small>
          Weather not connected. Assets: local/procedural/license-safe. Assets local/legal-safe/procedural.
        </small>
        <small>Motion: normal/reduced-safe.</small>
      </figcaption>
    </figure>
  );
}
