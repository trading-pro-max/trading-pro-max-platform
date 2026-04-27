import { draftAlkonCommandPassport } from "./command-passport-drafter";
import { getAlkonChatContext } from "./context";
import { interpretAlkonChatIntent } from "./intent-interpreter";
import { composeAlkonChatResponse } from "./response-composer";
import { guardAlkonChatRequest } from "./safety-guard";
import type { AlkonChatResponse } from "./types";

export function runAlkonChatMessage(
  message: string,
  checkedAt = new Date().toISOString()
): AlkonChatResponse {
  const intent = interpretAlkonChatIntent(message);
  const context = getAlkonChatContext(checkedAt);
  const safety = guardAlkonChatRequest(intent);
  const commandPassportDraft =
    safety.allowed && intent.type === "prepare_command_passport"
      ? draftAlkonCommandPassport(intent, context)
      : undefined;
  const composed = composeAlkonChatResponse({
    intent,
    context,
    safety,
    passport: commandPassportDraft,
  });

  return {
    checkedAt,
    intent,
    decision: composed.decision,
    safety,
    response: composed.response,
    sections: composed.sections,
    oneNextAction: context.oneNextAction,
    commandPassportDraft,
    memoryReference: context.memory,
    kernelReference: context.kernel,
    realityTrial: context.realityTrial,
    blockedActions: safety.blockedActions,
    context,
  };
}
