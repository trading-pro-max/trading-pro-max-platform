export type GuardianLegalCategory =
  | "auth_abuse"
  | "api_abuse"
  | "entitlement_bypass"
  | "prompt_injection"
  | "feedback_spam"
  | "media_abuse"
  | "community_abuse"
  | "execution_bypass"
  | "data_scraping"
  | "copied_competitor_content"
  | "product_claim";

export type GuardianLegalRuleOutcome =
  | "allowed"
  | "caution"
  | "review_required"
  | "founder_approval_required"
  | "blocked";

export type GuardianLegalRuleMatch = {
  id: string;
  category: GuardianLegalCategory;
  outcome: GuardianLegalRuleOutcome;
  pattern: string;
  reason: string;
  safeAlternative: string;
};

export type GuardianLegalEvaluation = {
  checkedAt: string;
  mode: "guardian_legal_rules_engine";
  inputCategory: GuardianLegalCategory;
  outcome: GuardianLegalRuleOutcome;
  matches: GuardianLegalRuleMatch[];
  privacyTruth: {
    invasiveSurveillance: false;
    privateDataRequired: false;
    secretExposure: false;
  };
};
