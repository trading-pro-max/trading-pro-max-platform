import type { AlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import type { AlKawnHumanSpokenInterfaceState } from "@/lib/server/universe/human-spoken-interface";
import type { AlKawnWakeState } from "@/lib/server/universe/wake-state";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnWakeStatePanel({
  wakeState,
  dailyWorkLoop,
  spokenInterface,
}: {
  wakeState: AlKawnWakeState;
  dailyWorkLoop: AlKawnDailyWorkLoop;
  spokenInterface: AlKawnHumanSpokenInterfaceState;
}) {
  return (
    <section
      className={styles.packagingGate}
      data-testid="al-kawn-wake-state-panel"
      aria-label="Al-Kawn Wake State + Human Interface"
    >
      <div className={styles.sectionTitle}>
        <span>Al-Kawn Wake State + Human Interface</span>
        <h2>Al-Kawn Wake State</h2>
        <p>{wakeState.summary}</p>
      </div>

      <div className={styles.truthChips} aria-label="Al-Kawn wake required wording">
        {wakeState.requiredWording.map((wording) => (
          <span key={wording}>{wording}</span>
        ))}
        {dailyWorkLoop.requiredWording.map((wording) => (
          <span key={wording}>{wording}</span>
        ))}
      </div>

      <div className={styles.packagingGrid}>
        <article className={styles.packagingCard}>
          <span>Spoken wake message</span>
          <strong>{spokenInterface.wakeMessage.text}</strong>
          <p>{spokenInterface.summary}</p>
          <small>{spokenInterface.title}</small>
          <small>{spokenInterface.audience}</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Daily briefing</span>
          <strong>{dailyWorkLoop.title}</strong>
          <ul>
            {spokenInterface.dailyBriefing.slice(0, 6).map((line) => (
              <li key={line.id}>{line.text}</li>
            ))}
          </ul>
        </article>
        <article className={styles.packagingCard}>
          <span>Local access and kernel</span>
          <strong>{wakeState.localAccessStatus}</strong>
          <small>{wakeState.productTruthStatus}</small>
          <small>{wakeState.kernelStatus}</small>
          <small>{wakeState.humanSpokenInterfaceState}</small>
          <small>{wakeState.dailyWorkLoopState}</small>
        </article>
        <article className={styles.packagingCard}>
          <span>One next action</span>
          <strong>{wakeState.oneNextAction.next}</strong>
          <p>{wakeState.oneNextAction.reason}</p>
          <small>One next action selected.</small>
        </article>
      </div>

      <div className={styles.controlDetail} aria-label="Daily Work Loop enhancement">
        <article>
          <span>Daily loop state</span>
          <strong>{dailyWorkLoop.progress.label}</strong>
          <p>الكون ينظم يومه الداخلي.</p>
          <p>{dailyWorkLoop.rule}</p>
          <small>{dailyWorkLoop.state}</small>
        </article>
        <div className={styles.actionColumns}>
          <article>
            <span>Selected safe internal work</span>
            <strong>{dailyWorkLoop.selectedWorkItem.title}</strong>
            <p>{dailyWorkLoop.selectedWorkItem.todayOutput}</p>
            <small>{dailyWorkLoop.selectedWorkItem.selectedReason}</small>
            <small>{dailyWorkLoop.selectedWorkItem.expectedOutput}</small>
          </article>
          <article>
            <span>Daily progress</span>
            <ul>
              {dailyWorkLoop.progress.completed.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
              {dailyWorkLoop.progress.active.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Priority engine</span>
            <ul>
              {dailyWorkLoop.priorities.slice(0, 5).map((priority) => (
                <li key={priority.id}>{priority.label}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Daily report links</span>
            <strong>{dailyWorkLoop.memorySnapshot.path}</strong>
            <small>reports/daily/al-kawn-daily-wake-report.md</small>
            <small>reports/daily/al-kawn-daily-work-loop.md</small>
            <small>reports/daily/al-kawn-daily-blockers.md</small>
            <small>{dailyWorkLoop.progress.reportStatus}</small>
          </article>
        </div>
      </div>

      <div className={styles.packagingGrid} aria-label="Al-Kawn wake sequence">
        {wakeState.sequence.map((step) => (
          <article key={step.id} className={styles.packagingCard}>
            <span>{step.status}</span>
            <strong>{step.label}</strong>
            <p>{step.details}</p>
            <small>{step.evidence.join(" / ")}</small>
          </article>
        ))}
      </div>

      <div className={styles.actionColumns} aria-label="Al-Kawn daily work loop">
        <article>
          <span>Daily safe work</span>
          <ul>
            {dailyWorkLoop.safeWorkItems.slice(0, 6).map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Daily blockers are visible.</span>
          <ul>
            {dailyWorkLoop.blockedItems.slice(0, 6).map((item) => (
              <li key={item.id}>{item.title}: {item.gate}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Boundaries checked</span>
          <ul>
            {wakeState.boundaries.map((boundary) => (
              <li key={boundary.id}>{boundary.wording}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Daily WAKE REPORT prepared.</span>
          <strong>{wakeState.dailyWakeReportPath}</strong>
          <small>{wakeState.readiness.status}</small>
        </article>
      </div>
    </section>
  );
}
