import "server-only";
import type { AlKawnVisualMapTruth } from "./types";

export const alKawnVisualMapTruth: AlKawnVisualMapTruth = {
  enforcedTruths: [
    "الكون private to Ahmad devices",
    "Pro Max future public product",
    "Product Truth enforced",
    "ALKON private/background",
    "Universe Operating Kernel judges execution",
    "Every entity inside الكون needs an Existence Contract",
  ],
  blockedStates: [
    "public launch blocked",
    "billing inactive",
    "payments inactive",
    "real money disabled",
    "broker execution disabled/not connected",
    "legal review pending",
  ],
  sourceLabels: [
    "manual founder decision",
    "Product Truth",
    "kernel state",
    "local project state",
    "future gate pending",
  ],
};

export function getAlKawnVisualMapTruth(): AlKawnVisualMapTruth {
  return alKawnVisualMapTruth;
}
