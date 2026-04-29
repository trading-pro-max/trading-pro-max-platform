import "server-only";

import { alKawnControlSurfaceRegistry } from "./control-surface-registry";

export function getControlSurfaceBoundaries(surfaceId: string) {
  const surface = alKawnControlSurfaceRegistry.find((item) => item.id === surfaceId);

  if (!surface) {
    return [];
  }

  return [
    ...surface.legalStopActions,
    ...surface.moneyStopActions,
    ...surface.blockedActions,
  ];
}
