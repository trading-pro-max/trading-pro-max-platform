import type { AlKawnCommandClassification } from "@/lib/server/universe/command-execution";
import styles from "../../al-kawn-desktop.module.css";

export function AlKawnCommandUnderstanding({
  classification,
}: {
  classification: AlKawnCommandClassification;
}) {
  return (
    <article className={styles.commandFlowCard}>
      <span>الكون فهم الطلب.</span>
      <strong>{classification.intentLabel}</strong>
      <small>{classification.reason}</small>
      <small>Layer: {classification.layer}</small>
    </article>
  );
}
