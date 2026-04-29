import "server-only";
import type { AlKawnVisualMapGroup } from "./types";

export const alKawnVisualMapGroups: AlKawnVisualMapGroup[] = [
  {
    id: "origin_and_private_access",
    label: "Origin and private access",
    purpose: "Shows Ahmad, private devices, and الكون private-only root.",
    nodeIds: ["ahmad_human", "ahmad_private_devices", "al_kawn"],
  },
  {
    id: "truth_and_execution_laws",
    label: "Truth and execution laws",
    purpose: "Shows laws that govern belonging, truth, execution, and stopping.",
    nodeIds: [
      "supreme_root_constitution",
      "product_truth",
      "universe_operating_kernel",
      "existence_contract_law",
      "swiss_local_constitution",
    ],
  },
  {
    id: "private_internal_systems",
    label: "Private internal systems",
    purpose: "Shows private vault, protection, reality, human interface, and future execution systems.",
    nodeIds: [
      "ahmad_digital_vault",
      "protection_core",
      "universe_one",
      "human_interface",
      "sovereign_execution",
      "execution_court",
      "causal_execution",
      "infinity_mode",
      "operator_mode",
      "self_building",
    ],
  },
  {
    id: "product_galaxy",
    label: "Product galaxy",
    purpose: "Shows Pro Max Galaxy, Earth Planet, and product/trading surfaces.",
    nodeIds: [
      "pro_max_galaxy",
      "earth_planet",
      "trading_project",
      "trading_surface",
      "pro_max_center",
      "global_layer",
      "public_pro_max_future",
      "alkon_background_guardian",
    ],
  },
];

export function getAlKawnVisualMapGroups(): AlKawnVisualMapGroup[] {
  return alKawnVisualMapGroups;
}
