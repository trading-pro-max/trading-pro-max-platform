import { ProMaxCosmicIdentity } from "@/app/_components/ProMaxCosmicIdentity";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnGalaxyMap() {
  return (
    <section className={styles.visualPane} aria-label="Universe Visual Pane">
      <ProMaxCosmicIdentity size="large" surface="founder" showLabels />
      <div>
        <span>Universe Visual Pane</span>
        <h2>Pro Max Galaxy inside الكون</h2>
        <p>Earth Planet is the first planet inside Pro Max Galaxy.</p>
        <p>Living universe identity, Earth/Moon identity, and Swiss-inspired precision remain source-labeled.</p>
        <p>Reduced-motion safe; visual identity supports Product Truth without becoming a public claim.</p>
      </div>
    </section>
  );
}
