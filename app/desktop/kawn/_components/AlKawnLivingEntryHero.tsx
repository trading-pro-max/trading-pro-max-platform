import type { AlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import type { AlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import type { AlKawnWakeState } from "@/lib/server/universe/wake-state";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnLivingEntryHero({
  state,
  wakeState,
  dailyWorkLoop,
}: {
  state: AlKawnDesktopState;
  wakeState: AlKawnWakeState;
  dailyWorkLoop: AlKawnDailyWorkLoop;
}) {
  return (
    <section
      className={styles.livingHero}
      data-testid="al-kawn-living-entry-hero"
      aria-label="Al-Kawn living private entry"
    >
      <div className={styles.livingHeroMain}>
        <span>Private entry / Ahmad electronic universe</span>
        <h1>Welcome to الكون.</h1>
        <p className={styles.livingHeroArabic}>الكون حي داخل لابتوب أحمد.</p>
        <p>هذا ليس Dashboard؛ هذا بيت الكون الخاص.</p>
        <p>Inside /desktop/kawn, Ahmad enters the private living operating home of الكون.</p>
        <div className={styles.livingPulseRow} aria-label="Living universe state">
          <span className={styles.livingPulse} aria-hidden="true" />
          <strong>{wakeState.state}</strong>
          <small>{dailyWorkLoop.state}</small>
          <small>{state.reality.pulse}</small>
        </div>
      </div>

      <aside className={styles.livingHeroTruth} aria-label="Al-Kawn entry truth">
        <span>Truth loaded</span>
        <strong>Product Truth هو قانون الحقيقة الأعلى.</strong>
        <strong>Universe Operating Kernel هو القاضي التنفيذي.</strong>
        <small>داخل أجهزة أحمد الشخصية: الكون يعمل.</small>
        <small>أحمد وحده يتحكم بحركة المال الحقيقي.</small>
        <small>Product Truth overrides every action.</small>
      </aside>

      <div className={styles.spokenEntryMessage}>
        <span>Human spoken message</span>
        <strong>
          أحمد، أنا مستيقظ داخل لابتوبك. Product Truth محفوظ. الخطوة التالية الوحيدة هي {dailyWorkLoop.nextAction.next}
        </strong>
      </div>

      <div className={styles.legacyEntryProof} aria-label="Preserved desktop truth wording">
        <span>Al-Kawn Desktop Operating Environment</span>
        <span>Al-Kawn Desktop is Ahmad&apos;s private operating environment</span>
        <span>ط§ظ„ظƒظˆظ† ظ‡ظˆ ظ†ط³ط®ط© ط£ط­ظ…ط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹط© ط§ظ„ط®ط§طµط©</span>
        <span>Desktop is the main private command client for الكون</span>
        <span>Desktop is the main private command client for ط§ظ„ظƒظˆظ†</span>
        <span>Private until legally ready</span>
      </div>

      <div className={styles.nextActionPanel} aria-label="One next action">
        <span>One next action selected.</span>
        <strong>{dailyWorkLoop.nextAction.next}</strong>
        <p>{dailyWorkLoop.nextAction.reason}</p>
      </div>

      <div className={styles.experienceAnswers} aria-label="Al-Kawn first screen answers">
        <article>
          <span>Where am I?</span>
          <strong>داخل الكون</strong>
        </article>
        <article>
          <span>Is it alive?</span>
          <strong>نعم، state/pulse/daily loop</strong>
        </article>
        <article>
          <span>What is true?</span>
          <strong>Product Truth loaded</strong>
        </article>
        <article>
          <span>What can it do?</span>
          <strong>Safe internal operation</strong>
        </article>
        <article>
          <span>What needs Ahmad?</span>
          <strong>Money / legal / external gates</strong>
        </article>
        <article>
          <span>What is next?</span>
          <strong>One next action</strong>
        </article>
      </div>
    </section>
  );
}
