import "server-only";

import type {
  CosmicEvent,
  GravityAssignment,
  OrbitDefinition,
  OrbitPath,
} from "./types";

export const COSMIC_ORBITS: Record<OrbitPath, OrbitDefinition> = {
  public_ui_orbit: {
    orbitPath: "public_ui_orbit",
    purpose:
      "Keep public Trading Pro Max surfaces clean, user-facing, and free of private command language.",
    allowedEvents: ["public_ui_crowded", "internal_term_leaked", "support_missing"],
    forbiddenEvents: ["live_execution_requested", "billing_requested", "secret_risk"],
    ownerPlanets: ["earth_public_world"],
    satellites: [
      "public_ui_satellite",
      "public_boundary_satellite",
      "product_truth_satellite",
    ],
    stations: ["public_ux_station", "diagnostics_station"],
    requiredReviews: ["public boundary review", "Product Truth review"],
    validation: ["public UI leak scan", "regression test", "smoke route test"],
    memoryUpdate: "Record public/private boundary and surface clarity lessons.",
  },
  visual_identity_orbit: {
    orbitPath: "visual_identity_orbit",
    purpose:
      "Route identity, logo, Earth mark, and visual acceptance work through code-only brand systems.",
    allowedEvents: ["logo_rejected", "generic_founder_idea"],
    forbiddenEvents: ["billing_requested", "live_execution_requested"],
    ownerPlanets: ["visual_identity_planet"],
    satellites: [
      "logo_satellite",
      "screenshot_satellite",
      "product_truth_satellite",
    ],
    stations: ["design_station", "founder_review_station"],
    requiredReviews: ["Ahmad visual acceptance", "no-images check"],
    validation: ["visual proof", "no raster asset scan", "accessibility review"],
    memoryUpdate: "Record accepted and rejected identity patterns.",
  },
  chart_workspace_orbit: {
    orbitPath: "chart_workspace_orbit",
    purpose:
      "Protect chart-first workstation comfort, contrast, density, and paper-safe workspace truth.",
    allowedEvents: ["chart_annoying", "generic_founder_idea"],
    forbiddenEvents: ["live_execution_requested", "billing_requested"],
    ownerPlanets: ["trading_workspace_planet"],
    satellites: ["chart_satellite", "workstation_satellite", "screenshot_satellite"],
    stations: ["chart_station", "diagnostics_station"],
    requiredReviews: ["chart comfort review", "workstation proof"],
    validation: ["desktop screenshot", "dark workstation screenshot", "route smoke"],
    memoryUpdate: "Record chart comfort and clutter lessons.",
  },
  assistant_orbit: {
    orbitPath: "assistant_orbit",
    purpose:
      "Route TPM Assistant behavior while preventing signals, guarantees, and hidden internal exposure.",
    allowedEvents: ["generic_founder_idea", "internal_term_leaked"],
    forbiddenEvents: ["live_execution_requested", "secret_risk"],
    ownerPlanets: ["assistant_planet"],
    satellites: ["assistant_satellite", "product_truth_satellite"],
    stations: ["assistant_station"],
    requiredReviews: ["financial advice safety review", "public language review"],
    validation: ["assistant regression", "blocked state copy test"],
    memoryUpdate: "Record safe Assistant behavior lessons.",
  },
  journal_coach_orbit: {
    orbitPath: "journal_coach_orbit",
    purpose:
      "Route Journal and Coach reflection depth without advice, profit promise, or outcome guarantee.",
    allowedEvents: ["generic_founder_idea"],
    forbiddenEvents: ["live_execution_requested"],
    ownerPlanets: ["journal_coach_planet"],
    satellites: ["product_truth_satellite", "memory_satellite"],
    stations: ["assistant_station", "memory_station"],
    requiredReviews: ["no financial advice review"],
    validation: ["journal coach regression", "product truth scan"],
    memoryUpdate: "Record coaching depth and safety lessons.",
  },
  plans_realms_orbit: {
    orbitPath: "plans_realms_orbit",
    purpose:
      "Route Free, Pro, VIP, and Institutional realm truth without fake activation.",
    allowedEvents: ["generic_founder_idea", "public_ui_crowded"],
    forbiddenEvents: ["billing_requested", "live_execution_requested"],
    ownerPlanets: ["plans_realm_planet"],
    satellites: ["product_truth_satellite", "public_boundary_satellite"],
    stations: ["plan_realm_station"],
    requiredReviews: ["entitlement truth review", "billing inactive review"],
    validation: ["plan realm regression", "public copy scan"],
    memoryUpdate: "Record plan truth and entitlement lessons.",
  },
  apps_support_orbit: {
    orbitPath: "apps_support_orbit",
    purpose:
      "Route Apps / Platforms and Support readiness without claiming live external operations.",
    allowedEvents: ["support_missing", "generic_founder_idea"],
    forbiddenEvents: ["billing_requested", "live_execution_requested"],
    ownerPlanets: ["apps_support_planet", "academy_community_planet"],
    satellites: ["public_ui_satellite", "product_truth_satellite"],
    stations: ["support_station", "public_ux_station"],
    requiredReviews: ["public readiness review"],
    validation: ["public surface regression", "route smoke"],
    memoryUpdate: "Record support and app/platform readiness lessons.",
  },
  security_orbit: {
    orbitPath: "security_orbit",
    purpose:
      "Route auth, public boundary, security, incident, and defensive readiness events.",
    allowedEvents: ["internal_term_leaked", "secret_risk", "generic_founder_idea"],
    forbiddenEvents: ["billing_requested", "live_execution_requested"],
    ownerPlanets: ["defense_universe"],
    satellites: ["security_satellite", "public_boundary_satellite"],
    stations: ["security_station", "founder_review_station"],
    requiredReviews: ["security review", "incident readiness review"],
    validation: ["security regression", "no secret exposure scan"],
    memoryUpdate: "Record defensive security and public boundary lessons.",
  },
  secrets_orbit: {
    orbitPath: "secrets_orbit",
    purpose:
      "Route secret presence-only readiness and block raw secret exposure.",
    allowedEvents: ["secret_risk", "generic_founder_idea"],
    forbiddenEvents: ["live_execution_requested", "billing_requested"],
    ownerPlanets: ["secrets_authority", "defense_universe"],
    satellites: ["secrets_satellite", "security_satellite"],
    stations: ["secrets_station", "security_station"],
    requiredReviews: ["secrets authority review", "evidence-safe review"],
    validation: ["secret pattern scan", "no raw value check"],
    memoryUpdate: "Record secrets safety lessons without raw values.",
  },
  codex_construction_orbit: {
    orbitPath: "codex_construction_orbit",
    purpose:
      "Route build tasks through Task Passport, Codex License, validation, tribunal, and memory.",
    allowedEvents: ["codex_task_needed", "generic_founder_idea"],
    forbiddenEvents: ["secret_risk", "live_execution_requested"],
    ownerPlanets: ["construction_universe"],
    satellites: ["validation_satellite", "memory_satellite"],
    stations: ["codex_station", "tribunal_station"],
    requiredReviews: ["Task Passport", "Codex License", "Result Tribunal"],
    validation: ["TypeScript", "ESLint", "build", "regression", "smoke routes"],
    memoryUpdate: "Record task distribution and validation lessons.",
  },
  media_world_interface_orbit: {
    orbitPath: "media_world_interface_orbit",
    purpose:
      "Route external channels as readiness-only without sending, posting, tokens, or publishing.",
    allowedEvents: ["world_interface_request", "generic_founder_idea"],
    forbiddenEvents: ["billing_requested", "live_execution_requested", "secret_risk"],
    ownerPlanets: ["world_interface_planet", "media_planet"],
    satellites: ["world_interface_satellite", "security_satellite"],
    stations: ["world_interface_station", "founder_review_station"],
    requiredReviews: ["Guardian review", "Legal review", "Founder review"],
    validation: ["no token check", "no sending/publishing check"],
    memoryUpdate: "Record world-interface readiness and quarantine lessons.",
  },
  memory_orbit: {
    orbitPath: "memory_orbit",
    purpose:
      "Route lessons, accepted patterns, rejected patterns, validation summaries, and local reports.",
    allowedEvents: ["generic_founder_idea", "local_day_report_needed"],
    forbiddenEvents: ["secret_risk", "live_execution_requested"],
    ownerPlanets: ["memory_universe"],
    satellites: ["memory_satellite", "validation_satellite"],
    stations: ["memory_station"],
    requiredReviews: ["safe memory review"],
    validation: ["no secrets", "no private sensitive data"],
    memoryUpdate: "Record safe memory lessons.",
  },
  local_day_orbit: {
    orbitPath: "local_day_orbit",
    purpose:
      "Route Moon cycle, local day, Founder review cadence, and end-of-day reporting.",
    allowedEvents: ["local_day_report_needed", "generic_founder_idea"],
    forbiddenEvents: ["billing_requested", "live_execution_requested"],
    ownerPlanets: ["moon_cycle_system"],
    satellites: ["local_day_satellite", "memory_satellite"],
    stations: ["founder_review_station", "memory_station"],
    requiredReviews: ["Founder review"],
    validation: ["daily report summary", "Product Truth status"],
    memoryUpdate: "Record local day cycle and report lessons.",
  },
  launch_forbidden_orbit: {
    orbitPath: "launch_forbidden_orbit",
    purpose:
      "Route forbidden launch, billing, live, broker/feed, real-money, social publishing, and fake-metric requests into blocked review.",
    allowedEvents: ["billing_requested", "live_execution_requested"],
    forbiddenEvents: [],
    ownerPlanets: [
      "solar_command",
      "defense_universe",
      "treasury_readiness_planet",
    ],
    satellites: ["product_truth_satellite", "security_satellite"],
    stations: ["security_station", "founder_review_station"],
    requiredReviews: ["Product Truth hard block", "Founder Command report"],
    validation: ["blocked state evidence", "no activation check"],
    memoryUpdate: "Record blocked activation and safe alternative lessons.",
  },
};

export function routeCosmicEvent(
  event: CosmicEvent,
  gravity: GravityAssignment
): OrbitDefinition {
  if (
    gravity.priority === "black_hole_forbidden" ||
    gravity.priority === "blocked_gravity"
  ) {
    return COSMIC_ORBITS.launch_forbidden_orbit;
  }

  return COSMIC_ORBITS[event.orbitPath];
}
