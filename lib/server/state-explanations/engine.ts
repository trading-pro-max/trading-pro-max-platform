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
  resolvedBy: ProductStateExplanation["resolvedBy"],
  blockerType: ProductStateExplanation["blockerType"] = "safety",
  requiredConditionToUnblock = "A future reviewed product gate must explicitly clear this state.",
  whoCanUnblock: ProductStateExplanation["whoCanUnblock"] = "future_product",
  state: ProductStateExplanation["state"] = "blocked"
): ProductStateExplanation {
  return {
    key,
    title,
    shortMessage: title,
    reason,
    safeNextStep,
    severity,
    resolvedBy,
    blockerType,
    requiredConditionToUnblock,
    whoCanUnblock,
    state,
    userCopy: `${title}. ${safeNextStep}`,
    internalCopy: `${reason} Resolution owner: ${resolvedBy}.`,
  };
}

const explanations: ProductStateExplanation[] = [
  explanation("loading", "Loading state", "info", "The product is waiting for a bounded local or backend response.", "Wait or refresh if the state persists.", "user", "future_scope", "The expected response finishes or the route is refreshed.", "user", "planned"),
  explanation("empty", "Nothing to show yet", "info", "No relevant local or backend records exist for this surface.", "Continue using the paper-safe workflow.", "user", "future_scope", "New local or backend records exist.", "user", "planned"),
  explanation("auth_required", "Sign-in required", "warning", "The route or state is protected by account session guard.", "Sign in with a valid account.", "user", "auth", "A valid account session exists.", "user", "review_required"),
  explanation("no_access", "No access", "blocked", "The current account is not entitled or authorized.", "Use an allowed account or request operator review.", "operator", "auth", "Operator-approved entitlement or authorized access exists.", "operator", "blocked"),
  explanation("blocked", "Action blocked", "blocked", "A safety, auth, legal, or configuration gate blocks the action.", "Read the reason and use the safe alternative.", "operator", "safety", "The relevant safety gate is remediated and reviewed.", "operator", "blocked"),
  explanation("fallback", "Fallback active", "warning", "A live or external provider is not configured, so a safe fallback is used.", "Treat values as fallback/paper context.", "external_configuration", "feed", "A real configured provider is available and validated outside Git.", "external_provider", "not_configured"),
  explanation("degraded", "Degraded state", "warning", "A subsystem is operating with limited confidence or missing external support.", "Review diagnostics and continue only in paper-safe mode.", "operator", "production", "The degraded dependency is recovered and validated.", "operator", "review_required"),
  explanation("not_configured", "Not configured", "warning", "A real external service or secret is missing.", "Configure real values outside Git before claiming readiness.", "external_configuration", "production", "External configuration exists and is validated without exposing secrets.", "external_provider", "not_configured"),
  explanation("coming_later", "Coming later", "info", "The capability is planned but not built or entitled.", "Use current safe capabilities only.", "future_scope", "future_scope", "The future product scope is built, reviewed, and entitled.", "future_product", "planned"),
  explanation("protected_route", "Protected route", "warning", "The API is intentionally guarded.", "Authenticate or keep the route closed.", "operator", "auth", "Authentication and route permissions allow access.", "operator", "review_required"),
  explanation("invalid_input", "Invalid input", "error", "The submitted value does not match the safe schema.", "Correct the input and try again.", "user", "safety", "Input satisfies the route schema.", "user", "review_required"),
  explanation("session_expired", "Session expired", "warning", "The account session is missing or expired.", "Sign in again.", "user", "auth", "A fresh valid session exists.", "user", "review_required"),
  explanation("feedback_failed", "Feedback not submitted", "error", "Feedback could not be saved or the route is guarded.", "Try again after sign-in or route recovery.", "user", "production", "Feedback route and account state are available.", "operator", "review_required"),
  explanation("execution_blocked", "Execution blocked", "blocked", "Execution guardrails prevent live or unsafe routing.", "Use paper-only simulation.", "operator", "safety", "Future legal, broker, risk, and Founder gates explicitly support live execution.", "founder", "blocked"),
  explanation("live_disabled", "Live disabled", "blocked", "Live execution is disabled by product truth.", "Do not attempt live trading in this build.", "founder", "safety", "Future legal/configuration gates exist and Founder approval is auditable.", "founder", "blocked"),
  explanation("real_money_blocked", "Real money blocked", "blocked", "Real-money routing is hard-blocked and no broker/cash route is active.", "Use paper mode only; do not present funding or cash routing.", "founder", "safety", "Future broker, legal, custody, consent, and Founder approval gates exist.", "founder", "blocked"),
  explanation("broker_activation_blocked", "Broker activation blocked", "blocked", "Broker activation is not configured or approved.", "Keep broker activation in readiness-only state.", "founder", "broker", "A real broker integration is legally reviewed, configured, and audited.", "founder", "blocked"),
  explanation("broker_unavailable", "Broker unavailable", "blocked", "No broker is configured for live routing.", "Keep broker status unconfigured/blocked.", "external_configuration", "broker", "A real broker provider is configured and validated outside Git.", "external_provider", "not_configured"),
  explanation("live_feed_unavailable", "Live feed unavailable", "warning", "No live external feed is configured.", "Keep market context fallback-labeled.", "external_configuration", "feed", "A real feed provider is configured, validated, and disclosed.", "external_provider", "not_configured"),
  explanation("feed_fallback", "Feed fallback", "warning", "External live feed is not active.", "Use fallback-labeled market context.", "external_configuration", "feed", "Feed integration is configured and validated.", "external_provider", "not_configured"),
  explanation("billing_inactive", "Billing inactive", "blocked", "No checkout or subscription system is active.", "Do not present paid activation.", "founder", "billing", "A reviewed billing system, terms, and entitlement logic exist.", "founder", "blocked"),
  explanation("pro_locked", "Pro locked", "blocked", "Pro entitlement and billing are not active.", "Keep Pro features planned/locked.", "founder", "plan", "Real entitlement logic and billing gates are approved.", "founder", "planned"),
  explanation("vip_locked", "VIP locked", "blocked", "VIP entitlement is not active.", "Keep VIP capability planned/locked.", "founder", "plan", "VIP entitlement, billing, support, and safety gates are implemented.", "founder", "planned"),
  explanation("institutional_future", "Institutional future", "info", "Institutional support is future planned and not available in the current product.", "Treat Institutional capabilities as future roadmap only.", "future_scope", "plan", "A future institutional product scope is built, reviewed, entitled, and clearly released.", "future_product", "planned"),
  explanation("islamic_review_required", "Islamic review required", "warning", "Islamic/Sharia status is not certified by default.", "Use not-certified/review-required wording.", "founder", "legal", "Real qualified review exists for the exact account wording.", "founder", "review_required"),
  explanation("islamic_certification_not_certified", "Islamic certification not certified", "blocked", "No Sharia certification is claimed or present.", "Do not use certified wording.", "founder", "legal", "Real certification exists and is documented before public claims.", "founder", "not_certified"),
  explanation("launch_not_active", "Launch not active", "blocked", "Public launch has not been approved or released.", "Keep launch claims blocked.", "founder", "launch", "Staging, production, legal, monitoring, and Founder gates pass.", "founder", "blocked"),
  explanation("media_publishing_blocked", "Media publishing blocked", "blocked", "Media can be drafted internally only; publishing needs Guardian, Legal, and Founder review.", "Keep content in draft/review state.", "founder", "legal", "Publishing channels are configured and approvals are auditable.", "founder", "blocked"),
  explanation("ai_video_publishing_blocked", "AI video publishing blocked", "blocked", "AI video output may be scripted internally but cannot publish externally.", "Keep video drafts internal.", "founder", "legal", "Video generation, rights, review, and publishing gates exist.", "founder", "blocked"),
  explanation("social_publishing_inactive", "Social publishing inactive", "blocked", "No social accounts, publishing tokens, or external posting workflow is connected.", "Keep content in internal draft/review state.", "founder", "legal", "Social account registry, tokens, approvals, and audits exist outside Git.", "founder", "blocked"),
  explanation("social_accounts_unconnected", "Social accounts unconnected", "blocked", "No real social accounts are connected.", "Do not claim followers, posting, or connected channels.", "founder", "legal", "Real accounts are connected and explicitly approved later.", "founder", "not_configured"),
  explanation("performance_fee_hidden", "Performance fee hidden", "blocked", "Performance-based revenue is hidden/inactive and not user-facing.", "Keep current fee at 0% and do not expose fee UI.", "founder", "billing", "Legal/regulatory review, consent, billing, and Founder approval exist.", "founder", "hidden"),
  explanation("assistant_intent_restricted", "Assistant intent restricted", "blocked", "The requested assistant intent could imply trading execution, financial advice, or unsafe activation.", "Use educational, diagnostic, or paper-safe guidance instead.", "operator", "safety", "The intent is rewritten into a safe explanation or future reviewed capability.", "operator", "blocked"),
  explanation("founder_command_private", "Restricted controls are separate", "blocked", "Restricted controls are not a normal product route or plan feature.", "Keep restricted controls hidden from public navigation until private auth exists.", "founder", "owner_private", "Private device auth, step-up confirmation, and audit gates exist.", "founder", "hidden"),
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
