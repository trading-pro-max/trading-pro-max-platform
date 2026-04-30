import "server-only";

import type { AlKawnSpokenLine } from "./types";

export function getAlKawnSpokenNeedsFromAhmad(): AlKawnSpokenLine[] {
  return [
    {
      id: "legal_decisions",
      text: "أحمد، القرارات القانونية تبقى عندك.",
      purpose: "Keep official/legal matters with Ahmad.",
    },
    {
      id: "money_decisions",
      text: "أحمد، قرارات المال والدفع والبروكر تبقى عندك.",
      purpose: "Keep money, payments, receiving money, broker, and real trading with Ahmad.",
    },
    {
      id: "final_decision",
      text: "أحمد، القرار النهائي لا أتجاوزه.",
      purpose: "Preserve final founder decision authority.",
    },
  ];
}
