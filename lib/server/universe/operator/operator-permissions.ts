import "server-only";

import type { OperatorPermission } from "./types";

export function getOperatorPermissions(): OperatorPermission[] {
  return [
    {
      id: "direct_internal",
      label: "Direct internal work",
      gate: "execute_directly",
      meaning: "Operator Mode may prepare safe internal reports, audits, summaries, tasks, and briefings.",
      examples: [
        "internal reports",
        "internal audits",
        "next task selection",
        "Product Truth checks",
        "validation planning",
      ],
    },
    {
      id: "legal_stop",
      label: "Legal stop",
      gate: "stop_for_legal",
      meaning: "Legal, regulatory, contract, ownership, and official claims stop for Ahmad.",
      examples: ["legal claims", "FINMA claims", "contracts", "compliance filings"],
    },
    {
      id: "money_stop",
      label: "Money stop",
      gate: "stop_for_money",
      meaning: "Money, payment, billing, bank, broker, subscription, payout, and real trading tasks stop for Ahmad.",
      examples: ["billing", "payments", "receiving money", "broker", "real money"],
    },
    {
      id: "product_truth_block",
      label: "Blocked by Product Truth",
      gate: "blocked_product_truth",
      meaning: "False, unsafe, public, guarantee, legal, money, broker, or privacy-breaking claims are blocked.",
      examples: [
        "public Al-Kawn",
        "public ALKON",
        "performance guarantee claim",
        "zero-risk claim",
      ],
    },
    {
      id: "security_block",
      label: "Blocked by security",
      gate: "blocked_security",
      meaning: "Secrets, private documents, app-bundle secrets, Git secrets, and external account data are blocked.",
      examples: ["secrets in Git", "secrets in desktop bundle", "external account action"],
    },
  ];
}
