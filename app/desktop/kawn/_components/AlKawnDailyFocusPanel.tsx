import type { AlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import type { AlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import type { LocalDayOneReadiness } from "@/lib/server/universe/local-day-one";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnDailyFocusPanel({
  state,
  dailyWorkLoop,
  localDayOne,
}: {
  state: AlKawnDesktopState;
  dailyWorkLoop: AlKawnDailyWorkLoop;
  localDayOne: LocalDayOneReadiness;
}) {
  return (
    <section className={styles.dailyFocus} aria-label="Al-Kawn daily focus">
      <div className={styles.sectionTitle}>
        <span>Daily focus</span>
        <h2>One next action stays above every queue.</h2>
        <p>/desktop/kawn هو بيت الكون الحي.</p>
        <p>الكون هو الأصل.</p>
      </div>
      <article className={styles.dailyFocusAction}>
        <span>One Next Action</span>
        <strong>{dailyWorkLoop.nextAction.next}</strong>
        <p>{dailyWorkLoop.nextAction.reason}</p>
        <small>الكون will continue internally with one safe work item.</small>
      </article>
      <div className={styles.dailyFocusStrip}>
        <span>Legal gate: Ahmad decision only</span>
        <span>Money gate: Ahmad decision only</span>
        <span>Product Truth enforced</span>
        <span>Local Day One لم يبدأ بعد.</span>
        <span>State: {localDayOne.status}</span>
        <span>Next safe action: {state.nextSafeAction}</span>
      </div>
    </section>
  );
}
