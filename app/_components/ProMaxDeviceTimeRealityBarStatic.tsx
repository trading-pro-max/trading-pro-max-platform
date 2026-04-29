import styles from "./ProMaxDeviceTimeRealityBar.module.css";

type ProMaxDeviceTimeRealityBarStaticProps = {
  variant?: "compact" | "full";
};

export function ProMaxDeviceTimeRealityBarStatic({
  variant = "full",
}: ProMaxDeviceTimeRealityBarStaticProps) {
  return (
    <section
      className={`${styles.bar} ${styles[variant]}`}
      data-testid="promax-device-time-reality-bar"
      data-device-time-simulation="true"
      aria-label="Device-time reality"
    >
      <span>Device-time reality</span>
      <strong>Device time: local device</strong>
      <span>Local phase: Device-time simulation only</span>
      <span>Device-date simulation only</span>
      <span>Season: Device-date simulation</span>
      <span>Weather is not connected</span>
      <span>Assets: local/legal-safe/procedural</span>
      <span>Soundscape: user controlled</span>
      <span>Motion: normal/reduced-safe</span>
      <span>Product Truth</span>
    </section>
  );
}
