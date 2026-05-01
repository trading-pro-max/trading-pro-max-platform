import { classifyAlKawnCommand } from "./command-classifier";
import { COMMAND_EXECUTION_REPORT_PATH } from "./command-intents";
import { getCommandEvidence } from "./command-evidence";
import { getCommandExecutionNextAction } from "./command-next-action";
import type { AlKawnCommandExecutionResult } from "./types";

function getSafeResponseLines(
  intentId: ReturnType<typeof classifyAlKawnCommand>["intentId"],
): string[] {
  switch (intentId) {
    case "capability_summary":
      return [
        "أفهم أوامر أحمد.",
        "أصنف الطلب قبل التنفيذ.",
        "أنفذ داخليًا عندما يكون الأمر آمنًا.",
        "أكتب تقريرًا أو ملخصًا داخليًا.",
        "أحمي Product Truth والأسرار.",
        "أجهز المال أو الخارج لأحمد فقط، ولا أنفذهما وحدي.",
      ];
    case "explain_current_screen":
      return [
        "هذا بيت الكون الشخصي داخل لابتوب أحمد.",
        "اكتب أمرك للكون الآن.",
        "الكون يصنف الطلب ثم يعرض حكم التنفيذ.",
        "المال الحقيقي والخروج للعالم بيد أحمد فقط.",
        "التفاصيل التقنية محفوظة أسفل التجربة الأولى.",
      ];
    case "internal_health_check":
      return [
        "Product Truth محمل ويحكم التنفيذ.",
        "Local Day One جاهز لكنه لم يبدأ بعد.",
        "Infinity و Operator داخليان ومسيطر عليهما فقط.",
        "النطاق شخصي داخل أجهزة أحمد.",
        "الخطوة التالية الوحيدة تبقى مراجعة أحمد للتجربة.",
      ];
    case "organize_daily_work":
      return [
        "الخطوة الحالية: مراجعة تجربة الأمر داخل /desktop/kawn.",
        "الخطوة التالية: اختيار أمر داخلي واحد.",
        "الاقتراح: افحص الكون ثم اعرض الخطوة التالية.",
        "التجنب: لا مال، لا بروكر، لا قانون، لا خروج للعالم.",
      ];
    case "safe_internal_cycle":
      return [
        "قرأ الكون الحالة الحالية محليًا.",
        "اختار عملًا داخليًا واحدًا: تلخيص حالة التنفيذ الآمن.",
        "تحقق من Product Truth والمال والقانون والخروج للعالم.",
        "جهز دليلًا وتقريرًا محليًا ثابتًا.",
        "توقف بعد التقرير وينتظر Trigger آمنًا جديدًا.",
      ];
    case "show_next_action":
      return ["الخطوة التالية الوحيدة: أحمد يراجع /desktop/kawn ثم يقرر قبول التجربة قبل Local Day One."];
    case "show_product_truth":
      return [
        "Product Truth يحكم كل تنفيذ.",
        "لا إطلاق عام.",
        "لا مال حقيقي.",
        "لا بروكر.",
        "لا ادعاءات قانونية.",
        "لا خروج للأسرار.",
      ];
    case "show_local_day_one":
      return [
        "Local Day One لم يبدأ بعد.",
        "الحالة الحالية: ready_not_started.",
        "Ahmad وحده يبدأ Local Day One.",
      ];
    default:
      return ["الكون فهم الطلب، لكنه توقف لأن التنفيذ غير آمن أو غير مدعوم في هذا MVP."];
  }
}

function getExecutionMode(
  verdict: ReturnType<typeof classifyAlKawnCommand>["verdict"],
): AlKawnCommandExecutionResult["executionMode"] {
  if (verdict === "execute_internal_now" || verdict === "prepare_internal_report") {
    return "local_deterministic";
  }

  if (
    verdict === "requires_ahmad_money_decision" ||
    verdict === "requires_ahmad_external_decision" ||
    verdict === "requires_ahmad_legal_decision"
  ) {
    return "stopped_for_ahmad";
  }

  if (verdict === "unsupported_yet" || verdict === "needs_clarification") {
    return "not_supported";
  }

  return "blocked";
}

export function executeSafeInternalCommand(
  commandText: string,
): AlKawnCommandExecutionResult {
  const classification = classifyAlKawnCommand(commandText);
  const executed =
    classification.verdict === "execute_internal_now" ||
    classification.verdict === "prepare_internal_report";

  return {
    commandText,
    classification,
    executed,
    executionMode: getExecutionMode(classification.verdict),
    title: executed ? "تنفيذ داخلي مباشر" : "يتطلب قرار أحمد أو محجوب",
    responseLines: getSafeResponseLines(classification.intentId),
    evidence: getCommandEvidence(commandText),
    reportPath: COMMAND_EXECUTION_REPORT_PATH,
    reportWriteStatus: executed ? "static_report_available" : "not_written",
    nextAction: getCommandExecutionNextAction(commandText),
  };
}
