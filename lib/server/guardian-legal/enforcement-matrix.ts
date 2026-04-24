import "server-only";

import type {
  GuardianLegalEnforcementMatrixSnapshot,
  GuardianLegalEnforcementRule,
} from "./types";

const rules: GuardianLegalEnforcementRule[] = [
  {
    id: "user-execution-bypass",
    subject: "user_action",
    outcome: "block",
    reason: "User actions cannot bypass live execution or real-money blocks.",
    severity: "critical",
    safeAlternative: "Use paper mode and show the why-blocked explanation.",
    productTruthLink: "live_execution",
    userFacingExplanationExists: true,
    runtimeTruth: "runtime_rule",
  },
  {
    id: "assistant-trade-signal",
    subject: "assistant_response",
    outcome: "block",
    reason: "Assistant responses must not provide guaranteed signals, win-rate claims, or execution instructions.",
    severity: "critical",
    safeAlternative: "Provide educational context and safe next steps only.",
    productTruthLink: "ai_prediction_claims",
    userFacingExplanationExists: true,
    runtimeTruth: "readiness_matrix",
  },
  {
    id: "media-sensitive-claim",
    subject: "media_content",
    outcome: "require_founder_approval",
    reason: "Media claims about Pro, VIP, AI, launch, broker/feed, billing, or Islamic accounts need Guardian and Legal review.",
    severity: "high",
    safeAlternative: "Keep content internal until reviewed and approved.",
    productTruthLink: "social_publishing",
    userFacingExplanationExists: true,
    runtimeTruth: "readiness_matrix",
  },
  {
    id: "vip-plan-claim",
    subject: "plan_claim",
    outcome: "require_review",
    reason: "VIP value may be described only as planned/locked unless entitlement exists.",
    severity: "high",
    safeAlternative: "Use VIP planned roadmap wording.",
    productTruthLink: "vip_activation",
    userFacingExplanationExists: true,
    runtimeTruth: "runtime_rule",
  },
  {
    id: "islamic-certification-claim",
    subject: "islamic_claim",
    outcome: "block",
    reason: "Sharia/Islamic certification is not certified by default.",
    severity: "critical",
    safeAlternative: "Use review-required or not-certified wording.",
    productTruthLink: "islamic_sharia_certification",
    userFacingExplanationExists: true,
    runtimeTruth: "runtime_rule",
  },
  {
    id: "live-trading-claim",
    subject: "live_trading_claim",
    outcome: "block",
    reason: "Live trading is blocked and cannot be claimed active.",
    severity: "critical",
    safeAlternative: "State paper-safe evaluation and blocked live execution.",
    productTruthLink: "live_execution",
    userFacingExplanationExists: true,
    runtimeTruth: "runtime_rule",
  },
  {
    id: "billing-claim",
    subject: "billing_claim",
    outcome: "block",
    reason: "Billing, checkout, subscription, and paid activation are inactive.",
    severity: "critical",
    safeAlternative: "Describe plans as readiness or planned tiers only.",
    productTruthLink: "billing_subscriptions",
    userFacingExplanationExists: true,
    runtimeTruth: "runtime_rule",
  },
  {
    id: "launch-claim",
    subject: "launch_claim",
    outcome: "block",
    reason: "Public launch is inactive and must remain a final gated decision.",
    severity: "critical",
    safeAlternative: "Use internal readiness wording only.",
    productTruthLink: "public_launch",
    userFacingExplanationExists: true,
    runtimeTruth: "runtime_rule",
  },
  {
    id: "community-abuse",
    subject: "community_content",
    outcome: "escalate_to_guardian",
    reason: "Community abuse, scams, spam, or deceptive performance content require Guardian review.",
    severity: "high",
    safeAlternative: "Hold for moderation and remove misleading claims.",
    productTruthLink: "community_readiness",
    userFacingExplanationExists: false,
    runtimeTruth: "readiness_matrix",
  },
  {
    id: "founder-sensitive-action",
    subject: "founder_action",
    outcome: "create_audit_event_later",
    reason: "Founder-sensitive actions require explicit confirmation and audit backing before execution exists.",
    severity: "high",
    safeAlternative: "Keep Founder Command read-only until owner auth and audit gates exist.",
    productTruthLink: "founder_command",
    userFacingExplanationExists: true,
    runtimeTruth: "readiness_matrix",
  },
];

export function getGuardianLegalEnforcementMatrixSnapshot(
  checkedAt = new Date().toISOString()
): GuardianLegalEnforcementMatrixSnapshot {
  return {
    checkedAt,
    mode: "guardian_legal_enforcement_matrix",
    rules,
    summary: {
      allow: rules.filter((rule) => rule.outcome === "allow").length,
      reviewOrApproval: rules.filter(
        (rule) =>
          rule.outcome === "require_review" ||
          rule.outcome === "require_founder_approval"
      ).length,
      blocked: rules.filter((rule) => rule.outcome === "block").length,
      escalations: rules.filter((rule) => rule.outcome.startsWith("escalate")).length,
    },
    truth: {
      invasiveSurveillance: false,
      fakeRuntimeEnforcementClaimed: false,
      secretsRequired: false,
      auditEvents: "defined_for_later",
    },
  };
}
