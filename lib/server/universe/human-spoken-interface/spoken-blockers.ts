import "server-only";

import type { AlKawnSpokenLine } from "./types";

export function getAlKawnSpokenBlockers(): AlKawnSpokenLine[] {
  return [
    {
      id: "legal_money_blockers",
      text: "القانون والمال يتوقفان لأحمد.",
      purpose: "State the legal and money stop gates.",
    },
    {
      id: "product_truth_blockers",
      text: "أي كسر لـ Product Truth يُحجب فورًا.",
      purpose: "State immediate Product Truth blocking.",
    },
    {
      id: "public_secret_blockers",
      text: "الأسرار والكون وALKON لا يخرجون للعامة.",
      purpose: "State secret and public exposure boundaries.",
    },
  ];
}
