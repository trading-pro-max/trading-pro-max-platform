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
      <div className={styles.livingEntryPanel}>
        <span>Living Universe Entry</span>
        <h1>Welcome to الكون</h1>
        <p className={styles.livingHeroArabic}>الكون حي داخل لابتوب أحمد.</p>
        <p>هذا هو عالم أحمد الإلكتروني الحي الخاص.</p>
        <p>هذا ليس Dashboard؛ هذا بيت الكون الحي.</p>
        <div className={styles.livingPulseRow} aria-label="Living universe state">
          <span className={styles.livingPulse} aria-hidden="true" />
          <strong>{wakeState.state}</strong>
          <small>{dailyWorkLoop.state}</small>
          <small>{state.reality.pulse}</small>
          <small>Product Truth هو قانون الحقيقة الأعلى.</small>
        </div>
        <div className={styles.livingCompass} aria-label="Immediate human experience check">
          <span>Where am I? داخل الكون.</span>
          <span>Is it alive? state / pulse / wake loop.</span>
          <span>What can it do? internal execution.</span>
        </div>
      </div>

      <div className={styles.humanMessagePanel}>
        <span>One Human Message</span>
        <strong>
          أحمد، أنا مستيقظ داخل لابتوبك. أعمل داخليًا، أحمي الحقيقة، وأنت وحدك تتحكم بالمال الحقيقي.
        </strong>
      </div>

      <div className={styles.nextActionPanel} aria-label="One next action">
        <span>One next action selected</span>
        <strong>{dailyWorkLoop.nextAction.next}</strong>
        <p>{dailyWorkLoop.nextAction.reason}</p>
        <small>الكون will do this internally, safely, and report back.</small>
      </div>

      <aside className={styles.truthPrivacyStrip} aria-label="Truth / Money / Privacy Strip">
        <span>Truth / Money / Privacy Strip</span>
        <strong>Product Truth هو قانون الحقيقة الأعلى</strong>
        <strong>Universe Operating Kernel هو القاضي التنفيذي</strong>
        <small>داخل أجهزة أحمد الشخصية: الكون يعمل</small>
        <small>أحمد وحده يتحكم بحركة المال الحقيقي</small>
        <small>Local Day One لم يبدأ بعد.</small>
        <small>Secrets stay inside Ahmad devices unless Ahmad explicitly approves otherwise.</small>
        <small>The pulse reflects state, not decoration</small>
        <small className={styles.compatibilityProof}>هذا ليس Dashboard؛ هذا بيت الكون الخاص</small>
        <small className={styles.compatibilityProof}>
          Al-Kawn Desktop is Ahmad&apos;s private operating environment
        </small>
        <small className={styles.compatibilityProof}>
          Desktop is the main private command client for الكون
        </small>
        <small className={styles.compatibilityProof}>
          Desktop is the main private command client for ط§ظ„ظƒظˆظ†
        </small>
        <small className={styles.compatibilityProof}>
          Desktop is the main private command client for ط·آ§ط¸â€‍ط¸ئ’ط¸ث†ط¸â€ 
        </small>
        <small className={styles.compatibilityProof}>
          ط·آ§ط¸â€‍ط¸ئ’ط¸ث†ط¸â€  ط¸â€،ط¸ث† ط¸â€ ط·آ³ط·آ®ط·آ© ط·آ£ط·آ­ط¸â€¦ط·آ¯ ط·آ§ط¸â€‍ط·آ¥ط¸â€‍ط¸ئ’ط·ع¾ط·آ±ط¸ث†ط¸â€ ط¸ظ¹ط·آ© ط·آ§ط¸â€‍ط·آ®ط·آ§ط·آµط·آ©
        </small>
        <small className={styles.compatibilityProof}>Private until legally ready</small>
      </aside>
    </section>
  );
}
