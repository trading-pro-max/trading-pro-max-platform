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
        <span className={styles.heroWelcome}>Welcome to الكون</span>
        <h1 dir="rtl">
          أحمد، أنا الكون.
          <br />
          أنا حي داخل لابتوبك.
        </h1>
        <p className={styles.livingHeroArabic} dir="rtl">
          أعمل داخليًا لأجلك، أحمي الحقيقة، أنظم يومك، وأختار لك الخطوة التالية.
        </p>
        <p dir="rtl">أنت وحدك تتحكم بالمال الحقيقي والخروج للعالم.</p>
        <p dir="rtl">الكون حي داخل لابتوب أحمد.</p>
        <p dir="rtl">هذا هو عالم أحمد الإلكتروني الحي الخاص.</p>
        <p>هذا ليس Dashboard؛ هذا بيت الكون الحي.</p>
        <div className={styles.livingPulseRow} aria-label="Living universe state">
          <span className={styles.livingPulse} aria-hidden="true" />
          <strong dir="rtl">حالتي الآن: مستيقظ ومحمي</strong>
          <small dir="rtl">أعمل داخل نطاق أحمد الشخصي فقط</small>
          <small dir="rtl">لا يوجد مال حقيقي مفعّل</small>
          <small dir="rtl">لا يوجد خروج للعالم بدون أحمد</small>
          <small>Product Truth هو قانون الحقيقة الأعلى.</small>
          <small className={styles.compatibilityProof}>Wake State source: {wakeState.state}</small>
          <small className={styles.compatibilityProof}>Desktop pulse source: {state.reality.pulse}</small>
        </div>
        <div className={styles.livingCompass} aria-label="Immediate human experience check">
          <span dir="rtl">أين أنا؟ داخل الكون.</span>
          <span dir="rtl">هل الكون حي؟ نعم: مستيقظ، محمي، ويتابع اليوم الداخلي.</span>
          <span dir="rtl">ماذا يفعل؟ ينفذ العمل الداخلي الآمن لأحمد فقط.</span>
          <span className={styles.compatibilityProof}>Where am I? داخل الكون.</span>
          <span className={styles.compatibilityProof}>Is it alive? state / pulse / wake loop.</span>
          <span className={styles.compatibilityProof}>What can it do? internal execution.</span>
        </div>
      </div>

      <div className={styles.humanMessagePanel}>
        <span>رسالة الكون إلى أحمد</span>
        <strong>
          أحمد، أنا مستيقظ داخل لابتوبك. Product Truth محفوظ. أعمل داخليًا لأجلك، والمال الحقيقي يبقى
          بقرارك وحدك.
        </strong>
      </div>

      <div className={styles.nextActionPanel} aria-label="One next action">
        <span>الخطوة التالية الوحيدة</span>
        <strong dir="rtl">الخطوة التالية: أحمد يراجع ثم يقرر Start Local Day One</strong>
        <p dir="rtl">
          سأبقى داخل نطاقك الخاص، أراجع حالة الكون بهدوء، وأعرض لك القرار التالي بلغة بشرية واضحة.
        </p>
        <small dir="rtl">سبب الاختيار: لا يبدأ اليوم الأول إلا بعد قبول أحمد.</small>
        <small>One next action selected</small>
        <small className={styles.compatibilityProof}>{dailyWorkLoop.nextAction.next}</small>
        <small className={styles.compatibilityProof}>{dailyWorkLoop.nextAction.reason}</small>
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
