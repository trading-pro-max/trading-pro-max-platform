import styles from "../al-kawn-desktop.module.css";

export function AlKawnCommandComposer() {
  return (
    <div className={styles.commandComposer} aria-label="command composer">
      <label htmlFor="al-kawn-command">Private command composer</label>
      <textarea
        id="al-kawn-command"
        readOnly
        value="أحمد، اكتب الأمر الخاص هنا لاحقًا. التنفيذ الحقيقي يبقى محكومًا بحدود Product Truth."
      />
      <div>
        <span>Safe command suggestions only</span>
        <span>Blocked command explanations visible</span>
      </div>
    </div>
  );
}
