import { classifyAlKawnCommand } from "./command-classifier";
import { COMMAND_EXECUTION_REPORT_PATH } from "./command-intents";
import { getCommandEvidence } from "./command-evidence";
import type { AlKawnCommandExecutionReport } from "./types";

export function getCommandExecutionReport(
  commandText: string,
): AlKawnCommandExecutionReport {
  const classification = classifyAlKawnCommand(commandText);
  const canUseStaticReport =
    classification.verdict === "execute_internal_now" ||
    classification.verdict === "prepare_internal_report";

  return {
    id: "al_kawn_command_execution_report",
    title: "التقرير",
    commandText,
    verdict: classification.verdict,
    summary: canUseStaticReport
      ? "تم تنفيذ استجابة محلية حتمية داخلية أو إعداد تقرير داخلي آمن بدون أثر خارجي."
      : "لم يتم تنفيذ أي أثر خارجي أو مالي أو قانوني. توقف الحكم عند بوابة أحمد أو Product Truth.",
    evidence: getCommandEvidence(commandText),
    reportPath: COMMAND_EXECUTION_REPORT_PATH,
    wroteRuntimeFile: false,
    productTruth: "Product Truth يحكم كل تنفيذ.",
    localDayOne: "ready_not_started",
  };
}
