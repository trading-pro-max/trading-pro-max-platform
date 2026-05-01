import { classifyAlKawnCommand } from "./command-classifier";

export function getCommandExecutionNextAction(commandText: string): string {
  const classification = classifyAlKawnCommand(commandText);

  if (classification.verdict === "requires_ahmad_money_decision") {
    return "الخطوة التالية الوحيدة: أحمد يقرر أي مسار مالي قبل أي تنفيذ.";
  }

  if (classification.verdict === "requires_ahmad_legal_decision") {
    return "الخطوة التالية الوحيدة: أحمد يراجع القرار القانوني قبل أي إجراء رسمي.";
  }

  if (classification.verdict === "requires_ahmad_external_decision") {
    return "الخطوة التالية الوحيدة: أحمد يقرر إن كان الخروج للعالم مسموحًا.";
  }

  if (classification.verdict === "blocked_product_truth") {
    return "الخطوة التالية الوحيدة: تعديل الطلب حتى يوافق Product Truth.";
  }

  if (classification.verdict === "blocked_secret_exposure") {
    return "الخطوة التالية الوحيدة: إزالة أي طلب يكشف الأسرار أو ينقلها.";
  }

  if (classification.verdict === "needs_clarification") {
    return "الخطوة التالية الوحيدة: اكتب أمرًا أو اختر أمرًا سريعًا.";
  }

  if (classification.verdict === "unsupported_yet") {
    return "الخطوة التالية الوحيدة: اختر أمر MVP مدعوم أو اطلب تحويله إلى مهمة داخلية لاحقة.";
  }

  return "الخطوة التالية الوحيدة: راجع نتيجة التنفيذ الداخلي ثم اختر الأمر التالي.";
}
