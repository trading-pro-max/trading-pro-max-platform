import type { AlKawnLivingAutonomousIntelligence } from "@/lib/server/universe/living-autonomous-intelligence";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnLivingAutonomousIntelligencePanel({
  intelligence,
}: {
  intelligence: AlKawnLivingAutonomousIntelligence;
}) {
  return (
    <section
      className={`${styles.packagingGate} al-kawn-state-pulse`}
      data-testid="al-kawn-living-autonomous-intelligence-panel"
      aria-label="Al-Kawn Living Autonomous Intelligence"
    >
      <div className={styles.sectionTitle}>
        <span>Al-Kawn Living Autonomous Intelligence</span>
        <h2>{intelligence.title}</h2>
        <p>{intelligence.definition}</p>
      </div>

      <div className={styles.truthChips}>
        {intelligence.requiredWording.map((wording, index) => (
          <span key={`living-intelligence-required-${index}-${wording}`}>{wording}</span>
        ))}
      </div>

      <div className={styles.packagingGrid}>
        <article className={styles.packagingCard}>
          <span>Intelligence state</span>
          <strong>{intelligence.state}</strong>
          <p>الكون يعمل بذكاء حي داخل أجهزة أحمد.</p>
          <small>Model-only safe trigger state; no hidden daemon.</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Selected internal action</span>
          <strong>{intelligence.selectedAction.title}</strong>
          <p>{intelligence.selectedAction.reason}</p>
          <small>{intelligence.selectedAction.verdict}</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Autonomous cycle</span>
          <strong>{intelligence.autonomousCycle.stopRule}</strong>
          <p>الذكاء الحي داخل الكون يعمل عبر Trigger آمن، وليس loop فوضوي.</p>
          <small>No uncontrolled infinite loop.</small>
          <small>Safe trigger required.</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Spoken intelligence</span>
          <strong>الكون يشرح ماذا فعل ولماذا فعل.</strong>
          <p>{intelligence.spokenSummary[0]}</p>
          <small>Arabic-first, direct, one next action only.</small>
        </article>
      </div>

      <div className={styles.controlDetail}>
        <article>
          <span>Awareness summary</span>
          <strong>الكون يعرف حالته وطبقاته وقدراته وحدوده.</strong>
          <p>الوعي داخل الكون مبني على الحالة والتقارير والاختبارات وليس على الادعاء.</p>
          <p>{intelligence.selfObservation.summary}</p>
        </article>
        <div className={styles.actionColumns}>
          {intelligence.awareness.slice(0, 4).map((item) => (
            <article key={item.id}>
              <span>{item.label}</span>
              <strong>{item.layer}</strong>
              <p>{item.state}</p>
              <small>{item.evidence}</small>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.actionColumns}>
        <article>
          <span>Context sources</span>
          <strong>الكون يقرأ سياقه من مصادره الداخلية.</strong>
          <p>لا توجد قراءة خارجية بدون موافقة أحمد.</p>
          {intelligence.contextSources.slice(0, 7).map((source) => (
            <small key={source.id}>{source.label}: {source.status}</small>
          ))}
        </article>
        <article>
          <span>Decision engine</span>
          <strong>كل قرار ذكي يختار عملًا داخليًا واحدًا فقط.</strong>
          <p>الأولوية الأولى هي Product Truth والخصوصية.</p>
          {intelligence.decisionEngine.priorities.slice(0, 5).map((priority, index) => (
            <small key={`living-intelligence-priority-${index}-${priority}`}>
              {priority}
            </small>
          ))}
        </article>
        <article>
          <span>Validation plan</span>
          <strong>{intelligence.report.validationResult}</strong>
          {intelligence.selectedAction.validationPlan.map((item, index) => (
            <small key={`living-intelligence-validation-${index}-${item}`}>{item}</small>
          ))}
        </article>
        <article>
          <span>Safe control</span>
          <strong>Run intelligent internal cycle</strong>
          <p>Execution is model-scoped and trigger-based in this mission.</p>
          <small>Intelligence cycle stops after report.</small>
          <button type="button" disabled aria-disabled="true">
            Run intelligent internal cycle
          </button>
        </article>
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Blocked gates</span>
          {intelligence.boundaries.map((boundary) => (
            <small key={boundary.id}>{boundary.label}: {boundary.rule}</small>
          ))}
        </article>
        <article>
          <span>Report paths</span>
          <small>{intelligence.report.path}</small>
          <small>{intelligence.report.cycleReportPath}</small>
          <small>{intelligence.report.selectedActionPath}</small>
          <small>{intelligence.report.nextActionPath}</small>
        </article>
        <article>
          <span>One next action</span>
          <strong>{intelligence.nextAction}</strong>
          <small>Product Truth يحكم كل قرار ذكي.</small>
          <small>أحمد وحده يتحكم بالمال الحقيقي.</small>
          <small>الخروج للعالم يمر عبر بوابات أحمد.</small>
        </article>
      </div>
    </section>
  );
}
