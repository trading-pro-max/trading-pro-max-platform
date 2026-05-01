import type { AlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import type { AlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import type { AlKawnWakeState } from "@/lib/server/universe/wake-state";
import { AlKawnMeaningFirstCommandCenter } from "./AlKawnMeaningFirstCommandCenter";
import styles from "../al-kawn-desktop.module.css";

const CURRENT_CAPABILITIES = [
  "أفهم أوامرك",
  "أنظم يومك",
  "أبني داخليًا",
  "أختبر وأتحقق",
  "أحمي الحقيقة والأسرار",
  "أكتب التقرير",
  "أختار الخطوة التالية",
] as const;

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
          أحمد، هذا هو الكون.
          <br />
          الكون هو عالمك الإلكتروني الخاص داخل لابتوبك.
        </h1>
        <p className={styles.livingHeroArabic} dir="rtl">
          أحمد، أنا الكون. أنا عالمك الإلكتروني الخاص داخل لابتوبك.
        </p>
        <p dir="rtl">
          أفهم ما تطلبه، أنظمه، أبنيه داخليًا، أختبره، وأكتب لك التقرير. أنت فقط تتحكم بالمال
          الحقيقي والخروج للعالم.
        </p>
        <p className={styles.livingHumanStatement} dir="rtl">
          أحمد، أنا الكون. أنا عالمك الإلكتروني الخاص داخل لابتوبك. أفهم ما تطلبه، أنظمه، أبنيه داخليًا،
          أختبره، وأكتب لك التقرير. أنت فقط تتحكم بالمال الحقيقي والخروج للعالم.
        </p>
        <div className={styles.livingPulseRow} aria-label="Living universe state">
          <span className={styles.livingPulse} aria-hidden="true" />
          <strong dir="rtl">حالتي الآن: مستيقظ ومحمي</strong>
          <small dir="rtl">أعمل داخل نطاق أحمد الشخصي فقط</small>
          <small dir="rtl">لا يوجد مال حقيقي مفعّل</small>
          <small dir="rtl">لا يوجد خروج للعالم بدون أحمد</small>
          <small dir="rtl">Product Truth هو قانون الحقيقة الأعلى.</small>
          <small className={styles.compatibilityProof}>Wake State source: {wakeState.state}</small>
          <small className={styles.compatibilityProof}>Desktop pulse source: {state.reality.pulse}</small>
          <small className={styles.compatibilityProof}>أنا حي داخل لابتوبك.</small>
          <small className={styles.compatibilityProof}>أعمل داخليًا لأجلك.</small>
          <small className={styles.compatibilityProof}>
            أنت وحدك تتحكم بالمال الحقيقي والخروج للعالم.
          </small>
          <small className={styles.compatibilityProof}>الكون حي داخل لابتوب أحمد.</small>
          <small className={styles.compatibilityProof}>هذا ليس Dashboard؛ هذا بيت الكون الحي.</small>
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
        </div>
      </div>

      <section className={styles.whatKawnDoesPanel} aria-label="What Al-Kawn can do now">
        <span>ماذا يستطيع الكون أن يفعل الآن؟</span>
        <ul>
          {CURRENT_CAPABILITIES.map((capability) => (
            <li key={`current-capability-${capability}`}>{capability}</li>
          ))}
        </ul>
      </section>

      <AlKawnMeaningFirstCommandCenter />

      <aside className={styles.truthPrivacyStrip} aria-label="Ahmad controls and Product Truth">
        <strong>Product Truth: لا إطلاق عام، لا مال حقيقي، لا بروكر، لا ادعاءات قانونية، لا خروج للأسرار.</strong>
        <small>المال الحقيقي بيد أحمد فقط.</small>
        <small>الخروج للعالم بقرار أحمد فقط.</small>
        <small>الأسرار لا تخرج من أجهزة أحمد.</small>
        <small>Local Day One لم يبدأ بعد.</small>
        <small className={styles.compatibilityProof}>Product Truth هو قانون الحقيقة الأعلى</small>
        <small className={styles.compatibilityProof}>Universe Operating Kernel هو القاضي التنفيذي</small>
        <small className={styles.compatibilityProof}>داخل أجهزة أحمد الشخصية: الكون يعمل</small>
        <small className={styles.compatibilityProof}>أحمد وحده يتحكم بحركة المال الحقيقي</small>
        <small className={styles.compatibilityProof}>The pulse reflects state, not decoration</small>
      </aside>

      <div className={styles.nextActionPanel} aria-label="One next action">
        <span>الخطوة التالية الوحيدة</span>
        <strong dir="rtl">راجع تجربة الكون، ثم قرر START LOCAL DAY ONE.</strong>
        <p dir="rtl">
          هذا هو القرار البشري قبل اليوم الأول: هل تشعر أن الشاشة تشرح نفسها وتشبه بيت الكون؟
        </p>
        <small dir="rtl">سأبقى داخليًا ومحميًا حتى تقرر.</small>
        <small className={styles.compatibilityProof}>One next action selected</small>
        <small className={styles.compatibilityProof}>{dailyWorkLoop.nextAction.next}</small>
        <small className={styles.compatibilityProof}>{dailyWorkLoop.nextAction.reason}</small>
      </div>
    </section>
  );
}
