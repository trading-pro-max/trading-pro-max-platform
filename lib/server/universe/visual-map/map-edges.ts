import "server-only";
import type { AlKawnVisualMapEdge } from "./types";

export const alKawnVisualMapEdges: AlKawnVisualMapEdge[] = [
  {
    id: "edge_ahmad_devices",
    from: "ahmad_human",
    to: "ahmad_private_devices",
    label: "origin to private devices",
    edgeType: "owns",
    truthMeaning: "Ahmad is the origin and private devices are the only allowed runtime.",
  },
  {
    id: "edge_devices_alkawn",
    from: "ahmad_private_devices",
    to: "al_kawn",
    label: "private runtime",
    edgeType: "contains",
    truthMeaning: "الكون remains private to Ahmad devices.",
  },
  {
    id: "edge_truth_governs",
    from: "product_truth",
    to: "al_kawn",
    label: "highest law",
    edgeType: "governs",
    truthMeaning: "Product Truth is the highest truth law.",
  },
  {
    id: "edge_kernel_judge",
    from: "universe_operating_kernel",
    to: "al_kawn",
    label: "execution judge",
    edgeType: "governs",
    truthMeaning: "Universe Operating Kernel judges execution boundaries.",
  },
  {
    id: "edge_alkawn_promax",
    from: "al_kawn",
    to: "pro_max_galaxy",
    label: "product galaxy",
    edgeType: "contains",
    truthMeaning: "Pro Max Galaxy is inside الكون.",
  },
  {
    id: "edge_promax_earth",
    from: "pro_max_galaxy",
    to: "earth_planet",
    label: "first planet",
    edgeType: "contains",
    truthMeaning: "Earth Planet is inside Pro Max Galaxy.",
  },
  {
    id: "edge_earth_trading",
    from: "earth_planet",
    to: "trading_surface",
    label: "trading surface",
    edgeType: "routes_to",
    truthMeaning: "/trading belongs to Earth Planet.",
  },
  {
    id: "edge_swiss_global",
    from: "swiss_local_constitution",
    to: "global_layer",
    label: "Swiss above global",
    edgeType: "blocks",
    truthMeaning: "Swiss Local Constitution is above the Global Layer.",
  },
  {
    id: "edge_alkon_private",
    from: "earth_planet",
    to: "alkon_background_guardian",
    label: "background guardian",
    edgeType: "protects",
    truthMeaning: "ALKON is a private background guardian.",
  },
];

export function getAlKawnVisualMapEdges(): AlKawnVisualMapEdge[] {
  return alKawnVisualMapEdges;
}
