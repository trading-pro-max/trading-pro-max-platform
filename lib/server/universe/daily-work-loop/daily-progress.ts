import "server-only";

import type { DailyProgressState } from "./types";

export function getDailyProgressState(): DailyProgressState {
  return {
    state: "working_internal",
    label: "Safe internal work can continue.",
    completed: [
      "Reality check completed.",
      "Product Truth check completed for blocked public/money/broker/legal states.",
      "Kernel check completed.",
      "Desktop state check completed.",
    ],
    active: [
      "Today’s internal work is selected.",
      "Daily blockers are visible.",
      "Daily WAKE REPORT updated.",
    ],
    waiting: [
      "Legal remains Ahmad gate.",
      "Money remains Ahmad gate.",
      "Infinity Mode remains inactive.",
      "Operator Mode remains inactive.",
    ],
    blockersVisible: true,
    reportStatus: "Daily WAKE REPORT updated.",
  };
}
