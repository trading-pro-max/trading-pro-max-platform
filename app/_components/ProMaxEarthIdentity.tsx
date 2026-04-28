import styles from "./ProMaxEarthIdentity.module.css";

type ProMaxEarthIdentityProps = {
  size?: "compact" | "command" | "hero";
  label?: string;
  showText?: boolean;
};

export function ProMaxEarthIdentity({
  size = "command",
  label = "Animated Pro Max Earth identity",
  showText = false,
}: ProMaxEarthIdentityProps) {
  return (
    <div
      className={`${styles.identity} ${styles[size]} tpm-pro-max-earth-identity`}
      data-promax-earth-identity="true"
      data-animated-earth-mark="true"
      data-swiss-inspired-precision="true"
      data-reduced-motion-supported="true"
      role="img"
      aria-label={label}
    >
      <div className={styles.orbitShell} aria-hidden="true">
        <span className={styles.orbitOne} />
        <span className={styles.orbitTwo} />
        <span className={styles.orbitThree} />
        <span className={styles.nodeA} />
        <span className={styles.nodeB} />
        <span className={styles.nodeC} />
        <span className={styles.earth}>
          <span className={styles.terminator} />
          <span className={styles.landA} />
          <span className={styles.landB} />
          <span className={styles.landC} />
          <span className={styles.meridianA} />
          <span className={styles.meridianB} />
          <span className={styles.atmosphere} />
        </span>
      </div>
      {showText ? (
        <div className={styles.copy}>
          <strong>Pro Max</strong>
          <span>Earth-scale intelligence</span>
        </div>
      ) : null}
    </div>
  );
}
