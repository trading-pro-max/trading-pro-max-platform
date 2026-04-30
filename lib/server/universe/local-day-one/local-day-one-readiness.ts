import "server-only";

import { getLocalDayOneBlockedActions } from "./local-day-one-blocked-actions";
import { getLocalDayOneBootGate } from "./local-day-one-boot-gate";
import { getLocalDayOneChecklist } from "./local-day-one-checklist";
import { getLocalDayOneNextAction } from "./local-day-one-next-action";
import type { LocalDayOneReadiness } from "./types";

export function getLocalDayOneReadiness(): LocalDayOneReadiness {
  const bootGate = getLocalDayOneBootGate();

  return {
    id: "local_day_one_readiness",
    title: "Local Day One Boot Gate",
    status: bootGate.status,
    summary:
      "Local Day One is ready but not started. Ahmad must start Local Day One after reviewing the private desktop operating state.",
    requiredWording: [
      "Local Day One Boot Gate",
      "Local Day One is ready but not started.",
      "Ahmad must start Local Day One.",
      "Infinity and Operator are ready for private internal operation.",
      "Legal and Money gates remain Ahmad gates.",
      "Product Truth is enforced.",
    ],
    checklist: getLocalDayOneChecklist(),
    blockedActions: getLocalDayOneBlockedActions(),
    bootGate,
    nextAction: getLocalDayOneNextAction(),
  };
}
