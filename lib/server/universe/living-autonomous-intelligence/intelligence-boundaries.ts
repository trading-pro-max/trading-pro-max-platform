import "server-only";

import type { IntelligenceBoundary } from "./types";

export function getAlKawnIntelligenceBoundaries(): IntelligenceBoundary[] {
  return [
    {
      id: "money",
      label: "Money gate",
      gate: "money",
      rule: "أحمد وحده يتحكم بالمال الحقيقي.",
    },
    {
      id: "legal",
      label: "Legal gate",
      gate: "legal",
      rule: "أحمد وحده يعتمد القرارات القانونية الرسمية.",
    },
    {
      id: "external",
      label: "External gate",
      gate: "external",
      rule: "الخروج للعالم يمر عبر بوابات أحمد.",
    },
    {
      id: "public",
      label: "Public exposure block",
      gate: "public",
      rule: "Do not expose الكون publicly and do not expose ALKON publicly.",
    },
    {
      id: "secret",
      label: "Secret exposure block",
      gate: "secret",
      rule: "أسرار أحمد لا تخرج من أجهزته إلا بأمر صريح.",
    },
    {
      id: "product_truth",
      label: "Product Truth block",
      gate: "product_truth",
      rule: "Product Truth يحكم كل تنفيذ.",
    },
  ];
}
