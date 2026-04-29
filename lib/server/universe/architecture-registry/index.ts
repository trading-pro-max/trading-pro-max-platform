import "server-only";
import { canonicalArchitectureRegistry } from "./canonical-registry";
import { getArchitectureRegistryNextAction } from "./registry-next-action";
import {
  getArchitectureRegistryByCategory,
  getArchitectureRegistryConflicts,
  getArchitectureRegistrySummary,
} from "./registry-summary";
import type { ArchitectureRegistryCategory } from "./types";

export function getCanonicalArchitectureRegistry() {
  return canonicalArchitectureRegistry;
}

export {
  getArchitectureRegistryByCategory,
  getArchitectureRegistryConflicts,
  getArchitectureRegistryNextAction,
  getArchitectureRegistrySummary,
};

export type { ArchitectureRegistryCategory };
export type * from "./types";
