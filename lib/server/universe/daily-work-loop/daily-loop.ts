import "server-only";

import { getDailyBlockedItems } from "./daily-blockers";
import { getDailyWorkChecklist } from "./daily-checklist";
import { getDailyPriorities } from "./daily-priorities";
import { getDailySafeWorkItems } from "./daily-safe-work";
import type { AlKawnDailyWorkLoop } from "./types";

export function getAlKawnDailyWorkLoop(): AlKawnDailyWorkLoop {
  return {
    id: "al_kawn_daily_work_loop",
    title: "Daily Work Loop is active.",
    state: "active",
    rule:
      "داخل الكون: التنفيذ مباشر. عند القانون: يتوقف لأحمد. عند المال: يتوقف لأحمد. عند كسر Product Truth: يُحجب فورًا.",
    checklist: getDailyWorkChecklist(),
    priorities: getDailyPriorities(),
    safeWorkItems: getDailySafeWorkItems(),
    blockedItems: getDailyBlockedItems(),
    oneNextAction: "Daily Work Loop enhancement",
  };
}
