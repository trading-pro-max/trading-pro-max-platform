import "server-only";

import type { DailyPriority } from "./types";

export function getDailyPriorities(): DailyPriority[] {
  return [
    {
      id: "product_truth_first",
      label: "Product Truth check",
      priority: "high",
      reason: "Product Truth is the highest law and must remain visible before any work proceeds.",
    },
    {
      id: "one_next_action",
      label: "One next action",
      priority: "high",
      reason: "The daily loop should reduce noise and choose one safe internal action.",
    },
    {
      id: "spoken_briefing",
      label: "Human spoken briefing",
      priority: "medium",
      reason: "الكون should speak clearly to Ahmad without fake certainty or overload.",
    },
    {
      id: "report_memory",
      label: "Report and memory check",
      priority: "medium",
      reason: "Daily operation needs local evidence without storing secrets.",
    },
  ];
}
