import "server-only";

import type { PlanetConstructionEvent } from "@/lib/server/planet-events";
import type { ConstructionSafetyGateDecision } from "./types";

const hardBlockedEventTypes = new Set<PlanetConstructionEvent["type"]>([
  "live_execution_requested",
  "real_money_requested",
  "broker_feed_activation_requested",
  "billing_activation_requested",
  "social_publish_requested",
  "product_truth_conflict",
  "guardian_blocked_action",
]);

const founderApprovalEventTypes = new Set<PlanetConstructionEvent["type"]>([
  "founder_approval_required",
  "partnership_claim_requested",
  "vip_claim_requested",
  "islamic_certification_claim_requested",
  "plan_copy_conflict",
]);

const validationRequired = [
  "npx tsc --noEmit",
  "npx eslint app modules tests --max-warnings=0",
  "npm run build",
  "npm run prisma:validate",
  "npm run test:regression",
  "npm run smoke:routes",
  "git diff --check",
];

export function evaluateConstructionSafetyGate(
  event: PlanetConstructionEvent,
  checkedAt = new Date().toISOString()
): ConstructionSafetyGateDecision {
  if (hardBlockedEventTypes.has(event.type)) {
    return {
      checkedAt,
      autonomyLevel: "blocked",
      reason: "The event touches a hard-blocked product truth boundary.",
      requiredReviews: event.requiredReviews,
      founderApprovalRequired: event.requiredReviews.includes("founder"),
      blockedReason: "launch/production/billing/live/broker/feed/social/real-money scope is forbidden",
      safeAlternative:
        "Convert the request into readiness documentation, a blocked-state explanation, or a validation-only task.",
      validationRequired,
    };
  }

  if (founderApprovalEventTypes.has(event.type) || event.riskLevel === "high") {
    return {
      checkedAt,
      autonomyLevel: "founder_approval_required",
      reason: "Sensitive plan, claim, partnership, or account wording requires Founder review.",
      requiredReviews: event.requiredReviews,
      founderApprovalRequired: true,
      blockedReason: null,
      safeAlternative:
        "Prepare a read-only draft with Guardian/Legal/Treasury context before any Founder decision.",
      validationRequired,
    };
  }

  if (event.riskLevel === "medium") {
    return {
      checkedAt,
      autonomyLevel: "review_required",
      reason: "UI, product copy, assistant behavior, or visual quality requires human review.",
      requiredReviews: event.requiredReviews,
      founderApprovalRequired: event.requiredReviews.includes("founder"),
      blockedReason: null,
      safeAlternative: "Draft a scoped task with screenshots/tests and keep execution manual.",
      validationRequired,
    };
  }

  return {
    checkedAt,
    autonomyLevel: event.type === "safe_docs_update_needed" ? "auto_draft_allowed" : "draft_only",
    reason: "Low-risk readiness/documentation work may be drafted but not externally executed.",
    requiredReviews: event.requiredReviews,
    founderApprovalRequired: false,
    blockedReason: null,
    safeAlternative: "Draft the smallest safe task and validate before any commit.",
    validationRequired,
  };
}
