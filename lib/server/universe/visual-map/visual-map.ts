import "server-only";
import { getAlKawnVisualMapBoundaries } from "./map-boundaries";
import { getAlKawnVisualMapEdges } from "./map-edges";
import { getAlKawnVisualMapGroups } from "./map-groups";
import { getAlKawnVisualMapLegend } from "./map-legend";
import { getAlKawnVisualMapNodes } from "./map-nodes";
import { getAlKawnVisualMapSummary } from "./map-status";
import { getAlKawnVisualMap } from "./visual-map-model";

export function getCanonicalAlKawnVisualMap() {
  return {
    ...getAlKawnVisualMap(),
    nodes: getAlKawnVisualMapNodes(),
    edges: getAlKawnVisualMapEdges(),
    groups: getAlKawnVisualMapGroups(),
    legend: getAlKawnVisualMapLegend(),
    boundaries: getAlKawnVisualMapBoundaries(),
    summary: getAlKawnVisualMapSummary(),
  };
}
