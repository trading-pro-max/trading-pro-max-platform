import type { AlKawnCommandEvidence } from "@/lib/server/universe/command-execution";
import styles from "../../al-kawn-desktop.module.css";

export function AlKawnCommandEvidencePanel({
  evidence,
}: {
  evidence: AlKawnCommandEvidence[];
}) {
  return (
    <article className={styles.commandFlowCard}>
      <span>الدليل</span>
      <ul>
        {evidence.map((item) => (
          <li key={`command-evidence-${item.id}`}>
            <strong>{item.label}</strong>
            <small>{item.detail}</small>
          </li>
        ))}
      </ul>
    </article>
  );
}
