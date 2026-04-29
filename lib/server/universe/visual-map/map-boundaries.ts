import "server-only";
import type { AlKawnVisualMapBoundaryItem } from "./types";

export const alKawnVisualMapBoundaries: AlKawnVisualMapBoundaryItem[] = [
  {
    id: "private_boundary",
    boundaryType: "private_only",
    label: "Private-only boundary",
    meaning: "الكون remains private to Ahmad devices and is not public.",
    affectedNodeIds: ["ahmad_private_devices", "al_kawn", "alkon_background_guardian"],
  },
  {
    id: "legal_boundary",
    boundaryType: "legal_stop",
    label: "Legal stop boundary",
    meaning: "Legal, Swiss/local, FINMA, regulated, licensed, brand, and public claims stop for Ahmad and verified legal review.",
    affectedNodeIds: ["swiss_local_constitution", "global_layer", "public_pro_max_future"],
  },
  {
    id: "money_boundary",
    boundaryType: "money_stop",
    label: "Money stop boundary",
    meaning: "Billing, payments, receiving money, real money, and broker execution remain blocked.",
    affectedNodeIds: ["trading_surface", "public_pro_max_future"],
  },
  {
    id: "future_boundary",
    boundaryType: "future_gate",
    label: "Future-gated boundary",
    meaning: "Infinity Mode, Operator Mode, Self-Building, Global Layer, and Public Pro Max Future are visible but not active.",
    affectedNodeIds: [
      "infinity_mode",
      "operator_mode",
      "self_building",
      "global_layer",
      "public_pro_max_future",
    ],
  },
  {
    id: "truth_boundary",
    boundaryType: "truth_guarded",
    label: "Product Truth boundary",
    meaning: "Product Truth blocks false activation, unsafe claims, and unclear layer ownership.",
    affectedNodeIds: ["product_truth", "existence_contract_law", "universe_operating_kernel"],
  },
];

export function getAlKawnVisualMapBoundaries(): AlKawnVisualMapBoundaryItem[] {
  return alKawnVisualMapBoundaries;
}
