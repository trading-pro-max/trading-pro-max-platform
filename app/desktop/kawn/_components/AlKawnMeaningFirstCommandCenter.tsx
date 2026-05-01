import styles from "../al-kawn-desktop.module.css";

const QUICK_ACTIONS = [
  "ماذا تستطيع أن تفعل؟",
  "رتب يومي",
  "افحص الكون",
  "نفذ دورة داخلية آمنة",
  "اعرض الخطوة التالية",
  "اشرح لي ما أراه",
] as const;

export function AlKawnMeaningFirstCommandCenter(): React.JSX.Element {
  return (
    <section
      className={styles.meaningCommandCenter}
      aria-label="Al-Kawn meaning-first command center"
    >
      <div className={styles.meaningCommandHeader}>
        <span>مركز الأمر</span>
        <h2>اكتب ما تريد من الكون الآن.</h2>
        <p>هذه واجهة توجيه محلية داخلية فقط الآن؛ لا ترسل أوامر خارج الجهاز ولا تلمس المال أو القانون.</p>
      </div>

      <label className={styles.meaningCommandPrompt}>
        <span>أمر أحمد للكون</span>
        <textarea
          aria-label="اكتب ما تريد من الكون الآن"
          placeholder="اكتب ما تريد من الكون الآن..."
          rows={3}
          readOnly
        />
      </label>

      <div className={styles.meaningResponsePreview} aria-label="Al-Kawn response preview">
        <span>رد الكون</span>
        <strong>أفهم طلبك، أحدد العمل الداخلي الآمن، ثم أكتب لك ما فعلت ولماذا.</strong>
        <small>حالة التنفيذ: عرض جاهز للتوجيه؛ لا يوجد تنفيذ خارجي أو مالي أو قانوني.</small>
      </div>

      <div className={styles.meaningQuickActions} aria-label="Al-Kawn quick actions">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={`meaning-action-${action}`}
            type="button"
            disabled
            title="واجهة توجيه فقط الآن؛ لا يوجد تنفيذ خارجي أو مالي أو قانوني."
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}
