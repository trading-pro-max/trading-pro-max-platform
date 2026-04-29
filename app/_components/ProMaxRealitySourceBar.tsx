import { getRealitySources } from "@/lib/client/living-universe";
import styles from "./ProMaxRealitySourceBar.module.css";

type ProMaxRealitySourceBarProps = {
  variant?: "full" | "compact";
};

export function ProMaxRealitySourceBar({ variant = "full" }: ProMaxRealitySourceBarProps) {
  const sources = getRealitySources();

  return (
    <section
      className={`${styles.bar} ${styles[variant]}`}
      data-testid="promax-reality-source-bar"
      aria-label="Reality Source Bar"
    >
      <strong>Reality mode: literal software realism</strong>
      <span>Real when sourced. Simulated when labeled.</span>
      <span data-testid="promax-device-time-source">{sources.deviceTime.visibleLabel}</span>
      <span>{sources.deviceDate.visibleLabel}</span>
      <span>Day/Night: device-time simulation</span>
      <span data-testid="promax-season-source">{sources.season.visibleLabel}</span>
      <span data-testid="promax-weather-not-connected">{sources.weather.visibleLabel}</span>
      <span>{sources.location.visibleLabel}</span>
      <span data-testid="promax-assets-legal-safe">{sources.earthAssets.visibleLabel}</span>
      <span>{sources.soundscape.visibleLabel}</span>
      <span>{sources.trading.visibleLabel}</span>
      <span>{sources.legal.visibleLabel}</span>
    </section>
  );
}
