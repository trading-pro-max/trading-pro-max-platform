import "server-only";
import { getArchitectureRegistrySummary } from "./registry-summary";

export function getArchitectureRegistryNextAction() {
  const summary = getArchitectureRegistrySummary();

  return {
    next: "Al-Kawn Desktop Operating Environment" as const,
    reason:
      "The Visual Map is now a canonical founder-facing architecture view. The next safest step is a private desktop operating environment gate, while Infinity Mode and Operator Mode remain blocked until Ahmad explicitly resumes them.",
    infinityMode: summary.infinityModeSafe ? "safe" : "blocked_until_registry_conflicts_resolved",
    ultimateDepth: summary.ultimateDepthSafe ? "safe" : "blocked_until_registry_conflicts_resolved",
    mustNotDo: [
      "Do not start Infinity Mode.",
      "Do not resume Ultimate 100% Depth.",
      "Do not create a second kernel.",
      "Do not build desktop/mobile app code without an approved desktop operating environment mission.",
      "Do not launch public.",
      "Do not activate billing, real money, broker execution, or legal claims.",
    ],
  };
}
