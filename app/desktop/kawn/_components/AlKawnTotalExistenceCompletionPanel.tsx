import type { AutomaticEngineState } from "@/lib/server/universe/automatic-engine";
import type { AlKawnTotalExistenceSystem } from "@/lib/server/universe/total-existence";
import type { ElectronicCapability } from "@/lib/server/universe/electronic-capabilities";
import type { ExecutableGlossaryTerm } from "@/lib/server/universe/executable-glossary";
import type { LivingEntity } from "@/lib/server/universe/living-ontology";
import type { RightsLedgerEntry } from "@/lib/server/universe/rights-ownership";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnTotalExistenceCompletionPanel({
  totalExistence,
  capabilities,
  glossaryTerms,
  rightsEntries,
  livingEntities,
  automaticEngine,
}: {
  totalExistence: AlKawnTotalExistenceSystem;
  capabilities: ElectronicCapability[];
  glossaryTerms: ExecutableGlossaryTerm[];
  rightsEntries: RightsLedgerEntry[];
  livingEntities: LivingEntity[];
  automaticEngine: AutomaticEngineState;
}) {
  return (
    <section
      className={`${styles.packagingGate} al-kawn-state-pulse`}
      data-testid="al-kawn-total-existence-completion-panel"
      aria-label="Al-Kawn A-Z Total Existence Completion"
    >
      <div className={styles.sectionTitle}>
        <span>Al-Kawn A-Z Total Existence Completion</span>
        <h2>Total Existence System</h2>
        <p>{totalExistence.definition}</p>
        <p>الكون هو كون إلكتروني كامل خاص داخل لابتوب أحمد.</p>
        <p>الكون ليس Dashboard عادي.</p>
        <p>الكون لا يدّعي التحكم بالكون الفيزيائي.</p>
      </div>

      <div className={styles.truthChips} aria-label="Al-Kawn total existence laws">
        {totalExistence.globalWording.map((wording) => (
          <span key={wording}>{wording}</span>
        ))}
      </div>

      <div className={styles.packagingGrid}>
        <article className={styles.packagingCard}>
          <span>Total Existence System</span>
          <strong>{totalExistence.status}</strong>
          <p>كل شيء داخل الكون يجب أن يعرف لماذا يوجد.</p>
          <small>Every route, component, report, doc, test, and capability belongs to an owner layer.</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Swiss Luxury Living Style</span>
          <strong>living_private_precision</strong>
          <p>الكون بفخامة سويسرية تليق باسمه.</p>
          <small>Swiss-inspired precision, not official Swiss endorsement.</small>
          <small>Product Truth remains visible above visual beauty.</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Living visual pulse</span>
          <strong>stateful_motion_only</strong>
          <p>الكون حي داخل لابتوب أحمد.</p>
          <small>كل تفصيل داخل الكون له معنى.</small>
          <small>كل نبض يعكس حالة وليس زينة.</small>
          <small>The pulse reflects state, not decoration.</small>
        </article>
        <article className={styles.packagingCard}>
          <span>Automatic Internal Engine</span>
          <strong>{automaticEngine.status}</strong>
          <p>الكون يعمل تلقائيًا داخل نطاقه الخاص.</p>
          <small>No uncontrolled infinite loop.</small>
          <small>Safe trigger required for every cycle.</small>
          <small>One automatic work item per cycle.</small>
        </article>
      </div>

      <div className={styles.controlDetail}>
        <article>
          <span>Layer ownership</span>
          <strong>{totalExistence.layerTree.length} clear owner layers</strong>
          <p>كل شيء داخل الكون يجب أن ينتمي إلى طبقة واضحة.</p>
          <p>كل شيء حقيقي له مصدر، وكل محاكاة موسومة.</p>
          <p>كل شيء داخل الكون يمكن تفسيره من ∞ إلى 0.</p>
        </article>
        <div className={styles.actionColumns}>
          {totalExistence.layerTree.slice(0, 8).map((layer) => (
            <article key={layer.id}>
              <span>{layer.arabicLabel}</span>
              <strong>{layer.label}</strong>
              <p>{layer.purpose}</p>
              <small>{layer.status}</small>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.actionColumns}>
        <article>
          <span>Capability Matrix</span>
          <strong>{capabilities.length} capabilities</strong>
          <p>Inside الكون: direct internal execution.</p>
          <small>Legal and Money gates stop execution for Ahmad.</small>
          {capabilities.slice(0, 8).map((capability) => (
            <small key={capability.id}>{capability.title}: {capability.status}</small>
          ))}
        </article>
        <article>
          <span>Executable Glossary</span>
          <strong>{glossaryTerms.length} executable terms</strong>
          <p>كل مصطلح داخل الكون يجب أن يكون قابلًا للتنفيذ.</p>
          <p>داخل الكون: المصطلح يتحول إلى قدرة.</p>
          {glossaryTerms.slice(0, 7).map((term) => (
            <small key={term.id}>{term.term}: {term.executableCapability}</small>
          ))}
        </article>
        <article>
          <span>Rights & Ownership</span>
          <strong>{rightsEntries.length} evidence entries</strong>
          <p>Every entity inside الكون must have ownership and source evidence.</p>
          <small>Unknown-source items are blocked from public use.</small>
          <small>No global ownership claim is allowed.</small>
          <small>Trademark/legal review is required before public brand adoption.</small>
          <small>Product Truth overrides ownership claims.</small>
        </article>
        <article>
          <span>Living Ontology Core</span>
          <strong>{livingEntities.length} living entities</strong>
          <p>الكون هو كيان إلكتروني حي داخل لابتوب أحمد.</p>
          <small>كل طبقة داخل الكون لها وجود ومعنى وحالة وقدرة.</small>
          <small>كل شيء داخل الكون يمكن تفسيره من ∞ إلى 0.</small>
        </article>
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Truth law</span>
          <small>Product Truth هو قانون الحقيقة الأعلى.</small>
          <small>Universe Operating Kernel هو القاضي التنفيذي.</small>
          <small>داخل الكون: التنفيذ مباشر.</small>
          <small>عند القانون: يتوقف لأحمد.</small>
          <small>عند المال: يتوقف لأحمد.</small>
        </article>
        <article>
          <span>Infinity / Operator</span>
          <small>Infinity Mode is private internal continuous readiness.</small>
          <small>Infinity Mode is active only for private internal cycles.</small>
          <small>الكون يعمل عن أحمد داخليًا.</small>
          <small>Operator Mode executes safe internal work only.</small>
        </article>
        <article>
          <span>Local Day One</span>
          <small>Local Day One Boot Gate</small>
          <small>Local Day One is ready but not started.</small>
          <small>Ahmad must start Local Day One.</small>
          <small>{totalExistence.nextAction}</small>
        </article>
      </div>
    </section>
  );
}
