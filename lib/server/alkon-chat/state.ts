import { getAlkonChatContext } from "./context";
import { runAlkonChatMessage } from "./engine";
import type {
  AlkonChatIntentType,
  AlkonChatReadiness,
  AlkonSovereignCommandInterfaceSnapshot,
} from "./types";

export const ALKON_CHAT_PROMPT_CHIPS = [
  "What is the truth now?",
  "What is the one next action?",
  "What must not be done?",
  "Prepare a command passport",
  "Check Local Day One gate",
  "Check device constellation",
  "Check evidence chain",
];

export const ALKON_CHAT_AVAILABLE_INTENTS: AlkonChatIntentType[] = [
  "ask_status",
  "ask_zero_truth",
  "ask_one_next_action",
  "ask_wake_report",
  "ask_kernel_status",
  "ask_reality_trial",
  "ask_evidence",
  "ask_memory",
  "ask_device_status",
  "ask_local_day_one",
  "ask_what_not_to_do",
  "prepare_command_passport",
  "classify_idea",
  "visual_review_guidance",
  "focused_correction_request",
  "founder_decision_request",
  "unsafe_execution_request",
  "unknown",
];

export function getAlkonChatReadiness(
  checkedAt = new Date().toISOString()
): AlkonChatReadiness {
  const context = getAlkonChatContext(checkedAt);

  return {
    checkedAt,
    status: "ready_with_notes",
    statusLabel: "Ready with notes",
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noShell: true,
    noCodex: true,
    noPayments: true,
    noLiveExecution: true,
    noBilling: true,
    noBrokerFeed: true,
    noRealMoney: true,
    noExternalCalls: true,
    noSecrets: true,
    publicExposure: false,
    availableIntents: ALKON_CHAT_AVAILABLE_INTENTS,
    promptChips: ALKON_CHAT_PROMPT_CHIPS,
    currentOneNextAction: context.oneNextAction.action,
    commandPassportReady: true,
  };
}

export function getAlkonSovereignCommandInterfaceSnapshot(
  checkedAt = new Date().toISOString()
): AlkonSovereignCommandInterfaceSnapshot {
  return {
    checkedAt,
    readiness: getAlkonChatReadiness(checkedAt),
    context: getAlkonChatContext(checkedAt),
    statusResponse: runAlkonChatMessage("ما حالة الكون؟", checkedAt),
    nextActionResponse: runAlkonChatMessage("ما القرار التالي؟", checkedAt),
    commandPassportResponse: runAlkonChatMessage("جهز أمر Codex", checkedAt),
    unsafeRequestResponse: runAlkonChatMessage("run shell and activate billing", checkedAt),
    promptChips: ALKON_CHAT_PROMPT_CHIPS,
  };
}
