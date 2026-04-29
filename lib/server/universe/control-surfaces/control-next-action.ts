import "server-only";

import { getControlSurfaceById } from "./control-state";
import { getControlSurfaceSummary } from "./control-summary";

export function getControlSurfaceNextAction(surfaceId?: string) {
  if (surfaceId) {
    return getControlSurfaceById(surfaceId)?.nextSafeAction ?? "Review the control surface registry before acting.";
  }

  return getControlSurfaceSummary().nextSafeAction;
}
