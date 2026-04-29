import "server-only";

import { alKawnControlSurfaceRegistry } from "./control-surface-registry";

export function getControlSurfaceById(surfaceId: string) {
  return alKawnControlSurfaceRegistry.find((surface) => surface.id === surfaceId) ?? null;
}

export function getControlSurfaceRegistry() {
  return alKawnControlSurfaceRegistry;
}

export function getAlKawnControlSurfaces() {
  return alKawnControlSurfaceRegistry;
}
