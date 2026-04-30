import "server-only";

import type { OperatorCycle, OperatorWorkItem } from "./types";
import { getOperatorWorkQueue } from "./operator-work-queue";

export function getOperatorCycle(): OperatorCycle {
  return {
    id: "operator_cycle",
    status: "closed_operator_internal_active",
    stages: [
      "Read Daily Work Loop.",
      "Read Infinity controlled cycle state.",
      "Read Product Truth.",
      "Check Universe Operating Kernel verdict.",
      "Execute safe internal work only.",
      "Stop at Legal.",
      "Stop at Money.",
      "Block Product Truth violations.",
      "Report to Ahmad.",
      "Prepare one next action.",
    ],
    stopRules: [
      "Legal and Money gates stop execution for Ahmad.",
      "Product Truth blocks unsafe or false actions.",
      "No public, money, broker, legal, or external actions.",
    ],
  };
}

export function getOperatorCurrentWork(): OperatorWorkItem {
  const work = getOperatorWorkQueue().find((item) => item.id === "daily_selected_work");

  if (!work) {
    throw new Error("Operator current work item is missing.");
  }

  return work;
}
