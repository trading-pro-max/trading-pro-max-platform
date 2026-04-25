import "server-only";

import type {
  GuardianLegalCategory,
  GuardianLegalEvaluation,
  GuardianLegalRuleMatch,
  GuardianLegalRuleOutcome,
} from "./types";

const blockedRules: GuardianLegalRuleMatch[] = [
  {
    id: "guaranteed-profit",
    category: "product_claim",
    outcome: "blocked",
    pattern: "guaranteed profit",
    reason: "Profit guarantees are deceptive and forbidden.",
    safeAlternative: "Use no-guarantee, paper-only, and decision-support wording.",
  },
  {
    id: "win-rate",
    category: "product_claim",
    outcome: "blocked",
    pattern: "win-rate",
    reason: "Win-rate claims require evidence and may mislead users.",
    safeAlternative: "Describe context quality without outcome promises.",
  },
  {
    id: "risk-free",
    category: "product_claim",
    outcome: "blocked",
    pattern: "risk-free",
    reason: "Trading cannot be represented as risk-free.",
    safeAlternative: "Use risk disclosure and paper training language.",
  },
  {
    id: "sure-signal",
    category: "product_claim",
    outcome: "blocked",
    pattern: "sure signal",
    reason: "Certain signal language overclaims AI or market capability.",
    safeAlternative: "Use bounded signal/context language.",
  },
  {
    id: "fake-live",
    category: "product_claim",
    outcome: "blocked",
    pattern: "live trading active",
    reason: "Live execution is blocked in current product truth.",
    safeAlternative: "State that live execution is blocked and paper mode is active.",
  },
  {
    id: "fake-billing",
    category: "product_claim",
    outcome: "blocked",
    pattern: "billing active",
    reason: "Billing and checkout are inactive.",
    safeAlternative: "Describe plans as roadmap/locked until billing exists.",
  },
  {
    id: "fake-broker-feed",
    category: "product_claim",
    outcome: "blocked",
    pattern: "broker connected",
    reason: "Broker/feed activation is unconfigured and guarded.",
    safeAlternative: "State that broker/feed activation is not configured.",
  },
  {
    id: "fake-public-launch",
    category: "product_claim",
    outcome: "blocked",
    pattern: "public launch active",
    reason: "Public launch is not active in current product truth.",
    safeAlternative: "Use internal readiness or not-launched wording.",
  },
  {
    id: "fake-vip-guarantee",
    category: "product_claim",
    outcome: "blocked",
    pattern: "VIP guarantees",
    reason: "VIP cannot imply guaranteed outcomes or active paid access.",
    safeAlternative: "Mark VIP as planned/locked and avoid outcome promises.",
  },
  {
    id: "fake-institutional-active",
    category: "product_claim",
    outcome: "blocked",
    pattern: "institutional active",
    reason: "Institutional is future planned and cannot be claimed active.",
    safeAlternative: "Describe Institutional as future planned only.",
  },
  {
    id: "fake-institutional-available",
    category: "product_claim",
    outcome: "blocked",
    pattern: "institutional available",
    reason: "Institutional availability is not active in current product truth.",
    safeAlternative: "Use future Institutional roadmap wording only.",
  },
  {
    id: "fake-islamic-certification",
    category: "product_claim",
    outcome: "blocked",
    pattern: "sharia certified",
    reason: "Islamic/Sharia certification is not claimed by default.",
    safeAlternative: "Use review required or not certified wording.",
  },
  {
    id: "financial-advice",
    category: "product_claim",
    outcome: "blocked",
    pattern: "financial advice",
    reason: "The platform must not claim to provide financial advice.",
    safeAlternative: "Use education and decision-support wording.",
  },
  {
    id: "legal-advice",
    category: "product_claim",
    outcome: "blocked",
    pattern: "legal advice",
    reason: "The platform must not claim to provide legal advice.",
    safeAlternative: "Use review-required or legal-review wording.",
  },
  {
    id: "fake-performance-fee",
    category: "product_claim",
    outcome: "blocked",
    pattern: "performance fee active",
    reason: "Performance-based revenue is hidden/inactive and future-review only.",
    safeAlternative: "State that current performance fee is 0% and future research requires review.",
  },
  {
    id: "fake-swiss-company-status",
    category: "product_claim",
    outcome: "blocked",
    pattern: "swiss company",
    reason: "Swiss inspiration must not imply Swiss legal/company registration.",
    safeAlternative: "Use Swiss-inspired precision or Swiss-style discipline wording only.",
  },
  {
    id: "uncontracted-company-assets",
    category: "product_claim",
    outcome: "blocked",
    pattern: "official partner",
    reason: "Company names, sponsorships, partnerships, and assets require real contracts.",
    safeAlternative: "Use internal partnership readiness wording until contracts exist.",
  },
  {
    id: "copied-competitor-content",
    category: "copied_competitor_content",
    outcome: "blocked",
    pattern: "copy competitor",
    reason: "Copied competitor content or identity is forbidden.",
    safeAlternative: "Create original Trading Pro Max wording and visual direction.",
  },
  {
    id: "ai-prediction-overclaim",
    category: "product_claim",
    outcome: "blocked",
    pattern: "AI predicts with certainty",
    reason: "AI/IQ may assist context but cannot promise certain market prediction.",
    safeAlternative: "Use bounded decision-support wording.",
  },
];

