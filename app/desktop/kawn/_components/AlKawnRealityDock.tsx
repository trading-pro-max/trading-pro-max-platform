import type { AlKawnDesktopRealityCenter } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnRealityDock({ reality }: { reality: AlKawnDesktopRealityCenter }) {
  return (
    <footer className={styles.realityDock} aria-label="reality dock">
      <strong>Bottom Reality Dock</strong>
      <span>Device time {reality.deviceTime}</span>
      <span>Device date {reality.deviceDate}</span>
      <span>Day/night {reality.dayNightPhase}</span>
      <span>Season {reality.season}</span>
      <span>Weather is not connected.</span>
      <span>Location is not requested.</span>
      <span>Soundscape off/user controlled</span>
      <span>{reality.pulse}</span>
      {reality.sourceLabels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </footer>
  );
}
