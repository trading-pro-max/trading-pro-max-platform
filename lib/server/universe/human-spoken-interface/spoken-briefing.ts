import "server-only";

import type { AlKawnSpokenLine } from "./types";

export function getAlKawnSpokenDailyBriefing(): AlKawnSpokenLine[] {
  return [
    {
      id: "product_truth_saved",
      text: "أحمد، Product Truth محفوظ.",
      purpose: "Confirm the highest truth law is loaded before work.",
    },
    {
      id: "kernel_judge",
      text: "أحمد، النواة تعمل كقاضٍ تنفيذي.",
      purpose: "Confirm the Universe Operating Kernel is the execution judge.",
    },
    {
      id: "safe_internal_today",
      text: "أحمد، اليوم سأعمل على عمل داخلي آمن.",
      purpose: "Name today's safe private internal work posture.",
    },
    {
      id: "no_legal_money_touch",
      text: "أحمد، لا يوجد لمس للقانون أو المال.",
      purpose: "State that legal and money actions are excluded from the daily loop.",
    },
    {
      id: "stop_for_ahmad",
      text: "أحمد، إذا ظهر قانون أو مال سأتوقف لك.",
      purpose: "Explain the stop-gate behavior.",
    },
  ];
}
