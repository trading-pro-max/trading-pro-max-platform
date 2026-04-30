import "server-only";

import { getAlKawnActionSelector } from "./action-selector";

export function getAlKawnDecisionEngine() {
  return {
    priorities: [
      "Product Truth risk",
      "Secret/privacy risk",
      "Broken validation/build/test",
      "Missing active-layer report",
      "Daily Work Loop next action",
      "Desktop usability",
      "Capability gap",
      "Visual/living detail improvement",
      "Future-gate preparation",
    ],
    selectedAction: getAlKawnActionSelector(),
    requiredWording: [
      "كل قرار ذكي يختار عملًا داخليًا واحدًا فقط.",
      "الأولوية الأولى هي Product Truth والخصوصية.",
    ],
  };
}
