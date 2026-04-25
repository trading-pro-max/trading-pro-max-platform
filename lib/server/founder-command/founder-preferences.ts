import "server-only";

export function getFounderPreferenceSnapshot(checkedAt = new Date().toISOString()) {
  return {
    checkedAt,
    mode: "founder_preference_model" as const,
    preferences: [
      "no images unless explicitly requested",
      "no public internal governance terminology",
      "Free should feel familiar and premium",
      "Pro/VIP should carry differentiation",
      "Founder Command remains private",
      "Swiss-inspired precision",
      "Earth Mark identity",
      "no clutter",
      "chart-first workstation",
      "no boxed/small feeling",
      "no fake claims",
      "no rush to launch",
      "depth first, but public UI simple",
      "strong visual acceptance required",
      "Codex commands must be deep, strict, scoped, and validation-heavy",
    ],
    guides: [
      "AI Build Planner",
      "Codex Task Compiler",
      "Visual Acceptance",
      "Founder Companion",
      "Product Reality scoring",
    ],
    truth: {
      userFacingInternalLanguageAllowed: false,
      founderCommandPublicAccessAllowed: false,
      finalVisualApprovalRequiresAhmad: true,
    },
  };
}
