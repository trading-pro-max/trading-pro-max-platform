import type { AlKawnCommandClassification } from "@/lib/server/universe/command-execution";
import styles from "../../al-kawn-desktop.module.css";

const VERDICT_LABELS: Record<AlKawnCommandClassification["verdict"], string> = {
  execute_internal_now: "تنفيذ داخلي مباشر",
  prepare_internal_report: "تنفيذ داخلي مباشر",
  requires_ahmad_money_decision: "يتطلب قرار أحمد",
  requires_ahmad_external_decision: "يتطلب قرار أحمد",
  requires_ahmad_legal_decision: "يتطلب قرار أحمد",
  blocked_product_truth: "محجوب بسبب Product Truth",
  blocked_secret_exposure: "محجوب بسبب كشف الأسرار",
  needs_clarification: "يحتاج توضيح",
  unsupported_yet: "غير مدعوم بعد",
};

export function AlKawnCommandVerdictPanel({
  classification,
}: {
  classification: AlKawnCommandClassification;
}) {
  return (
    <article className={styles.commandFlowCard}>
      <span>حكم التنفيذ</span>
      <strong>{VERDICT_LABELS[classification.verdict]}</strong>
      <small>Risk: {classification.risk}</small>
      <div className={styles.commandVerdictLegend} aria-label="Command verdict legend">
        <em>تنفيذ داخلي مباشر</em>
        <em>يتطلب قرار أحمد</em>
        <em>محجوب بسبب Product Truth</em>
      </div>
    </article>
  );
}
