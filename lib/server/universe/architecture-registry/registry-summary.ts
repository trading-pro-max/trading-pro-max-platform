import "server-only";
import { canonicalArchitectureRegistry } from "./canonical-registry";
import { registryCategoryOrder } from "./registry-categories";
import type {
  ArchitectureRegistryCategory,
  ArchitectureRegistryItem,
  ArchitectureRegistrySummary,
} from "./types";

function countByCategory(items: ArchitectureRegistryItem[]) {
  return registryCategoryOrder.reduce<Record<ArchitectureRegistryCategory, number>>(
    (counts, category) => ({
      ...counts,
      [category]: items.filter((item) => item.category === category).length,
    }),
    {
      primary: 0,
      compatibility: 0,
      protected: 0,
      cleanup_candidate: 0,
      needs_ahmad_decision: 0,
    }
  );
}

export function getArchitectureRegistryByCategory(
  category: ArchitectureRegistryCategory
): ArchitectureRegistryItem[] {
  return canonicalArchitectureRegistry.filter((item) => item.category === category);
}

export function getArchitectureRegistryConflicts(): ArchitectureRegistryItem[] {
  return canonicalArchitectureRegistry.filter(
    (item) =>
      item.category === "cleanup_candidate" ||
      item.category === "needs_ahmad_decision" ||
      item.risk === "critical"
  );
}

export function getArchitectureRegistrySummary(): ArchitectureRegistrySummary {
  const byCategory = countByCategory(canonicalArchitectureRegistry);
  const unresolvedConflictCount =
    byCategory.cleanup_candidate + byCategory.needs_ahmad_decision;

  return {
    total: canonicalArchitectureRegistry.length,
    byCategory,
    unresolvedConflictCount,
    primaryCount: byCategory.primary,
    compatibilityCount: byCategory.compatibility,
    protectedCount: byCategory.protected,
    cleanupCandidateCount: byCategory.cleanup_candidate,
    needsAhmadDecisionCount: byCategory.needs_ahmad_decision,
    infinityModeSafe: false,
    ultimateDepthSafe: false,
    safestNextAction: "Al-Kawn Desktop Operating Environment",
  };
}
