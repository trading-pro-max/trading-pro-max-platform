import "server-only";

import type { OperatorControlledNextAction, OperatorNextAction } from "./types";

export function getOperatorNextAction(): OperatorNextAction {
  return {
    next: "Operator Mode controlled activation",
    reason:
      "Operator preparation is ready: permissions, work queue, blocked actions, and reporting to Ahmad are defined from Daily Work Loop and Infinity.",
    blockedUntil: [
      "Operator controlled activation confirms safe internal work only.",
      "Legal and Money gates remain Ahmad gates.",
      "Product Truth blocks unsafe or false actions.",
    ],
  };
}

export function getOperatorControlledNextAction(): OperatorControlledNextAction {
  return {
    next: "Local Day One Readiness / Boot Gate",
    reason:
      "Operator controlled activation is closed for safe private internal work, so the next safe phase is the Local Day One Boot Gate.",
    blockedUntil: [
      "Local Day One checklist is visible.",
      "Ahmad final start decision is required.",
      "Public, money, broker, legal, and external actions remain blocked.",
    ],
  };
}
