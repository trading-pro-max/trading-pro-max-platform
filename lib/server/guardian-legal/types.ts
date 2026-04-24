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

export type GuardianLegalEnforcementSubject =
  | "user_action"
  | "assistant_response"
  | "media_content"
  | "plan_claim"
  | "legal_claim"
  | "islamic_claim"
  | "live_trading_claim"
  | "billing_claim"
  | "launch_claim"
  | "community_content"
  | "founder_action";

export type GuardianLegalEnforcementOutcome =
  | "allow"
  | "caution"
  | "require_review"
  | "require_founder_approval"
  | "block"
  | "escalate_to_guardian"
  | "escalate_to_legal"
  | "create_audit_event_later";

export type GuardianLegalEnforcementRule = {
  id: string;
  subject: GuardianLegalEnforcementSubject;
  outcome: GuardianLegalEnforcementOutcome;
  reason: string;
  severity: "low" | "medium" | "high" | "critical";
  safeAlternative: string;
  productTruthLink: string;
  userFacingExplanationExists: boolean;
  runtimeTruth: "readiness_matrix" | "runtime_rule";
};

export type GuardianLegalEnforcementMatrixSnapshot = {
  checkedAt: string;
  mode: "guardian_legal_enforcement_matrix";
  rules: GuardianLegalEnforcementRule[];
  summary: {
    allow: number;
    reviewOrApproval: number;
    blocked: number;
    escalations: number;
  };
  truth: {
    invasiveSurveillance: false;
    fakeRuntimeEnforcementClaimed: false;
    secretsRequired: false;
    auditEvents: "defined_for_later";
  };
};
