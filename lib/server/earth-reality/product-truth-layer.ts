import type { EarthRealityCheck } from "./types";

export function getEarthProductTruthLayerChecks(): EarthRealityCheck[] {
  return [
    {
      checkId: "earth_truth_hard_blocks",
      layer: "product_truth",
      surface: "launch_gate",
      requirement:
        "Live execution, real money, broker/feed, billing, production, public launch, and social publishing must remain inactive or blocked.",
      decision: "pass",
      reason:
        "Product Truth and launch readiness report these capabilities as blocked/inactive.",
      userImpact: "Users cannot accidentally enter unsafe real-world flows.",
      trustImpact: "The product does not pretend to be launched or monetized.",
      safetyImpact: "Real-money and activation paths stay impossible from public UI.",
      requiredFix: "Require Founder approval, legal/security review, and full validation before any future change.",
      publicCopyRule: "Use blocked, inactive, planned, or future.",
      validationRule: "APIs and UI must report activation false/inactive.",
    },
    {
      checkId: "earth_truth_private_boundary",
      layer: "product_truth",
      surface: "diagnostics",
      requirement:
        "Private command systems and internal memory must never appear in public UI.",
      decision: "pass",
      reason:
        "Public diagnostics are sanitized and public pages use only Trading Pro Max language.",
      userImpact: "Users see the product world, not owner-only systems.",
      trustImpact: "Private/public boundaries are comprehensible.",
      safetyImpact: "Internal controls, secrets, and construction systems remain hidden.",
      requiredFix: "Continue public leak tests for every private term.",
      publicCopyRule: "Say private systems remain internal only if needed.",
      validationRule: "Public UI must not contain forbidden private terms.",
    },
  ];
}
