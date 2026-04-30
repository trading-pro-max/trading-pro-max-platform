import type {
  AlKawnInfinityPreparation,
  InfinityAutomationItem,
} from "@/lib/server/universe/infinity";
import styles from "../al-kawn-desktop.module.css";

function AutomationList({
  title,
  items,
}: {
  title: string;
  items: InfinityAutomationItem[];
}) {
  return (
    <article>
      <span>{title}</span>
      <ul>
        {items.slice(0, 7).map((item) => (
          <li key={item.id}>
            {item.title}: {item.productTruthImpact}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function AlKawnInfinityPreparationPanel({
  preparation,
}: {
  preparation: AlKawnInfinityPreparation;
}) {
  return (
    <section
      className={styles.packagingGate}
      data-testid="al-kawn-infinity-preparation-panel"
      aria-label="Infinity Mode Preparation"
    >
      <div className={styles.sectionTitle}>
        <span>Infinity Mode Preparation</span>
        <h2>Infinity Mode preparation</h2>
        <p>{preparation.summary}</p>
      </div>

      <div className={styles.truthChips} aria-label="Infinity preparation truth">
        {preparation.requiredWording.map((wording) => (
          <span key={wording}>{wording}</span>
        ))}
      </div>

      <div className={styles.packagingGrid}>
        {preparation.readiness.map((check) => (
          <article key={check.id} className={styles.packagingCard}>
            <span>{check.state}</span>
            <strong>{check.label}</strong>
            <p>{check.status}</p>
            {check.evidence.slice(0, 4).map((evidence) => (
              <small key={evidence}>{evidence}</small>
            ))}
          </article>
        ))}
      </div>

      <div className={styles.controlDetail}>
        <article>
          <span>Cycle plan</span>
          <strong>{preparation.state}</strong>
          <p>Infinity cycle waits for safe trigger.</p>
          <p>{preparation.kernelStatus}</p>
          <small>Infinity Mode is not fully active yet.</small>
        </article>
        <div className={styles.actionColumns}>
          {preparation.cyclePlan.slice(0, 4).map((stage) => (
            <article key={stage.id}>
              <span>Stage {stage.order}</span>
              <strong>{stage.title}</strong>
              <p>{stage.action}</p>
              <small>{stage.safetyRule}</small>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.actionColumns}>
        <AutomationList
          title="Safe internal automation"
          items={preparation.safeAutomation}
        />
        <AutomationList
          title="Blocked automation scope"
          items={preparation.blockedActions}
        />
        <article>
          <span>Daily Work Loop connection</span>
          <ul>
            {preparation.dailyLoopConnection.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Next safe action</span>
          <strong>{preparation.nextAction.next}</strong>
          <p>{preparation.nextAction.reason}</p>
          <small>One next action remains enforced.</small>
        </article>
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Product Truth status</span>
          {preparation.productTruth.map((item) => (
            <small key={item}>{item}</small>
          ))}
        </article>
        <article>
          <span>Boundaries</span>
          {preparation.boundaries.map((boundary) => (
            <small key={boundary.id}>{boundary.wording}</small>
          ))}
        </article>
        <article>
          <span>Blocked until</span>
          {preparation.nextAction.blockedUntil.map((item) => (
            <small key={item}>{item}</small>
          ))}
        </article>
      </div>
    </section>
  );
}
