import "server-only";

import type { AlKawnSpokenLine } from "./types";

export function getAlKawnSpokenIntelligenceBriefing(): AlKawnSpokenLine[] {
  return [
    {
      id: "observed_safe_action",
      text: "أحمد، راقبت حالة الكون وحددت عملًا داخليًا آمنًا.",
      purpose: "Explain that living intelligence observed the private state and selected one safe internal action.",
    },
    {
      id: "protects_product_truth",
      text: "أحمد، اخترت هذه المهمة لأنها تحمي Product Truth.",
      purpose: "Explain the decision reason without fake certainty.",
    },
    {
      id: "no_money_legal_touch",
      text: "أحمد، لا يوجد لمس للمال أو القانون.",
      purpose: "Confirm money and legal gates stop for Ahmad.",
    },
    {
      id: "executed_validated_reported",
      text: "أحمد، نفذت داخليًا ثم تحققت وكتبت التقرير.",
      purpose: "Summarize the internal-only cycle result.",
    },
    {
      id: "external_waits_for_ahmad",
      text: "أحمد، هذا الفعل خارجي وسأنتظر قرارك.",
      purpose: "Explain external stop behavior.",
    },
  ];
}
