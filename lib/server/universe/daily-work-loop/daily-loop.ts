import "server-only";

import { getDailyBlockedItems } from "./daily-blockers";
import { getDailyWorkChecklist } from "./daily-checklist";
import { getDailyMemorySnapshot } from "./daily-memory";
import { getDailyNextAction } from "./daily-next-action";
import { getDailyPriorities } from "./daily-priorities";
import { getDailyProgressState } from "./daily-progress";
import { getDailySafeWorkItems } from "./daily-safe-work";
import { getDailySelectedWorkItem } from "./daily-work-selection";
import type { AlKawnDailyWorkLoop } from "./types";

export function getAlKawnDailyWorkLoop(): AlKawnDailyWorkLoop {
  return {
    id: "al_kawn_daily_work_loop",
    title: "Daily Work Loop enhancement",
    state: "working_internal",
    rule:
      "داخل الكون: التنفيذ مباشر. عند القانون: يتوقف لأحمد. عند المال: يتوقف لأحمد. عند كسر Product Truth: يُحجب فورًا.",
    requiredWording: [
      "Daily Work Loop enhancement",
      "الكون ينظم يومه الداخلي.",
      "Today’s internal work is selected.",
      "Safe internal work can continue.",
      "Legal and Money gates stop execution for Ahmad.",
      "Daily blockers are visible.",
      "Daily WAKE REPORT updated.",
      "One next action selected.",
      "Product Truth priority comes first.",
      "Legal and Money tasks are stopped for Ahmad.",
      "One daily next action only.",
    ],
    checklist: getDailyWorkChecklist(),
    priorities: getDailyPriorities(),
    safeWorkItems: getDailySafeWorkItems(),
    blockedItems: getDailyBlockedItems(),
    selectedWorkItem: getDailySelectedWorkItem(),
    progress: getDailyProgressState(),
    memorySnapshot: getDailyMemorySnapshot(),
    nextAction: getDailyNextAction(),
    oneNextAction: "Daily Work Loop enhancement",
  };
}
