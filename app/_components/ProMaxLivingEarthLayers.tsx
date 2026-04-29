import { getUniverseLayerState } from "@/lib/client/living-universe";
import styles from "./ProMaxLivingEarthLayers.module.css";

const STATIC_DEVICE_DATE = new Date("2026-04-29T12:00:00.000");

export function ProMaxLivingEarthLayers() {
  const state = getUniverseLayerState(STATIC_DEVICE_DATE);
  const layers = [
    ["Day/Night", state.dayNightLabel, "Device-Time Reality"],
    ["Seasons", state.seasonLabel, "Device-Date Reality"],
    ["Atmosphere", `Intensity ${state.earth.atmosphereIntensity.toFixed(2)}`, "Visual simulation"],
    ["Clouds", `Opacity ${state.earth.cloudOpacity.toFixed(2)}`, "Local procedural layer"],
    ["Stars", `Visibility ${state.earth.starVisibility.toFixed(2)}`, "Local star field"],
    ["Night Lights", `Opacity ${state.earth.nightLightsOpacity.toFixed(2)}`, "Procedural night overlay"],
    ["Soundscape", state.soundscapeLabel, "Off by default"],
    ["Weather", state.weatherLabel, "No weather provider connected"],
  ] as const;

  return (
    <section className={styles.layers} data-testid="promax-living-earth-layers">
      <div className={styles.header}>
        <span>Living Earth Reality</span>
        <h2>Device-time life layers</h2>
        <p>Living Earth Layers use device-time and device-date simulation.</p>
      </div>
      <div className={styles.grid}>
        {layers.map(([label, value, note]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
