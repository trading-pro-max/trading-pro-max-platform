import "server-only";

import { getDailySafeWorkItems } from "./daily-safe-work";
import type { DailySelectedWorkItem } from "./types";

export function getDailySelectedWorkItem(): DailySelectedWorkItem {
  const selected = getDailySafeWorkItems().find(
    (item) => item.id === "product_truth_verification",
  );

  if (!selected) {
    throw new Error("Daily selected work item is missing.");
  }

  return {
    ...selected,
    selectedReason:
      "Product Truth priority comes first, and the awakened daily loop must verify truth before comfort or future-gate work.",
    todayOutput:
      "Today’s internal work is selected: Product Truth verification with blockers visible and no legal/money execution.",
  };
}
