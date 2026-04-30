import type { AlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import type {
  AlKawnInfinityPreparation,
  InfinityControlledActivation,
} from "@/lib/server/universe/infinity";
import type { LocalDayOneReadiness } from "@/lib/server/universe/local-day-one";
import type {
  AlKawnOperatorPreparation,
  OperatorControlledActivation,
} from "@/lib/server/universe/operator";
import type { AlKawnWakeState } from "@/lib/server/universe/wake-state";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnLivingUniverseExperiencePanel({
  wakeState,
  dailyWorkLoop,
  infinityPreparation,
  infinityActivation,
  operatorPreparation,
  operatorActivation,
  localDayOne,
}: {
  wakeState: AlKawnWakeState;
  dailyWorkLoop: AlKawnDailyWorkLoop;
  infinityPreparation: AlKawnInfinityPreparation;
  infinityActivation: InfinityControlledActivation;
  operatorPreparation: AlKawnOperatorPreparation;
  operatorActivation: OperatorControlledActivation;
  localDayOne: LocalDayOneReadiness;
}) {
  return (
    <section
      className={styles.livingExperience}
      data-testid="al-kawn-living-universe-experience"
      aria-label="Living Universe Experience"
    >
      <div className={styles.sectionTitle}>
        <span>Living Universe Experience</span>
        <h2>الكون حي داخل لابتوب أحمد.</h2>
        <p>Every visible pulse and state marker exists to explain what الكون is doing now.</p>
      </div>

      <div className={styles.truthChips} aria-label="Living universe experience truth">
        <span>الكون حي داخل لابتوب أحمد.</span>
        <span>كل نبض يعكس حالة وليس زينة.</span>
        <span>The pulse reflects state, not decoration.</span>
        <span>Infinity and Operator are internal only.</span>
        <span>Local Day One is ready but not started.</span>
        <span>Swiss-inspired precision, not official Swiss endorsement.</span>
      </div>

      <div className={styles.livingExperienceGrid}>
        <article>
          <span>Living state</span>
          <strong>{wakeState.state}</strong>
          <small>{wakeState.summary}</small>
        </article>
        <article>
          <span>Active layer</span>
          <strong>Private Desktop Home</strong>
          <small>/desktop/kawn is the living entry for الكون.</small>
        </article>
        <article>
          <span>Pulse meaning</span>
          <strong>State-driven</strong>
          <small>كل نبض يعكس حالة وليس زينة.</small>
        </article>
        <article>
          <span>Current internal mode</span>
          <strong>{operatorActivation.status}</strong>
          <small>{operatorPreparation.status}</small>
        </article>
        <article>
          <span>Daily Work Loop</span>
          <strong>{dailyWorkLoop.progress.label}</strong>
          <small>{dailyWorkLoop.oneNextAction}</small>
        </article>
        <article>
          <span>Infinity</span>
          <strong>{infinityActivation.status}</strong>
          <small>{infinityPreparation.state}</small>
        </article>
        <article>
          <span>Operator</span>
          <strong>{operatorActivation.currentWork.title}</strong>
          <small>Operator Mode executes safe internal work only.</small>
        </article>
        <article>
          <span>Local Day One</span>
          <strong>{localDayOne.status}</strong>
          <small>Local Day One is ready but not started.</small>
        </article>
      </div>
    </section>
  );
}
