import type { AlKawnDesktopQuickAction } from "@/lib/server/universe/desktop-interface";
import { AlKawnCommandComposer } from "./AlKawnCommandComposer";
import { AlKawnQuickActions } from "./AlKawnQuickActions";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnHumanChat({
  welcomeMessage,
  quickActions,
}: {
  welcomeMessage: string;
  quickActions: AlKawnDesktopQuickAction[];
}) {
  return (
    <section className={styles.humanChat} aria-label="human chat">
      <div className={styles.sectionTitle}>
        <span>Center Human Chat</span>
        <h2>Human chat command area</h2>
      </div>
      <article className={styles.chatExchange}>
        <strong>Ahmad message area</strong>
        <small>Private command input stays local in this UI preview.</small>
      </article>
      <article className={styles.chatExchange}>
        <strong>الكون response area</strong>
        <p>{welcomeMessage}</p>
      </article>
      <AlKawnQuickActions actions={quickActions} />
      <AlKawnCommandComposer />
    </section>
  );
}
