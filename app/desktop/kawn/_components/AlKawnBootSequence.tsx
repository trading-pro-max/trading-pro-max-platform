import type { AlKawnDesktopBootStep } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnBootSequence({ steps }: { steps: AlKawnDesktopBootStep[] }) {
  return (
    <section className={styles.bootSequence} aria-label="boot sequence">
      <div className={styles.sectionTitle}>
        <span>Boot sequence</span>
        <h2>Booting الكون private operating environment</h2>
      </div>
      <div className={styles.bootGrid}>
        {steps.map((step) => (
          <article key={step.id} data-status={step.status}>
            <span>{String(step.order).padStart(2, "0")}</span>
            <strong>{step.label}</strong>
            <small>{step.detail}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
