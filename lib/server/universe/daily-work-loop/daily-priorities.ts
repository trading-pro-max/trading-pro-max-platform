import "server-only";

import type { DailyPriority } from "./types";

export function getDailyPriorities(): DailyPriority[] {
  return [
    {
      id: "product_truth_first",
      category: "product_truth",
      label: "Product Truth priority comes first.",
      priority: "high",
      rule: "Product Truth problems first.",
      reason: "False readiness, hidden blockers, or unsafe claims must be corrected before comfort work.",
    },
    {
      id: "protection_second",
      category: "protection",
      label: "Protection/auth/secret risks second.",
      priority: "high",
      rule: "Protection risks outrank convenience.",
      reason: "Local auth, secret safety, bundle safety, and public exposure boundaries protect Ahmad.",
    },
    {
      id: "desktop_third",
      category: "desktop",
      label: "Desktop operating readiness third.",
      priority: "medium",
      rule: "The private command client must stay coherent and Ahmad-only.",
      reason: "/desktop/kawn is the main daily operating surface.",
    },
    {
      id: "reports_docs_tests_fourth",
      category: "reports",
      label: "Reports/docs/tests fourth.",
      priority: "medium",
      rule: "Evidence and memory are refreshed after truth and protection.",
      reason: "Reports, docs, and regression summaries make the day understandable.",
    },
    {
      id: "visual_after_truth",
      category: "visual_consistency",
      label: "Visual comfort after truth/protection.",
      priority: "low",
      rule: "Visual or comfort improvements wait behind truth/protection.",
      reason: "Identity polish is safe only after Product Truth and protection are clean.",
    },
    {
      id: "legal_money_stopped",
      category: "future_gates",
      label: "Legal and Money tasks are stopped for Ahmad.",
      priority: "high",
      rule: "Legal and Money are never auto-selected for execution.",
      reason: "Legal, payment, receiving money, broker, and real trading actions require Ahmad.",
    },
    {
      id: "one_daily_next_action",
      category: "future_gates",
      label: "One daily next action only.",
      priority: "high",
      rule: "Only one next action is selected.",
      reason: "The daily loop keeps Ahmad's day clear instead of generating noise.",
    },
  ];
}
