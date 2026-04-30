import "server-only";

import { getDailyBlockedItems } from "./daily-blockers";
import { getDailySafeWorkItems } from "./daily-safe-work";
import type { DailyWorkReport } from "./types";

export function getDailyWorkReport(): DailyWorkReport {
  return {
    title: "Al-Kawn Daily Work Loop",
    path: "reports/daily/al-kawn-daily-work-loop.md",
    summary:
      "Daily Work Loop is active for clean internal work only. Legal and money actions stop for Ahmad, and Product Truth violations are blocked.",
    safeInternalWork: getDailySafeWorkItems().map((item) => item.title),
    blockedWork: getDailyBlockedItems().map((item) => item.title),
    oneNextAction: "Daily Work Loop enhancement",
  };
}
