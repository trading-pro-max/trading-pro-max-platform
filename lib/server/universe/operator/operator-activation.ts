import "server-only";

import { getAlKawnOperatorPreparation } from "./operator-preparation";
import { getOperatorCurrentWork, getOperatorCycle } from "./operator-cycle";
import { getOperatorLedger } from "./operator-ledger";
import { getOperatorControlledNextAction } from "./operator-next-action";
import type { OperatorControlledActivation } from "./types";

export function getOperatorHumanMessage(): string {
  return "أحمد، الكون يعمل عن أحمد داخليًا، وينفذ العمل الداخلي الآمن فقط، ويتوقف عند القانون والمال.";
}

export function getOperatorControlledActivation(): OperatorControlledActivation {
  const preparation = getAlKawnOperatorPreparation();
  const status =
    preparation.status === "closed_ready_for_operator_activation"
      ? "closed_operator_internal_active"
      : "blocked_prerequisite_missing";

  return {
    id: "operator_controlled_activation",
    title: "Operator Mode controlled activation",
    status,
    summary:
      "Operator Mode controlled activation lets الكون work for Ahmad internally by executing safe internal work only and reporting Legal, Money, Product Truth, security, and privacy stops.",
    requiredWording: [
      "Operator Mode controlled activation",
      "الكون يعمل عن أحمد داخليًا.",
      "Operator Mode executes safe internal work only.",
      "Legal and Money gates stop execution for Ahmad.",
      "Product Truth blocks unsafe or false actions.",
      "No public, money, broker, legal, or external actions.",
    ],
    cycle: getOperatorCycle(),
    ledger: getOperatorLedger(),
    currentWork: getOperatorCurrentWork(),
    humanMessage: getOperatorHumanMessage(),
    nextAction: getOperatorControlledNextAction(),
  };
}
