import type { AlKawnDesktopBootStep } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnBootSequence({ steps }: { steps: AlKawnDesktopBootStep[] }) {
  const completeCount = steps.filter((step) =>
    ["active", "checked", "protected"].includes(step.status)
  ).length;
  const gatedCount = steps.length - completeCount;

  return (
    <section className={styles.bootSequence} aria-label="Boot Details">
      <div className={styles.sectionTitle}>
        <span>Boot Details</span>
        <h2>Boot complete / with notes</h2>
        <p>
          Product Truth, local access, kernel, and private desktop context are loaded.
          Full technical boot details remain available below.
        </p>
      </div>
      <div className={styles.bootSummaryStrip}>
        <span>Boot sequence</span>
        <strong>Boot complete / with notes</strong>
        <span>Booting ط§ظ„ظƒظˆظ† private operating environment</span>
        <span>{completeCount} loaded</span>
        <span>{gatedCount} gated or pending</span>
        <span>Product Truth visible</span>
        <span>Technical details secondary</span>
      </div>
      <details className={styles.bootDisclosure}>
        <summary>Open full boot details</summary>
        <div className={styles.bootGrid}>
          {steps.map((step) => (
            <article key={step.id} data-status={step.status}>
              <span>{String(step.order).padStart(2, "0")}</span>
              <strong>{step.label}</strong>
              <small>{step.detail}</small>
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}
