import "server-only";

import type { AlKawnDesktopDecisionGroup } from "./types";

export function getAlKawnDesktopDecisionCenter(): AlKawnDesktopDecisionGroup[] {
  return [
    {
      id: "direct_internal_execution",
      label: "Direct internal execution",
      category: "direct_internal_execution",
      description: "Safe private work inside الكون may be organized directly.",
      examples: ["audit", "report generation", "roadmap", "task generation", "validation plan", "Product Truth check", "safe UI/internal review"],
    },
    {
      id: "legal_stop",
      label: "Legal stop",
      category: "legal_stop",
      description: "Official/legal/regulatory matters stop for Ahmad.",
      examples: ["legal claim", "FINMA/licensed/regulated wording", "contracts", "trademark", "compliance filing", "judicial/regulatory matter"],
    },
    {
      id: "money_stop",
      label: "Money stop",
      category: "money_stop",
      description: "Money, payment, bank, broker, and real trading actions stop for Ahmad.",
      examples: ["payment", "receiving money", "billing", "bank", "broker", "real trading", "subscriptions", "payouts"],
    },
    {
      id: "blocked_by_product_truth",
      label: "Blocked by Product Truth",
      category: "blocked_by_product_truth",
      description: "Product Truth violations are blocked.",
      examples: ["public Universe", "public ALKON", "secrets in Git", "legal claims without review", "real money while disabled", "Product Truth violation"],
    },
  ];
}
