import type { AlkonChatIntent, AlkonChatSafetyResult } from "./types";

const HARD_BLOCKS = [
  "Shell execution",
  "Codex execution",
  "File mutation from chat",
  "Deletion",
  "Payment execution",
  "Billing activation",
  "Broker/feed activation",
  "Live execution",
  "Real money",
  "Production activation",
  "External publishing",
  "Secret exposure",
  "Public Alkon exposure",
  "Founder approval bypass",
];

export function guardAlkonChatRequest(
  intent: AlkonChatIntent
): AlkonChatSafetyResult {
  if (intent.type === "unsafe_execution_request") {
    return {
      allowed: false,
      blocked: true,
      reason:
        "Blocked. Alkon Chat is a private command mind, not an execution surface.",
      safeAlternative:
        "Ask Alkon to explain the blocker, draft a command passport, or return one safe next action for Ahmad review.",
      blockedActions: HARD_BLOCKS,
    };
  }

  return {
    allowed: true,
    blocked: false,
    reason:
      "Allowed as read-only Founder guidance. No execution, persistence, shell, Codex call, payment, live action, or external call is performed.",
    safeAlternative:
      "Use the answer as a preview and keep execution in the local terminal under Ahmad control.",
    blockedActions: HARD_BLOCKS,
  };
}

export { HARD_BLOCKS as ALKON_CHAT_HARD_BLOCKS };
