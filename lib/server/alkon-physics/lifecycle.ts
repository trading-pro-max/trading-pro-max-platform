import "server-only";

import type { CosmicStatus, LifecycleValidation } from "./types";

export const COSMIC_LIFECYCLE: CosmicStatus[] = [
  "detected",
  "energized",
  "gravity_assigned",
  "orbit_assigned",
  "planet_assigned",
  "satellite_monitoring",
  "station_assigned",
  "worker_assigned",
  "passport_required",
  "passport_ready",
  "permit_required",
  "codex_ready",
  "validation_required",
  "tribunal_pending",
  "memory_pending",
  "reported",
  "closed",
];

export const BLOCKED_LIFECYCLE_RULES = [
  "any state may move to black_holed when hard forbidden scope is detected",
  "codex_ready is rejected without a ready Task Passport",
  "validation_required is rejected without a validation plan",
  "memory_pending is rejected without a Result Tribunal decision",
  "public exposure is rejected without a public boundary check",
];

export function validateCosmicLifecycleTransition(
  from: CosmicStatus,
  to: CosmicStatus,
  context: {
    passportReady?: boolean;
    validationPlanReady?: boolean;
    tribunalReady?: boolean;
    publicBoundaryChecked?: boolean;
    hardForbidden?: boolean;
  } = {}
): LifecycleValidation {
  if (to === "black_holed") {
    return {
      allowed: Boolean(context.hardForbidden),
      from,
      to,
      reason: context.hardForbidden
        ? "Hard-forbidden scope can move directly into the Black Hole Zone."
        : "Black Hole transition requires hard-forbidden evidence.",
    };
  }

  if (to === "codex_ready" && !context.passportReady) {
    return {
      allowed: false,
      from,
      to,
      reason: "codex_ready is rejected without a ready Task Passport.",
    };
  }

  if (to === "validation_required" && !context.validationPlanReady) {
    return {
      allowed: false,
      from,
      to,
      reason: "validation_required is rejected without a validation plan.",
    };
  }

  if (to === "memory_pending" && !context.tribunalReady) {
    return {
      allowed: false,
      from,
      to,
      reason: "memory_pending is rejected without a Result Tribunal decision.",
    };
  }

  if (to === "orbit_assigned" && !context.publicBoundaryChecked) {
    return {
      allowed: false,
      from,
      to,
      reason: "public exposure is rejected without a public boundary check.",
    };
  }

  const fromIndex = COSMIC_LIFECYCLE.indexOf(from);
  const toIndex = COSMIC_LIFECYCLE.indexOf(to);

  return {
    allowed: toIndex === fromIndex + 1,
    from,
    to,
    reason:
      toIndex === fromIndex + 1
        ? "Lifecycle transition follows the governed sequence."
        : "Lifecycle transition skipped a required governed state.",
  };
}
