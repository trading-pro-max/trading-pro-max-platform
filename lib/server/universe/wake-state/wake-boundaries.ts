import "server-only";

import type { AlKawnWakeBoundary } from "./types";

export function getAlKawnWakeBoundaries(): AlKawnWakeBoundary[] {
  return [
    {
      id: "inside_al_kawn_direct_execution",
      label: "Inside الكون",
      verdict: "execute_directly",
      wording: "Inside الكون: direct internal execution.",
      reason:
        "Clean internal work such as reports, audits, task organization, validation plans, and Product Truth checks can run privately.",
    },
    {
      id: "legal_gate",
      label: "Legal gate",
      verdict: "stop_for_ahmad",
      wording: "Legal and Money gates stop execution for Ahmad.",
      reason:
        "Legal claims, FINMA/licensed wording, contracts, trademarks, compliance filings, and official matters require Ahmad.",
    },
    {
      id: "money_gate",
      label: "Money gate",
      verdict: "stop_for_ahmad",
      wording: "عند المال: يتوقف لأحمد.",
      reason:
        "Billing, payments, receiving money, payouts, bank, broker, and real-money trading require Ahmad.",
    },
    {
      id: "product_truth_block",
      label: "Product Truth violation",
      verdict: "block_immediately",
      wording: "عند كسر Product Truth: يُحجب فورًا.",
      reason:
        "False public, legal, payment, broker, risk-free, guaranteed-profit, or hidden Product Truth claims are blocked immediately.",
    },
    {
      id: "secret_public_exposure_block",
      label: "Secrets and public exposure",
      verdict: "block_immediately",
      wording: "Secrets and public exposure are blocked unless Ahmad explicitly approves.",
      reason:
        "No secrets in Git or desktop bundle, no public الكون, no public ALKON, and no external account connection without Ahmad.",
    },
  ];
}
