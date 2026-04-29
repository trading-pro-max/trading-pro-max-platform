import "server-only";
import type { ArchitectureRegistryCategory } from "./types";

export const ARCHITECTURE_REGISTRY_CATEGORIES: Record<
  ArchitectureRegistryCategory,
  { label: string; meaning: string }
> = {
  primary: {
    label: "Primary",
    meaning: "Canonical source of truth. Future work imports or uses this and protects it from duplication.",
  },
  compatibility: {
    label: "Compatibility",
    meaning: "Legacy adapter still needed temporarily. It must wrap or import primary logic and cannot become new truth.",
  },
  protected: {
    label: "Protected",
    meaning: "Must not be removed or casually changed because it preserves validated closure, legal, security, or Product Truth evidence.",
  },
  cleanup_candidate: {
    label: "Cleanup candidate",
    meaning: "Duplicated, stale, conflicting, or replaceable. It is not removed until a controlled cleanup task exists.",
  },
  needs_ahmad_decision: {
    label: "Needs Ahmad decision",
    meaning: "Product meaning or founder strategy is unclear or sensitive and must wait for Ahmad before changing.",
  },
};

export const registryCategoryOrder: ArchitectureRegistryCategory[] = [
  "primary",
  "compatibility",
  "protected",
  "cleanup_candidate",
  "needs_ahmad_decision",
];
