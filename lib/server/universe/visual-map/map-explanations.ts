import "server-only";
import { getAlKawnVisualMapNodes } from "./map-nodes";

export function explainVisualMapNode(nodeId: string): string {
  const node = getAlKawnVisualMapNodes().find((item) => item.id === nodeId);

  if (!node) {
    return "Unknown visual map node. It needs evidence before it can enter الكون.";
  }

  return `${node.englishLabel}: ${node.compactExplanation} Owner: ${node.owner}. Status: ${node.status}. Truth source: ${node.truthSource}. Boundary: ${node.boundaryType}.`;
}
