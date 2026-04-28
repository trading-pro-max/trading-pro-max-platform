import type { LivingEarthEvolutionState } from "./types";

export function getLivingEarthEvolutionState(): LivingEarthEvolutionState {
  return {
    status: "active_with_notes",
    nextSafeAction:
      "Ahmad reviews Living Earth screenshots before visual acceptance or the next focused correction.",
    requiredGates: [
      "Asset Law",
      "Product Truth",
      "Visual Acceptance",
      "Performance sanity",
      "Accessibility",
      "Public/private boundary",
      "Evidence screenshots",
      "Ahmad final acceptance for visual-sensitive changes",
    ],
    blockedActions: [
      "external image hotlink",
      "unknown-license texture",
      "generated Earth image",
      "fake Swiss legal approval claim",
      "Earth overlay covering Trading chart",
      "Local Day One start without Ahmad",
    ],
  };
}
