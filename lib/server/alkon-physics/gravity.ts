import "server-only";

import type { CosmicEvent, GravityAssignment, GravityPriority } from "./types";

export const GRAVITY_PRIORITY_RULES: Record<GravityPriority, string[]> = {
  P0_critical_gravity: [
    "secrets exposure",
    "internal public leakage",
    "Product Truth violation",
    "chart blocking usability",
    "build failure",
    "auth/security risk",
  ],
  P1_high_gravity: [
    "rejected logo",
    "annoying chart",
    "public navigation gap",
    "Apps/Support missing",
    "important visual issue",
  ],
  P2_standard_gravity: [
    "docs cleanup",
    "small UI polish",
    "small test improvements",
    "governed Codex task drafting",
  ],
  P3_future_gravity: [
    "future mobile apps",
    "future social readiness",
    "future CRM",
    "future advanced media",
  ],
  blocked_gravity: [
    "billing activation now",
    "broker/feed activation",
    "public launch activation",
    "fake plan activation",
  ],
  black_hole_forbidden: [
    "live execution",
    "real money",
    "production secrets",
    "social publishing automation",
    "external offensive actions",
    "fake metrics",
    "guaranteed profit or win-rate",
  ],
};

export function assignGravity(event: CosmicEvent): GravityAssignment {
  if (event.gravityPriority === "black_hole_forbidden") {
    return {
      priority: event.gravityPriority,
      reason:
        "The event requests a hard-forbidden activation or exposure path and must enter the Black Hole Zone.",
      escalationTarget: "Defense Universe and Founder Command",
      allowedNextState: "black_holed",
      reviewRequired: true,
      blockedReason:
        "Live execution, real money, broker/feed activation, production secrets, social publishing, external offensive actions, fake metrics, and guaranteed outcomes are forbidden.",
    };
  }

  if (event.gravityPriority === "blocked_gravity") {
    return {
      priority: event.gravityPriority,
      reason:
        "The event conflicts with local laptop scope and must remain blocked until real-world review gates exist.",
      escalationTarget: "Founder Command and Product Truth",
      allowedNextState: "blocked",
      reviewRequired: true,
      blockedReason:
        "Billing, broker/feed, public launch, paid access, and fake activation are not enabled in local scope.",
    };
  }

  if (event.gravityPriority === "P0_critical_gravity") {
    return {
      priority: event.gravityPriority,
      reason:
        "The event can break safety, public/private separation, Product Truth, chart usability, build health, or auth/security.",
      escalationTarget: "Founder Command, Defense Universe, and Result Tribunal",
      allowedNextState: "orbit_assigned",
      reviewRequired: true,
    };
  }

  if (event.gravityPriority === "P1_high_gravity") {
    return {
      priority: event.gravityPriority,
      reason:
        "The event affects accepted identity, chart comfort, public navigation, support readiness, or a major visual/product gap.",
      escalationTarget: "Founder Command and owning planet/system",
      allowedNextState: "orbit_assigned",
      reviewRequired: true,
    };
  }

  if (event.gravityPriority === "P3_future_gravity") {
    return {
      priority: event.gravityPriority,
      reason:
        "The event is useful but belongs to future readiness and cannot activate external systems now.",
      escalationTarget: "Founder Command backlog",
      allowedNextState: "orbit_assigned",
      reviewRequired: false,
    };
  }

  return {
    priority: "P2_standard_gravity",
    reason:
      "The event is a standard governed local task and can move through passport, validation, tribunal, and memory.",
    escalationTarget: "Owning planet/system",
    allowedNextState: "orbit_assigned",
    reviewRequired: true,
  };
}
