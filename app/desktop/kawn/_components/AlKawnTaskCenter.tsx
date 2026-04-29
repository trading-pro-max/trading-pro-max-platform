import type { AlKawnDesktopTask } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnTaskCenter({ tasks }: { tasks: AlKawnDesktopTask[] }) {
  return (
    <section className={styles.panel} aria-label="task center">
      <div className={styles.sectionTitle}>
        <span>Task Center</span>
        <h2>Task center</h2>
      </div>
      {tasks.map((task) => (
        <article key={task.id}>
          <strong>{task.title}</strong>
          <small>{task.layer} / {task.category} / {task.priority}</small>
          <em>{task.nextStep}</em>
          <em>Decides: {task.whoDecides}</em>
          <em>{task.reason}</em>
        </article>
      ))}
    </section>
  );
}
