import "server-only";

import { getControlSurfaceById } from "./control-state";

export { sharedControlActionLaw } from "./control-actions";
export { getControlSurfaceBoundaries } from "./control-boundaries";
export { getControlSurfaceNextAction } from "./control-next-action";
export {
  getAlKawnControlSurfaces,
  getControlSurfaceById,
  getControlSurfaceRegistry,
} from "./control-state";
export { getControlSurfaceSummary } from "./control-summary";
export type {
  AlKawnControlAction,
  AlKawnControlActionVerdict,
  AlKawnControlSurface,
  AlKawnControlSurfaceStatus,
  AlKawnControlSurfaceSummary,
} from "./types";

export function getControlSurfaceActions(surfaceId: string) {
  const surface = getControlSurfaceById(surfaceId);

  if (!surface) {
    return [];
  }

  return [
    ...surface.directInternalActions,
    ...surface.legalStopActions,
    ...surface.moneyStopActions,
    ...surface.blockedActions,
  ];
}
