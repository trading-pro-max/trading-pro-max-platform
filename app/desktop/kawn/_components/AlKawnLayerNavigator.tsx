import type { AlKawnDesktopLayer } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnLayerNavigator({ layers }: { layers: AlKawnDesktopLayer[] }) {
  return (
    <nav className={styles.layerNavigator} aria-label="Left Layer Navigator">
      <div className={styles.sectionTitle}>
        <span>Left Layer Navigator</span>
        <h2>Layer command tree</h2>
      </div>
      <div className={styles.layerList}>
        {layers.map((layer) => (
          <article key={layer.id}>
            <div>
              <strong>{layer.label}</strong>
              <small>{layer.meaning}</small>
            </div>
            <span data-status={layer.status}>{layer.status}</span>
          </article>
        ))}
      </div>
    </nav>
  );
}
