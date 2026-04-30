import type {
  InfinityControlledActivation,
  AlKawnInfinityPreparation,
} from "@/lib/server/universe/infinity";
import type { LocalDayOneReadiness } from "@/lib/server/universe/local-day-one";
import type {
  AlKawnOperatorPreparation,
  OperatorControlledActivation,
} from "@/lib/server/universe/operator";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnInternalOperatingSequencePanel({
  infinityPreparation,
  infinityActivation,
  operatorPreparation,
  operatorActivation,
  localDayOne,
}: {
  infinityPreparation: AlKawnInfinityPreparation;
  infinityActivation: InfinityControlledActivation;
  operatorPreparation: AlKawnOperatorPreparation;
  operatorActivation: OperatorControlledActivation;
  localDayOne: LocalDayOneReadiness;
}) {
  return (
    <section
      className={styles.packagingGate}
      data-testid="al-kawn-internal-operating-sequence-panel"
      aria-label="Final Al-Kawn Internal Operating Sequence"
    >
      <div className={styles.sectionTitle}>
        <span>Final Al-Kawn Internal Operating Sequence</span>
        <h2>Current internal operating status</h2>
        <p>
          Infinity Mode, Operator Mode, and Local Day One readiness are private
          internal phases only. Product Truth, Legal, Money, security, and public
          boundaries remain enforced.
        </p>
      </div>

      <div className={styles.truthChips}>
        <span>Infinity Mode preparation</span>
        <span>Infinity Mode controlled activation</span>
        <span>Operator Mode preparation</span>
        <span>Operator Mode controlled activation</span>
        <span>Local Day One Boot Gate</span>
        <span>Product Truth is enforced.</span>
      </div>

      <div className={styles.packagingGrid}>
        <article className={styles.packagingCard}>
          <span>Infinity Mode</span>
          <strong>{infinityPreparation.state}</strong>
          <p>Infinity Mode is private internal continuous readiness.</p>
          <small>Infinity Mode is not fully active yet.</small>
          <small>Daily Work Loop feeds Infinity preparation.</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Infinity controlled</span>
          <strong>{infinityActivation.status}</strong>
          <p>Infinity Mode is active only for private internal cycles.</p>
          <small>No uncontrolled infinite loop.</small>
          <small>No background daemon.</small>
          <small>Safe internal cycles only.</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Operator preparation</span>
          <strong>{operatorPreparation.status}</strong>
          <p>Operator Mode prepares الكون to work for Ahmad internally.</p>
          <small>Operator Mode is not fully active yet.</small>
          <small>Infinity feeds Operator preparation.</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Operator controlled</span>
          <strong>{operatorActivation.status}</strong>
          <p>الكون يعمل عن أحمد داخليًا.</p>
          <small>Operator Mode executes safe internal work only.</small>
          <small>Product Truth blocks unsafe or false actions.</small>
        </article>
      </div>

      <div className={styles.controlDetail}>
        <article>
          <span>Local Day One readiness</span>
          <strong>{localDayOne.status}</strong>
          <p>Local Day One is ready but not started.</p>
          <p>Ahmad must start Local Day One.</p>
          <small>Infinity and Operator are ready for private internal operation.</small>
          <small>Legal and Money gates remain Ahmad gates.</small>
        </article>
        <div className={styles.actionColumns}>
          <article>
            <span>Infinity cycle</span>
            <ul>
              {infinityActivation.cycleState.cycleStages.slice(0, 5).map((stage) => (
                <li key={stage.id}>{stage.title}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Operator current work</span>
            <strong>{operatorActivation.currentWork.title}</strong>
            <p>{operatorActivation.currentWork.output}</p>
            <small>{operatorActivation.humanMessage}</small>
          </article>
          <article>
            <span>Local Day One checklist</span>
            <ul>
              {localDayOne.checklist.slice(0, 6).map((item) => (
                <li key={item.id}>{item.label}: {item.status}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>One next action</span>
            <strong>{localDayOne.nextAction.next}</strong>
            <p>{localDayOne.nextAction.reason}</p>
          </article>
        </div>
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Legal and Money gates</span>
          <small>Legal and Money gates stop execution for Ahmad.</small>
          <small>Legal and Money gates remain Ahmad gates.</small>
        </article>
        <article>
          <span>Blocked actions</span>
          {localDayOne.blockedActions.map((item) => (
            <small key={item.id}>{item.title}: {item.reason}</small>
          ))}
        </article>
        <article>
          <span>Product Truth boundary</span>
          <small>No public, money, broker, legal, or external actions.</small>
          <small>Product Truth controls every cycle.</small>
          <small>Product Truth overrides operator actions.</small>
        </article>
      </div>
    </section>
  );
}
