import "server-only";

import { alKawnControlSurfaceRegistry } from "./control-surface-registry";
import type { AlKawnControlSurfaceSummary } from "./types";

export function getControlSurfaceSummary(): AlKawnControlSurfaceSummary {
  return {
    total: alKawnControlSurfaceRegistry.length,
    active: alKawnControlSurfaceRegistry.filter((surface) => surface.status === "active").length,
    protected: alKawnControlSurfaceRegistry.filter((surface) => surface.status === "protected").length,
    future: alKawnControlSurfaceRegistry.filter((surface) => surface.status === "future").length,
    blocked: alKawnControlSurfaceRegistry.filter((surface) => surface.status === "blocked").length,
    activeWithNotes: alKawnControlSurfaceRegistry.filter(
      (surface) => surface.status === "active_with_notes",
    ).length,
    nextSafeAction: "Use /desktop/kawn as the main private control client before Infinity or Operator preparation.",
    rule: "Each layer has a control surface before automation can become safer.",
  };
}
