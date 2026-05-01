import { COMMAND_EXECUTION_REPORT_PATH, getCommandIntentExamples } from "./command-intents";
import type { AlKawnCommandExecutionState } from "./types";

export * from "./types";
export { classifyAlKawnCommand } from "./command-classifier";
export {
  COMMAND_EXECUTION_REPORT_PATH,
  getCommandIntentExamples,
} from "./command-intents";
export { getCommandExecutionVerdict } from "./command-verdict";
export { executeSafeInternalCommand } from "./command-executor";
export { getCommandEvidence } from "./command-evidence";
export { getCommandExecutionReport } from "./command-report";
export { getCommandExecutionNextAction } from "./command-next-action";

export function getAlKawnCommandExecutionState(): AlKawnCommandExecutionState {
  const supportedCommands = getCommandIntentExamples();

  return {
    id: "al_kawn_command_first_real_execution_mvp",
    status: "active_internal_mvp",
    supportedCommandCount: supportedCommands.length,
    supportedCommands,
    visibleTruth: [
      "اكتب أمرك للكون الآن.",
      "الكون فهم الطلب.",
      "حكم التنفيذ",
      "تنفيذ داخلي مباشر",
      "يتطلب قرار أحمد",
      "محجوب بسبب Product Truth",
      "الدليل",
      "التقرير",
      "الخطوة التالية الوحيدة",
      "Product Truth يحكم كل تنفيذ.",
      "المال الحقيقي بيد أحمد فقط.",
      "Local Day One لم يبدأ بعد.",
    ],
    reportPath: COMMAND_EXECUTION_REPORT_PATH,
    nextAction: "Final Experience Acceptance Gate",
  };
}
