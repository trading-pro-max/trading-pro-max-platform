import type { AlKawnDesktopQuickAction } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnQuickActions({ actions }: { actions: AlKawnDesktopQuickAction[] }) {
  return (
    <div className={styles.quickActions} aria-label="quick actions">
      <strong>Quick actions</strong>
      <div>
        {actions.map((action) => (
          <span key={action.id} data-category={action.category} title={action.resultPreview}>
            {action.label}
          </span>
        ))}
      </div>
    </div>
  );
}
