import "server-only";
import type { LayerBelongingRule } from "./types";

export function getLayerBelongingRules(): LayerBelongingRule[] {
  return [
    {
      id: "alkawn_private_devices",
      parent: "ahmad_private_devices",
      child: "alkawn",
      wording: "الكون remains private to Ahmad devices.",
      status: "canonical",
    },
    {
      id: "product_truth_inside_alkawn",
      parent: "alkawn",
      child: "product_truth",
      wording: "Product Truth is the highest law inside الكون.",
      status: "canonical",
    },
    {
      id: "kernel_inside_alkawn",
      parent: "alkawn",
      child: "universe_operating_kernel",
      wording: "Universe Operating Kernel is the executive judge inside الكون.",
      status: "canonical",
    },
    {
      id: "pro_max_galaxy_inside_alkawn",
      parent: "alkawn",
      child: "pro_max_galaxy",
      wording: "Pro Max Galaxy belongs inside الكون.",
      status: "canonical",
    },
    {
      id: "earth_inside_pro_max_galaxy",
      parent: "pro_max_galaxy",
      child: "earth_planet",
      wording: "Earth Planet belongs inside Pro Max Galaxy.",
      status: "canonical",
    },
    {
      id: "trading_inside_earth",
      parent: "earth_planet",
      child: "trading_surface",
      wording: "/trading belongs to Earth Planet.",
      status: "canonical",
    },
    {
      id: "alkon_background_only",
      parent: "earth_planet",
      child: "alkon_background_guardian",
      wording: "ALKON is private background guardian only.",
      status: "canonical",
    },
    {
      id: "swiss_above_global",
      parent: "swiss_local_constitution",
      child: "global_layer",
      wording: "Swiss Local Constitution is above Global Layer.",
      status: "canonical",
    },
    {
      id: "public_pro_max_future_only",
      parent: "earth_planet",
      child: "public_pro_max_future",
      wording: "Public Pro Max is future only.",
      status: "future_only",
    },
    {
      id: "pro_max_does_not_own_alkawn",
      parent: "pro_max_galaxy",
      child: "alkawn",
      wording: "Pro Max does not own الكون.",
      status: "blocked_if_reversed",
    },
  ];
}
