import "server-only";

import { getOperatorControlledActivation } from "@/lib/server/universe/operator";
import type { LocalDayOneReadiness } from "./types";

export function getLocalDayOneBootGate(): LocalDayOneReadiness["bootGate"] {
  const operator = getOperatorControlledActivation();

  return {
    status:
      operator.status === "closed_operator_internal_active"
        ? "ready_not_started"
        : "blocked_prerequisite_missing",
    finalDecision: "Ahmad final start decision required",
    notStarted: true,
  };
}
