import type { AlKawnDesktopProtectionState } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnProtectionPanel({
  protection,
}: {
  protection: AlKawnDesktopProtectionState;
}) {
  return (
    <section className={styles.panel} aria-label="protection panel">
      <div className={styles.sectionTitle}>
        <span>Protection Core</span>
        <h2>Protection panel</h2>
      </div>
      <strong>Status: {protection.status}</strong>
      <ul>
        {protection.rules.map((rule, index) => (
          <li key={`protection-rule-${index}-${rule}`}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}
