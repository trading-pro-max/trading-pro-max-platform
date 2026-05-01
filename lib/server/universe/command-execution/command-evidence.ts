import { classifyAlKawnCommand } from "./command-classifier";
import type { AlKawnCommandEvidence } from "./types";

export function getCommandEvidence(commandText: string): AlKawnCommandEvidence[] {
  const classification = classifyAlKawnCommand(commandText);

  return [
    {
      id: "classification",
      label: "الكون فهم الطلب.",
      detail: `Intent: ${classification.intentLabel}; verdict: ${classification.verdict}.`,
    },
    {
      id: "scope",
      label: "Personal-only scope",
      detail: "الكون يبقى داخل أجهزة أحمد الشخصية فقط. الاستخدام شخصي لأحمد فقط.",
    },
    {
      id: "product_truth",
      label: "Product Truth",
      detail: "Product Truth يحكم كل تنفيذ.",
    },
    {
      id: "local_day_one",
      label: "Local Day One",
      detail: "Local Day One لم يبدأ بعد.",
    },
  ];
}
