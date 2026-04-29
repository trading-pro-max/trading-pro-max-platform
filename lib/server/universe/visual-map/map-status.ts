import "server-only";
import { getAlKawnVisualMapEdges } from "./map-edges";
import { getAlKawnVisualMapNodes } from "./map-nodes";
import type { AlKawnVisualMapSummary } from "./types";

export function getAlKawnVisualMapSummary(): AlKawnVisualMapSummary {
  return {
    title: "Al-Kawn Visual Map",
    status: "active_private_founder_map",
    totalNodes: getAlKawnVisualMapNodes().length,
    totalEdges: getAlKawnVisualMapEdges().length,
    privateOnly: true,
    publicLaunchBlocked: true,
    infinityModeActive: false,
    operatorModeActive: false,
    nextAction: "Al-Kawn Desktop Operating Environment",
  };
}
