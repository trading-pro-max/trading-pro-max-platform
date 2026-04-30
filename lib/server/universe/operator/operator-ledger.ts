import "server-only";

import type { OperatorLedgerEntry } from "./types";

export function getOperatorLedger(): OperatorLedgerEntry[] {
  return [
    {
      id: "operator_preparation_closed",
      phase: "Operator Mode preparation",
      result: "closed_ready_for_operator_activation",
      evidence: [
        "Infinity feeds Operator preparation.",
        "Operator permissions defined.",
        "Operator blocked actions defined.",
      ],
    },
    {
      id: "operator_activation_closed",
      phase: "Operator Mode controlled activation",
      result: "closed_operator_internal_active",
      evidence: [
        "الكون يعمل عن أحمد داخليًا.",
        "Operator Mode executes safe internal work only.",
        "No public, money, broker, legal, or external actions.",
      ],
    },
  ];
}
