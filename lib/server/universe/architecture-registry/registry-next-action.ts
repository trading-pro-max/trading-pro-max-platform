import "server-only";
import { getArchitectureRegistrySummary } from "./registry-summary";

export function getArchitectureRegistryNextAction() {
  const summary = getArchitectureRegistrySummary();

  return {
    next: "controlled canonical cleanup" as const,
    reason:
      "Registry conflicts remain: target hierarchy terms are missing from canonical code, Earth/logo systems have compatibility layers, planet APIs need classification, and the existing ALKON kernel must be canonicalized instead of duplicated.",
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
