"use client";

import type { FormEvent } from "react";
import styles from "../../al-kawn-desktop.module.css";

export function AlKawnCommandInput({
  commandText,
  onCommandTextChange,
  onSubmitCommand,
}: {
  commandText: string;
  onCommandTextChange: (commandText: string) => void;
  onSubmitCommand: (commandText: string) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitCommand(commandText);
  }

  return (
    <form className={styles.commandInput} onSubmit={handleSubmit}>
      <label>
        <span>أمر أحمد للكون</span>
        <textarea
          aria-label="اكتب أمرك للكون الآن."
          value={commandText}
          onChange={(event) => onCommandTextChange(event.currentTarget.value)}
          placeholder="اكتب أمرك للكون الآن..."
          rows={3}
        />
      </label>
      <button type="submit">نفذ الأمر الداخلي</button>
      <small>اكتب ما تريد من الكون الآن. التنفيذ هنا محلي داخلي فقط.</small>
    </form>
  );
}
