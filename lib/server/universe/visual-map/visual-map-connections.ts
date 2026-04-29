import "server-only";
import type { AlKawnVisualMapConnection } from "./types";

export const alKawnVisualMapConnections: AlKawnVisualMapConnection[] = [
  {
    id: "ahmad_to_devices",
    from: "ahmad_human",
    to: "ahmad_private_devices",
    relation: "origin",
    meaning: "Ahmad is the origin and his private devices are the only allowed access environment.",
  },
  {
    id: "devices_to_alkawn",
    from: "ahmad_private_devices",
    to: "al_kawn",
    relation: "contains",
    meaning: "الكون runs privately on Ahmad devices.",
  },
  {
    id: "truth_governs_all",
    from: "product_truth",
    to: "al_kawn",
    relation: "governs",
    meaning: "Product Truth is the highest truth law for everything inside الكون.",
  },
  {
    id: "kernel_judges_execution",
    from: "universe_operating_kernel",
    to: "al_kawn",
    relation: "governs",
    meaning: "Universe Operating Kernel is the execution judge.",
  },
  {
    id: "contracts_gate_entry",
    from: "existence_contract",
    to: "al_kawn",
    relation: "governs",
    meaning: "Every entity inside الكون needs an Existence Contract.",
  },
  {
    id: "swiss_above_global",
    from: "swiss_local_constitution",
    to: "global_layer",
    relation: "stops",
    meaning: "Swiss Local Constitution is above the Global Layer.",
  },
  {
    id: "alkawn_contains_promax",
    from: "al_kawn",
    to: "pro_max_galaxy",
    relation: "contains",
    meaning: "Pro Max Galaxy is inside الكون.",
  },
  {
    id: "promax_contains_earth",
    from: "pro_max_galaxy",
    to: "earth_planet",
    relation: "contains",
    meaning: "Earth Planet is the trading project.",
  },
  {
    id: "earth_routes_to_trading",
    from: "earth_planet",
    to: "trading_surface",
    relation: "routes_to",
    meaning: "/trading is the trading surface.",
  },
  {
    id: "earth_contains_alkon",
    from: "earth_planet",
    to: "alkon_background_guardian",
    relation: "protects",
    meaning: "ALKON is private/background.",
  },
  {
    id: "legal_money_stop",
    from: "universe_operating_kernel",
    to: "public_pro_max_future",
    relation: "stops",
    meaning: "Legal and Money gates stop execution for Ahmad.",
  },
];

export function getAlKawnVisualMapConnections(): AlKawnVisualMapConnection[] {
  return alKawnVisualMapConnections;
}
