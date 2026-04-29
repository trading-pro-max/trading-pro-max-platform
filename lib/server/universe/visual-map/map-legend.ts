import "server-only";
import type { AlKawnVisualMapLegendItem } from "./types";

export const alKawnVisualMapLegend: AlKawnVisualMapLegendItem[] = [
  {
    id: "status_active",
    label: "active / active_with_notes",
    meaning: "Exists now but may still carry Product Truth notes or future gates.",
  },
  {
    id: "status_protected",
    label: "protected",
    meaning: "Must not be removed or casually changed.",
  },
  {
    id: "status_blocked_future",
    label: "blocked / future_gated",
    meaning: "Visible as a future or blocked layer, not active execution.",
  },
  {
    id: "truth_sources",
    label: "truth source",
    meaning: "Manual founder decision, Product Truth, kernel enforcement, report/test evidence, local state, labeled simulation, or future gate.",
  },
  {
    id: "boundaries",
    label: "boundary",
    meaning: "Private-only, legal stop, money stop, public block, future gate, truth guard, or secret guard.",
  },
];

export function getAlKawnVisualMapLegend(): AlKawnVisualMapLegendItem[] {
  return alKawnVisualMapLegend;
}
