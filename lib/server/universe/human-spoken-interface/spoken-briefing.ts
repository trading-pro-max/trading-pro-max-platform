import "server-only";

import type { AlKawnSpokenLine } from "./types";

export function getAlKawnSpokenDailyBriefing(): AlKawnSpokenLine[] {
  return [
    {
      id: "awake_internal",
      text: "أحمد، الكون مستيقظ ويعمل داخليًا.",
      purpose: "Confirm the enhanced daily loop is awake for private internal work.",
    },
    {
      id: "checked_truth_kernel_desktop",
      text: "أحمد، فحصت Product Truth والنواة والسطح المكتبي.",
      purpose: "Summarize the daily checks in human language.",
    },
    {
      id: "selected_internal_work",
      text: "أحمد، العمل الداخلي الآمن المختار اليوم هو Product Truth verification.",
      purpose: "Name today's selected safe internal work item.",
    },
    {
      id: "legal_money_stopped",
      text: "أحمد، القانون والمال متوقفان عندك فقط.",
      purpose: "Confirm legal and money stop-gates.",
    },
    {
      id: "no_launch_money_broker",
      text: "أحمد، لا يوجد إطلاق عام أو مال أو بروكر.",
      purpose: "Confirm no public, money, or broker activation.",
    },
    {
      id: "only_next_action",
      text: "أحمد، الخطوة التالية الوحيدة هي Daily Work Loop enhancement.",
      purpose: "Give one next action only.",
    },
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
