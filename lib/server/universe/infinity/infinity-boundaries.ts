import "server-only";

import type { InfinityBoundary } from "./types";

export function getInfinityBoundaries(): InfinityBoundary[] {
  return [
    {
      id: "direct_internal_execution",
      label: "Internal execution boundary",
      verdict: "allow_internal",
      wording: "Inside الكون: direct internal execution.",
      reason: "Reports, summaries, task organization, validation notes, and Product Truth checks are internal work.",
    },
    {
      id: "legal_stop",
      label: "Legal stop",
      verdict: "stop_for_ahmad",
      wording: "Legal and Money gates stop execution for Ahmad.",
      reason: "Legal claims, regulatory claims, contracts, compliance, and official matters stop for Ahmad.",
    },
    {
      id: "money_stop",
      label: "Money stop",
      verdict: "stop_for_ahmad",
      wording: "Legal and Money gates stop execution for Ahmad.",
      reason: "Payments, receiving money, billing, broker, bank, payouts, subscriptions, and real-money trading stop for Ahmad.",
    },
    {
      id: "product_truth_block",
      label: "Product Truth block",
      verdict: "blocked",
      wording: "Product Truth controls every cycle.",
      reason: "False public, money, broker, legal, guarantee, safety, or privacy claims are blocked immediately.",
    },
    {
      id: "no_uncontrolled_loop",
      label: "No uncontrolled loop",
      verdict: "blocked",
      wording: "No uncontrolled infinite loop.",
      reason: "Infinity preparation defines a controlled cycle plan that stops and waits for a safe trigger.",
    },
    {
      id: "external_actions_block",
      label: "External automation block",
      verdict: "blocked",
      wording: "No public, money, broker, legal, or external automation.",
      reason: "External accounts, public release, money movement, broker execution, and legal claims remain outside this mission.",
    },
    {
      id: "future_scheduler_gate",
      label: "Future scheduler gate",
      verdict: "future_gate",
      wording: "Infinity cycle waits for safe trigger.",
      reason: "A background daemon or scheduler is future-gated and requires a separate controlled activation mission.",
    },
  ];
}
