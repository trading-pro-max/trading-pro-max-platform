import "server-only";

import type { OperatorBlockedAction } from "./types";

export function getOperatorBlockedActions(): OperatorBlockedAction[] {
  return [
    {
      id: "legal",
      title: "Legal work stopped",
      gate: "stop_for_legal",
      reason: "Legal matters stop for Ahmad and verified professional review.",
      whatOperatorCanPrepare: "Internal legal-readiness notes only.",
    },
    {
      id: "money",
      title: "Money work stopped",
      gate: "stop_for_money",
      reason: "Money movement, billing, payments, receiving money, broker, bank, and real trading stop for Ahmad.",
      whatOperatorCanPrepare: "Internal money-gate notes only.",
    },
    {
      id: "public_exposure",
      title: "Public exposure blocked",
      gate: "blocked_product_truth",
      reason: "Al-Kawn and ALKON remain private.",
      whatOperatorCanPrepare: "Private status explanations only.",
    },
    {
      id: "external_accounts",
      title: "External account action blocked",
      gate: "blocked_security",
      reason: "External accounts require Ahmad approval and are not part of Operator controlled activation.",
      whatOperatorCanPrepare: "Internal account-readiness checklist only.",
    },
    {
      id: "secrets",
      title: "Secret exposure blocked",
      gate: "blocked_security",
      reason: "Secrets must not be stored in Git, reports, desktop bundle, or public assets.",
      whatOperatorCanPrepare: "Redacted security notes only.",
    },
  ];
}
