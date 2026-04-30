import "server-only";

import { getDailyBlockedItems } from "./daily-blockers";
import { getDailyWorkChecklist } from "./daily-checklist";
import { getDailySafeWorkItems } from "./daily-safe-work";
import { getDailySelectedWorkItem } from "./daily-work-selection";
import type { DailyWorkReport } from "./types";

export function getDailyWorkReport(): DailyWorkReport {
  return {
    title: "Al-Kawn Daily Work Loop Enhancement",
    path: "reports/daily/al-kawn-daily-work-loop.md",
    summary:
      "Daily Work Loop enhancement deepens what الكون sees, what it can execute internally, what is blocked, what needs Ahmad, and which one next action is selected.",
    checked: getDailyWorkChecklist().map((item) => item.title),
    safeInternalWork: getDailySafeWorkItems().map((item) => item.title),
    blockedWork: getDailyBlockedItems().map((item) => item.title),
    selectedWorkItem: getDailySelectedWorkItem().title,
    oneNextAction: "Daily Work Loop enhancement",
  };
}
