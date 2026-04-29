"use client";

import { ProMaxLivingEarth } from "./ProMaxLivingEarth";
import styles from "./ProMaxCosmicIdentity.module.css";

type ProMaxCosmicIdentityProps = {
  size?: "small" | "medium" | "large" | "hero";
  surface?: "founder" | "trading" | "public";
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
};

const earthSizeByCosmicSize = {
  small: "small",
  medium: "medium",
  large: "large",
  hero: "hero",
} as const;

export function ProMaxCosmicIdentity({
  size = "medium",
  surface = "public",
  showLabels = true,
  compact = false,
  className = "",
}: ProMaxCosmicIdentityProps) {
  const publicSurface = surface === "public";

  return (
    <div
      className={[
        styles.identity,
        styles[size],
        styles[surface],
        compact ? styles.compact : "",
        className,
      ].join(" ")}
      data-testid="promax-cosmic-identity"
      data-canonical-earth-moon-identity="true"
      aria-label="Canonical Pro Max Earth and Moon identity"
    >
      <div className={styles.system} aria-hidden="true">
        {publicSurface ? (
          <span className={styles.publicEarth} data-public-safe-earth="true">
            <span className={styles.publicOcean} />
            <span className={styles.publicClouds} />
            <span className={styles.publicAtmosphere} />
          </span>
        ) : (
          <ProMaxLivingEarth
            size={earthSizeByCosmicSize[size]}
            surface={surface}
            intensity={size === "hero" ? "hero" : "standard"}
            label="Pro Max Earth realistic living planet identity"
          />
        )}
        <span className={styles.moonOrbit} data-testid="promax-orbiting-moon">
          <span className={styles.moon} />
        </span>
        <span className={styles.swissMark} data-testid="promax-swiss-red-mark" />
        <span className={styles.srOnly} data-testid="promax-realistic-earth-marker">
          realistic living Earth marker
        </span>
      </div>

      {showLabels ? (
        <div className={styles.labelRail}>
          <strong>Pro Max Earth is the product planet inside Universe</strong>
          <span>Moon orbiting Pro Max Earth</span>
          <span>Device-time reality active</span>
          <span>Swiss-inspired precision mark</span>
        </div>
      ) : (
        <span className={styles.srOnly} aria-label="Pro Max Earth, Moon orbit, and Swiss-inspired precision mark" />
      )}
    </div>
  );
}
