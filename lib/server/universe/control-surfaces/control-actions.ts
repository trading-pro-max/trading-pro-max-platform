import "server-only";

import type { AlKawnControlAction, AlKawnControlActionVerdict } from "./types";

export function createControlAction(
  id: string,
  label: string,
  verdict: AlKawnControlActionVerdict,
  detail: string,
): AlKawnControlAction {
  return { id, label, verdict, detail };
}

export const sharedControlActionLaw = [
  "داخل الكون: التنفيذ مباشر.",
  "عند القانون: يتوقف لأحمد.",
  "عند المال: يتوقف لأحمد.",
  "Product Truth هو قانون الحقيقة الأعلى.",
  "Universe Operating Kernel هو القاضي التنفيذي.",
] as const;