const reviewRules: GuardianLegalRuleMatch[] = [
  {
    id: "vip-claim",
    category: "product_claim",
    outcome: "founder_approval_required",
    pattern: "VIP",
    reason: "VIP wording can imply paid or premium capability.",
    safeAlternative: "Mark VIP as planned/locked unless entitlement exists.",
  },
  {
    id: "launch-claim",
    category: "product_claim",
    outcome: "founder_approval_required",
    pattern: "launch",
    reason: "Launch wording requires all gates and private approval.",
    safeAlternative: "Use internal readiness or not-launched wording.",
  },
];

const categoryOutcomes: Record<GuardianLegalCategory, GuardianLegalRuleOutcome> = {
  auth_abuse: "review_required",
  api_abuse: "review_required",
  entitlement_bypass: "blocked",
  prompt_injection: "review_required",
  feedback_spam: "caution",
  media_abuse: "founder_approval_required",
  community_abuse: "review_required",
  execution_bypass: "blocked",
  data_scraping: "review_required",
  copied_competitor_content: "blocked",
  product_claim: "allowed",
};

function outcomeRank(outcome: GuardianLegalRuleOutcome) {
  return {
    allowed: 0,
    caution: 1,
    review_required: 2,
    founder_approval_required: 3,
    blocked: 4,
  }[outcome];
}

function strongestOutcome(outcomes: GuardianLegalRuleOutcome[]) {
  return outcomes.reduce<GuardianLegalRuleOutcome>(
    (strongest, outcome) =>
      outcomeRank(outcome) > outcomeRank(strongest) ? outcome : strongest,
    "allowed"
  );
}

export function evaluateGuardianLegalRules(input: {
  text?: string;
  category?: GuardianLegalCategory;
} = {}): GuardianLegalEvaluation {
  const text = input.text?.toLowerCase() ?? "";
  const inputCategory = input.category ?? "product_claim";
  const matches = [...blockedRules, ...reviewRules].filter((rule) =>
    text.includes(rule.pattern.toLowerCase())
  );
  const categoryOutcome = categoryOutcomes[inputCategory];

  return {
    checkedAt: new Date().toISOString(),
    mode: "guardian_legal_rules_engine",
    inputCategory,
    outcome: strongestOutcome([categoryOutcome, ...matches.map((match) => match.outcome)]),
    matches,
    privacyTruth: {
      invasiveSurveillance: false,
      privateDataRequired: false,
      secretExposure: false,
    },
  };
}
