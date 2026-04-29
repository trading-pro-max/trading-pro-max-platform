import "server-only";
import { getArchitectureRegistrySummary } from "./registry-summary";

export function getArchitectureRegistryNextAction() {
  const summary = getArchitectureRegistrySummary();

  return {
    next: "existing kernel canonicalization" as const,
    reason:
      "Controlled cleanup normalized the target hierarchy in docs, server truth, and private UI. Remaining conflicts are kernel canonicalization, planet API classification, and legacy Earth/logo compatibility wrappers.",
    infinityMode: summary.infinityModeSafe ? "safe" : "blocked_until_registry_conflicts_resolved",
    ultimateDepth: summary.ultimateDepthSafe ? "safe" : "blocked_until_registry_conflicts_resolved",
    mustNotDo: [
      "Do not start Infinity Mode.",
      "Do not resume Ultimate 100% Depth.",
      "Do not create a second kernel.",
      "Do not build desktop/mobile app code.",
      "Do not launch public.",
      "Do not activate billing, real money, broker execution, or legal claims.",
    ],
  };
}
