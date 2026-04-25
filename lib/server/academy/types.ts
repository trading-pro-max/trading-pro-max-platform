import "server-only";

export type AcademyPlanLayer = "free" | "pro" | "vip" | "institutional";

export type AcademyReadinessState =
  | "active_foundation"
  | "planned"
  | "future"
  | "blocked_by_design";

export type AcademyLessonKey =
  | "platform_basics"
  | "paper_trading_basics"
  | "chart_basics"
  | "why_blocked"
  | "tpm_assistant_guide"
  | "journal_coach_guide"
  | "risk_safety_lessons";

export type AcademyLearningPath = {
  id: string;
  planLayer: AcademyPlanLayer;
  label: string;
  state: AcademyReadinessState;
  purpose: string;
  lessons: AcademyLessonKey[];
  visibleToUser: boolean;
  accessTruth: string;
  mustNotClaim: string[];
};

export type AcademyReadinessSnapshot = {
  checkedAt: string;
  mode: "academy_readiness";
  status: "ready";
  learningPaths: AcademyLearningPath[];
  lessons: Array<{
    key: AcademyLessonKey;
    label: string;
    purpose: string;
    safetyRule: string;
  }>;
  planAccess: {
    free: "foundation_visible";
    pro: "planned_not_active";
    vip: "planned_not_active";
    institutional: "future";
  };
  safety: {
    educationalOnly: true;
    financialAdvice: false;
    tradingSignals: false;
    guaranteedProfitClaims: false;
    fakePlanActivation: false;
    guardianReviewRequired: true;
    legalClaimReviewRequired: true;
  };
  truth: {
    fakeUsers: false;
    fakeProgressMetrics: false;
    billingActive: false;
    liveExecutionActive: false;
    realMoneyActive: false;
    copyTradingActive: false;
    socialAccountsConnected: false;
    founderCommandPublic: false;
  };
};
