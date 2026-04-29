import "server-only";
import { getArchitectureRegistrySummary } from "./registry-summary";

export function getArchitectureRegistryNextAction() {
  const summary = getArchitectureRegistrySummary();

  return {
    next: "Absolute Founder Boundary 100" as const,
    reason:
      "Controlled cleanup normalized the target hierarchy and the existing kernel is now canonicalized through the Universe Operating Kernel adapter. Remaining conflicts are planet API classification, legacy Earth/logo compatibility wrappers, and Ahmad-decision product meaning.",
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
