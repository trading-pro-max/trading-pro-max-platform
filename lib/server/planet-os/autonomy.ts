import "server-only";

export type MinistryAutonomyLevel =
  | "manual_only"
  | "assisted"
  | "auto_draft"
  | "auto_execute_safe"
  | "requires_review"
  | "requires_founder_approval"
  | "blocked";

export type MinistryAutonomyRule = {
  ministryId: string;
  ministryName: string;
  autonomyLevel: MinistryAutonomyLevel;
  allowedAutonomy: string[];
  blockedAutonomy: string[];
  reviewRequiredFor: string[];
  founderApprovalRequiredFor: string[];
  truth: string;
};

export type MinistryAutonomySnapshot = {
  checkedAt: string;
  mode: "ministry_autonomy_levels";
  rules: MinistryAutonomyRule[];
  truth: {
    dangerousAutonomy: "blocked";
    liveTradingAutonomy: "blocked";
    billingAutonomy: "blocked";
    mediaPublishingAutonomy: "blocked_without_approval";
    founderCommandDefault: "read_only";
  };
};

const rules: MinistryAutonomyRule[] = [
  {
    ministryId: "media_communications",
    ministryName: "Media & Communications",
    autonomyLevel: "auto_draft",
    allowedAutonomy: ["draft ideas", "classify risk", "prepare review packets"],
    blockedAutonomy: ["external publishing", "social posting", "fake metrics"],
    reviewRequiredFor: ["Pro/VIP claims", "AI capability claims", "launch wording"],
    founderApprovalRequiredFor: ["public campaign approval", "high-risk claim approval"],
    truth: "Media may draft internally only; sensitive publishing requires Guardian, Legal, and Founder approval.",
  },
  {
    ministryId: "justice_legal_compliance",
    ministryName: "Justice / Legal / Compliance",
    autonomyLevel: "requires_review",
    allowedAutonomy: ["classify wording", "block unsafe claims", "suggest safe language"],
    blockedAutonomy: ["claim legal certification", "replace qualified legal counsel"],
    reviewRequiredFor: ["public claims", "Islamic wording", "billing terms"],
    founderApprovalRequiredFor: ["launch wording", "commercial terms"],
    truth: "Legal Counsel is guidance only and does not certify compliance.",
  },
  {
    ministryId: "guardian_defense",
    ministryName: "Guardian & Defense",
    autonomyLevel: "requires_review",
    allowedAutonomy: ["flag abuse", "block dangerous attempts", "escalate incidents"],
    blockedAutonomy: ["invasive surveillance", "silent private-data monitoring"],
    reviewRequiredFor: ["false-positive risk", "community moderation escalations"],
    founderApprovalRequiredFor: ["high-risk policy changes"],
    truth: "Guardian protects boundaries without invasive surveillance.",
  },
  {
    ministryId: "engineering_infrastructure",
    ministryName: "Engineering & Infrastructure",
    autonomyLevel: "assisted",
    allowedAutonomy: ["suggest tasks", "run validation when requested", "prepare patches under review"],
    blockedAutonomy: ["autonomous code execution without instruction", "reverting user changes"],
    reviewRequiredFor: ["shared contracts", "security changes"],
    founderApprovalRequiredFor: ["production/deployment changes"],
    truth: "Engineering remains assisted and validation-bound.",
  },
  {
    ministryId: "treasury_economy",
    ministryName: "Treasury & Economy",
    autonomyLevel: "requires_founder_approval",
    allowedAutonomy: ["model plan value", "describe billing inactive truth"],
    blockedAutonomy: ["activate billing", "expose performance fee", "unlock paid access"],
    reviewRequiredFor: ["pricing language", "subscription roadmap"],
    founderApprovalRequiredFor: ["billing activation", "performance-fee research"],
    truth: "Treasury cannot activate billing or paid access.",
  },
  {
    ministryId: "markets_trading",
    ministryName: "Markets & Trading",
    autonomyLevel: "blocked",
    allowedAutonomy: ["paper-safe explanations", "fallback context labels"],
    blockedAutonomy: ["live trading", "real-money routing", "broker/feed activation"],
    reviewRequiredFor: ["future provider pilots"],
    founderApprovalRequiredFor: ["any future live/broker gate"],
    truth: "Trading autonomy is blocked for live and real-money actions.",
  },
  {
    ministryId: "ai_iq_brain",
    ministryName: "AI / IQ / Brain",
    autonomyLevel: "assisted",
    allowedAutonomy: ["state explanations", "education prompts", "paper-session summaries"],
    blockedAutonomy: ["trade execution", "profit promises", "prediction certainty"],
    reviewRequiredFor: ["VIP strategy review", "personalized performance analysis"],
    founderApprovalRequiredFor: ["high-risk assistant capability"],
    truth: "Companion and Brain provide safe responses only.",
  },
  {
    ministryId: "academy_education",
    ministryName: "Academy & Education",
    autonomyLevel: "auto_draft",
    allowedAutonomy: ["draft lessons", "glossary prompts", "paper training copy"],
    blockedAutonomy: ["financial advice", "gambling-style prompts"],
    reviewRequiredFor: ["strategy content", "performance examples"],
    founderApprovalRequiredFor: ["public education campaign"],
    truth: "Academy can draft safe education but cannot advise trades.",
  },
  {
    ministryId: "presidency_command",
    ministryName: "Presidency & Command",
    autonomyLevel: "manual_only",
    allowedAutonomy: ["read-only briefing", "next-action suggestions"],
    blockedAutonomy: ["approve actions alone", "override critical blocks", "publish or deploy"],
    reviewRequiredFor: ["approval queue changes", "command app access"],
    founderApprovalRequiredFor: ["all high-risk actions"],
    truth: "Founder Command remains read-only by default.",
  },
];

export function getMinistryAutonomySnapshot(
  checkedAt = new Date().toISOString()
): MinistryAutonomySnapshot {
  return {
    checkedAt,
    mode: "ministry_autonomy_levels",
    rules,
    truth: {
      dangerousAutonomy: "blocked",
      liveTradingAutonomy: "blocked",
      billingAutonomy: "blocked",
      mediaPublishingAutonomy: "blocked_without_approval",
      founderCommandDefault: "read_only",
    },
  };
}
