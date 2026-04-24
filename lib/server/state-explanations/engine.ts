import "server-only";

import type {
  ProductStateExplanation,
  ProductStateExplanationKey,
  ProductStateExplanationSnapshot,
  ProductStateSeverity,
} from "./types";

function explanation(
  key: ProductStateExplanationKey,
  title: string,
  severity: ProductStateSeverity,
  reason: string,
  safeNextStep: string,
  resolvedBy: ProductStateExplanation["resolvedBy"]
): ProductStateExplanation {
  return {
    key,
    title,
    shortMessage: title,
    reason,
    safeNextStep,
    severity,
    resolvedBy,
    userCopy: `${title}. ${safeNextStep}`,
    internalCopy: `${reason} Resolution owner: ${resolvedBy}.`,
  };
}

const explanations: ProductStateExplanation[] = [
  explanation("loading", "Loading state", "info", "The product is waiting for a bounded local or backend response.", "Wait or refresh if the state persists.", "user"),
  explanation("empty", "Nothing to show yet", "info", "No relevant local or backend records exist for this surface.", "Continue using the paper-safe workflow.", "user"),
  explanation("auth_required", "Sign-in required", "warning", "The route or state is protected by account session guard.", "Sign in with a valid account.", "user"),
  explanation("no_access", "No access", "blocked", "The current account is not entitled or authorized.", "Use an allowed account or request operator review.", "operator"),
  explanation("blocked", "Action blocked", "blocked", "A safety, auth, legal, or configuration gate blocks the action.", "Read the reason and use the safe alternative.", "operator"),
  explanation("fallback", "Fallback active", "warning", "A live or external provider is not configured, so a safe fallback is used.", "Treat values as fallback/paper context.", "external_configuration"),
  explanation("degraded", "Degraded state", "warning", "A subsystem is operating with limited confidence or missing external support.", "Review diagnostics and continue only in paper-safe mode.", "operator"),
  explanation("not_configured", "Not configured", "warning", "A real external service or secret is missing.", "Configure real values outside Git before claiming readiness.", "external_configuration"),
  explanation("coming_later", "Coming later", "info", "The capability is planned but not built or entitled.", "Use current safe capabilities only.", "future_scope"),
  explanation("protected_route", "Protected route", "warning", "The API is intentionally guarded.", "Authenticate or keep the route closed.", "operator"),
  explanation("invalid_input", "Invalid input", "error", "The submitted value does not match the safe schema.", "Correct the input and try again.", "user"),
  explanation("session_expired", "Session expired", "warning", "The account session is missing or expired.", "Sign in again.", "user"),
  explanation("feedback_failed", "Feedback not submitted", "error", "Feedback could not be saved or the route is guarded.", "Try again after sign-in or route recovery.", "user"),
  explanation("execution_blocked", "Execution blocked", "blocked", "Execution guardrails prevent live or unsafe routing.", "Use paper-only simulation.", "operator"),
  explanation("live_disabled", "Live disabled", "blocked", "Live execution is disabled by product truth.", "Do not attempt live trading in this build.", "founder"),
  explanation("broker_unavailable", "Broker unavailable", "blocked", "No broker is configured for live routing.", "Keep broker status unconfigured/blocked.", "external_configuration"),
  explanation("feed_fallback", "Feed fallback", "warning", "External live feed is not active.", "Use fallback-labeled market context.", "external_configuration"),
  explanation("billing_inactive", "Billing inactive", "blocked", "No checkout or subscription system is active.", "Do not present paid activation.", "founder"),
  explanation("vip_locked", "VIP locked", "blocked", "VIP entitlement is not active.", "Keep VIP capability planned/locked.", "founder"),
  explanation("islamic_review_required", "Islamic review required", "warning", "Islamic/Sharia status is not certified by default.", "Use not-certified/review-required wording.", "founder"),
  explanation("launch_not_active", "Launch not active", "blocked", "Public launch has not been approved or released.", "Keep launch claims blocked.", "founder"),
];

export function getStateExplanation(
  key: ProductStateExplanationKey
): ProductStateExplanation {
  return explanations.find((item) => item.key === key) ?? explanations[4];
}

export function getStateExplanationSnapshot(
  checkedAt = new Date().toISOString()
): ProductStateExplanationSnapshot {
  return {
    checkedAt,
    mode: "state_error_blocked_engine",
    explanations,
    truth: {
      rawJsonErrors: "blocked",
      fakeUnlocks: "blocked",
      scaryUnexplainedErrors: "blocked",
    },
  };
}
