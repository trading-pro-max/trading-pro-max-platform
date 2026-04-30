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
            {spokenInterface.dailyBriefing.slice(0, 5).map((line) => (
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
          <span>Blocked legal/money</span>
          <ul>
            {dailyWorkLoop.blockedItems.slice(0, 6).map((item) => (
              <li key={item.id}>{item.title}</li>
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
