import "server-only";

import type { CosmicEvent, RiskZoneDecision } from "./types";

export const RISK_BELT_RULES = [
  "secrets risk",
  "public internal leak",
  "suspicious world interface event",
  "risky legal or performance claim",
  "Guardian review required",
  "public boundary uncertainty",
];

export const BLACK_HOLE_RULES = [
  "live execution activation",
  "real-money routing",
  "broker/feed activation",
  "billing activation now",
  "production secrets",
  "social publishing automation",
  "sending secrets to Codex",
  "external attack/offensive actions",
  "fake users/revenue/metrics",
  "fake Sharia certification",
  "guaranteed profit/win-rate",
];

export function evaluateRiskZone(event: CosmicEvent): RiskZoneDecision {
  if (event.gravityPriority === "black_hole_forbidden") {
    return {
      zone: "black_hole_zone",
      status: "blocked",
      reason:
        "The event matches a hard-forbidden category and cannot advance to work execution.",
      safeAlternative:
        "Return a Founder Command report with the blocked reason, a Product Truth reminder, and a safe readiness-only alternative.",
      incidentReportRequired: event.type === "secret_risk",
    };
  }

  if (event.gravityPriority === "blocked_gravity") {
    return {
      zone: "risk_belt",
      status: "blocked",
      reason:
        "The event belongs to a future activation category that is blocked in local scope.",
      safeAlternative:
        "Keep the request as readiness-only planning and require legal/security/Product Truth gates before any real activation.",
      incidentReportRequired: false,
    };
  }

  if (
    event.type === "secret_risk" ||
    event.type === "internal_term_leaked" ||
    event.orbitPath === "media_world_interface_orbit" ||
    event.riskLevel === "critical"
  ) {
    return {
      zone: "risk_belt",
      status: "review_required",
      reason:
        "The event touches secrets, public/private boundary, external channels, or critical safety posture.",
      safeAlternative:
        "Quarantine the work into review-only status until Founder, security, and boundary checks pass.",
      incidentReportRequired: event.type === "secret_risk",
    };
  }

  return {
    zone: "clear_path",
    status: "allowed",
    reason:
      "The event can move through governed passport, validation, tribunal, and memory without activating forbidden systems.",
    safeAlternative:
      "Continue as local read-only build planning with Product Truth and public boundary checks.",
    incidentReportRequired: false,
  };
}
