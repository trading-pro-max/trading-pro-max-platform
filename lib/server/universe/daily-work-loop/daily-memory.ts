import "server-only";

import { getDailyBlockedItems } from "./daily-blockers";
import { getDailySelectedWorkItem } from "./daily-work-selection";
import type { DailyMemorySnapshot } from "./types";

export function getDailyMemorySnapshot(): DailyMemorySnapshot {
  const selectedWork = getDailySelectedWorkItem();

  return {
    path: "reports/daily/al-kawn-daily-memory-snapshot.md",
    currentDateTimeSource:
      "Ahmad private device date/time, Europe/Zurich, 2026-04-30; local project state is the evidence source.",
    latestClosedMission:
      "Al-Kawn Wake State + Daily Work Loop + Human Spoken Interface, commit b9cbb23.",
    currentDailyState: "working_internal",
    selectedSafeWorkItem: selectedWork.title,
    blockers: getDailyBlockedItems().map((item) => item.title),
    nextAction: "Daily Work Loop enhancement",
    notDone: [
      "Infinity Mode not started.",
      "Operator Mode not started.",
      "No public launch.",
      "No billing, payments, receiving money, real money, or broker execution.",
      "No legal approval or FINMA claim.",
      "No external calendar, email, drive, bank, broker, or payment connection.",
    ],
    noSecrets: true,
  };
}
