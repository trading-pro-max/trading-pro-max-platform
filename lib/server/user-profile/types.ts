export type UserSkillLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "professional"
  | "learning_only";

export type UserRiskProfile =
  | "learning"
  | "conservative"
  | "balanced"
  | "active"
  | "high_caution";

export type GuidanceDepth =
  | "plain_language"
  | "guided_context"
  | "structured_review"
  | "professional_summary";

export type UserSkillProfileSnapshot = {
  checkedAt: string;
  mode: "user_skill_profile_foundation";
  source: "safe_default" | "declared_preference";
  skillLevel: UserSkillLevel;
  riskProfile: UserRiskProfile;
  guidanceDepth: GuidanceDepth;
  adaptation: {
    explanationDepth: GuidanceDepth;
    assistantTone: "calm_educational" | "concise_operator" | "professional_context";
    journalPromptLevel: "basic_reflection" | "structured_review" | "advanced_review_planned";
    coachReminderLevel: "paper_safe" | "risk_first" | "discipline_review";
    warningStyle: "visible_compact" | "operator_compact";
  };
  boundaries: {
    encourageOvertrading: false;
    manipulateUser: false;
    promiseProfits: false;
    pushRiskyBehavior: false;
    gamblingStyleTriggers: false;
  };
};

export type UserSkillProfileInput = Partial<{
  skillLevel: UserSkillLevel;
  riskProfile: UserRiskProfile;
}>;
