"use client";

import type { AlKawnCommandIntentExample } from "@/lib/server/universe/command-execution";
import styles from "../../al-kawn-desktop.module.css";

export function AlKawnCommandQuickActions({
  actions,
  onSelectCommand,
}: {
  actions: AlKawnCommandIntentExample[];
  onSelectCommand: (commandText: string) => void;
}) {
  return (
    <div className={styles.commandQuickActions} aria-label="Al-Kawn supported quick commands">
      {actions.map((action) => (
        <button
          key={`command-quick-action-${action.id}`}
          type="button"
          onClick={() => onSelectCommand(action.label)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
