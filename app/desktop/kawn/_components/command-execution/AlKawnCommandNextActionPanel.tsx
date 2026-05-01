import styles from "../../al-kawn-desktop.module.css";

export function AlKawnCommandNextActionPanel({
  nextAction,
}: {
  nextAction: string;
}) {
  return (
    <article className={styles.commandFlowCard}>
      <span>الخطوة التالية الوحيدة</span>
      <strong>{nextAction}</strong>
      <small>الكون يتوقف بعد هذه النتيجة وينتظر Trigger آمنًا جديدًا.</small>
    </article>
  );
}
