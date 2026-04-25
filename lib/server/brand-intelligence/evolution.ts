import "server-only";

import type { IdentityEvolutionDecision } from "./types";

type IdentityChangeRequest = {
  change:
    | "logo_redesign"
    | "plan_colors"
    | "public_landing_visual_direction"
    | "vip_identity"
    | "founder_command_visual_direction"
    | "occasion_theme"
    | "partnership_visuals"
    | "swiss_identity_change"
    | "spacing"
    | "copy_cleanup"
    | "reduce_clutter"
    | "state_label_polish"
    | "unsafe_activation_claim";
};

const majorChanges = new Set<IdentityChangeRequest["change"]>([
  "logo_redesign",
  "plan_colors",
  "public_landing_visual_direction",
  "vip_identity",
  "founder_command_visual_direction",
  "occasion_theme",
  "partnership_visuals",
  "swiss_identity_change",
]);

export function classifyIdentityEvolution(
  request: IdentityChangeRequest
): IdentityEvolutionDecision {
  if (request.change === "unsafe_activation_claim") {
    return {
      changeType: "blocked",
      requiredReviews: ["Identity Guardian", "Legal", "Guardian", "Founder approval"],
      founderApprovalRequired: true,
      safeToAutoDraft: false,
      blockedReasons: ["Identity change attempts unsafe activation or fake claim."],
    };
  }

  if (majorChanges.has(request.change)) {
    return {
      changeType: "major",
      requiredReviews: [
        "Design Ministry",
        "Identity Guardian",
        "Legal",
        "Guardian",
        "Quality",
        "Founder approval",
      ],
      founderApprovalRequired: true,
      safeToAutoDraft: false,
      blockedReasons: [],
    };
  }

  return {
    changeType: "minor",
    requiredReviews: ["Design Ministry", "Quality"],
    founderApprovalRequired: false,
    safeToAutoDraft: true,
    blockedReasons: [],
  };
}

export function getIdentityEvolutionSnapshot() {
  return {
    mode: "identity_evolution_system" as const,
    status: "ready" as const,
    majorChanges: [...majorChanges],
    minorChanges: ["spacing", "copy_cleanup", "reduce_clutter", "state_label_polish"],
    samples: {
      logoRedesign: classifyIdentityEvolution({ change: "logo_redesign" }),
      spacing: classifyIdentityEvolution({ change: "spacing" }),
      unsafeActivation: classifyIdentityEvolution({ change: "unsafe_activation_claim" }),
    },
  };
}
