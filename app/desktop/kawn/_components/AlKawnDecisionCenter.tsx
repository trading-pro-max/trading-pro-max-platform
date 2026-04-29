import type { AlKawnDesktopDecisionGroup } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnDecisionCenter({
  decisions,
}: {
  decisions: AlKawnDesktopDecisionGroup[];
}) {
  return (
    <section className={styles.panel} aria-label="decision center">
      <div className={styles.sectionTitle}>
        <span>Right Decision and Work Center</span>
        <h2>Decision center</h2>
      </div>
      {decisions.map((decision) => (
        <article key={decision.id}>
          <strong>{decision.label}</strong>
          <small>{decision.description}</small>
          <em>{decision.examples.join(" / ")}</em>
        </article>
      ))}
    </section>
  );
}
