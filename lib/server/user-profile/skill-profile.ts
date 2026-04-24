import "server-only";

import type {
  GuidanceDepth,
  UserRiskProfile,
  UserSkillLevel,
  UserSkillProfileInput,
  UserSkillProfileSnapshot,
} from "./types";

function guidanceDepthForSkill(skillLevel: UserSkillLevel): GuidanceDepth {
  if (skillLevel === "professional") return "professional_summary";
  if (skillLevel === "advanced") return "structured_review";
  if (skillLevel === "intermediate") return "guided_context";
  return "plain_language";
}

function safeRiskProfile(input?: UserRiskProfile): UserRiskProfile {
  return input ?? "conservative";
}

export function getUserSkillProfileSnapshot(
  input: UserSkillProfileInput = {},
  checkedAt = new Date().toISOString()
): UserSkillProfileSnapshot {
  const skillLevel = input.skillLevel ?? "beginner";
  const riskProfile = safeRiskProfile(input.riskProfile);
  const guidanceDepth = guidanceDepthForSkill(skillLevel);

  return {
    checkedAt,
    mode: "user_skill_profile_foundation",
    source: input.skillLevel || input.riskProfile ? "declared_preference" : "safe_default",
    skillLevel,
    riskProfile,
    guidanceDepth,
    adaptation: {
      explanationDepth: guidanceDepth,
      assistantTone:
        skillLevel === "professional"
          ? "professional_context"
          : skillLevel === "advanced"
          ? "concise_operator"
          : "calm_educational",
      journalPromptLevel:
        skillLevel === "advanced" || skillLevel === "professional"
          ? "structured_review"
          : "basic_reflection",
      coachReminderLevel:
        riskProfile === "active" || riskProfile === "high_caution"
          ? "risk_first"
          : "paper_safe",
      warningStyle:
        skillLevel === "advanced" || skillLevel === "professional"
          ? "operator_compact"
          : "visible_compact",
    },
    boundaries: {
      encourageOvertrading: false,
      manipulateUser: false,
      promiseProfits: false,
      pushRiskyBehavior: false,
      gamblingStyleTriggers: false,
    },
  };
}
