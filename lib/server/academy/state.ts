import "server-only";

import type {
  AcademyLearningPath,
  AcademyLessonKey,
  AcademyReadinessSnapshot,
} from "./types";

const lessons: AcademyReadinessSnapshot["lessons"] = [
  {
    key: "platform_basics",
    label: "Platform basics",
    purpose: "Introduce Trading Pro Max surfaces, plans, and paper-safe product truth.",
    safetyRule: "Keep public language simple and do not expose internal command systems.",
  },
  {
    key: "paper_trading_basics",
    label: "Paper trading basics",
    purpose: "Explain paper-mode rehearsal without implying live-money readiness.",
    safetyRule: "No live execution, broker routing, copy trading, or real-money instruction.",
  },
  {
    key: "chart_basics",
    label: "Chart basics",
    purpose: "Teach chart orientation, timeframes, watchlist context, and visual comfort.",
    safetyRule: "Do not present chart education as a signal or profit method.",
  },
  {
    key: "why_blocked",
    label: "Why Blocked",
    purpose: "Help users understand blocked live, billing, broker/feed, and plan states.",
    safetyRule: "Blocked states are product truth, not upgrade pressure.",
  },
  {
    key: "tpm_assistant_guide",
    label: "TPM Assistant guide",
    purpose: "Show safe Assistant use for orientation, reflection, and platform state help.",
    safetyRule: "Assistant cannot trade, predict guaranteed outcomes, or bypass safeguards.",
  },
  {
    key: "journal_coach_guide",
    label: "Journal / Coach guide",
    purpose: "Use reflection prompts for paper-session learning and feedback.",
    safetyRule: "No financial advice, health profiling, sensitive personal data, or pressure.",
  },
  {
    key: "risk_safety_lessons",
    label: "Risk and safety lessons",
    purpose: "Teach trust, scam awareness, plan truth, and local-only readiness boundaries.",
    safetyRule: "No guaranteed win-rate, fake screenshots, or performance claims.",
  },
];

function path(input: AcademyLearningPath): AcademyLearningPath {
  return input;
}

const basicLessons: AcademyLessonKey[] = [
  "platform_basics",
  "paper_trading_basics",
  "chart_basics",
  "why_blocked",
  "tpm_assistant_guide",
  "journal_coach_guide",
  "risk_safety_lessons",
];

const learningPaths: AcademyLearningPath[] = [
  path({
    id: "free-learning-path",
    planLayer: "free",
    label: "Free learning path",
    state: "active_foundation",
    purpose: "Give every local user a familiar paper-safe learning foundation.",
    lessons: basicLessons,
    visibleToUser: true,
    accessTruth: "Free learning foundation is visible as paper-safe readiness.",
    mustNotClaim: ["paid activation", "live trading", "signals", "profit outcomes"],
  }),
  path({
    id: "pro-learning-path",
    planLayer: "pro",
    label: "Pro learning path",
    state: "planned",
    purpose: "Prepare deeper workstation, workflow, and professional reflection paths.",
    lessons: ["chart_basics", "tpm_assistant_guide", "journal_coach_guide", "risk_safety_lessons"],
    visibleToUser: true,
    accessTruth: "Pro learning is planned and must not be shown as active unless entitled later.",
    mustNotClaim: ["Pro active", "paid access", "premium signals"],
  }),
  path({
    id: "vip-learning-path",
    planLayer: "vip",
    label: "VIP learning path",
    state: "planned",
    purpose: "Prepare advanced coaching, strategy review, and premium reports education.",
    lessons: ["chart_basics", "journal_coach_guide", "risk_safety_lessons"],
    visibleToUser: true,
    accessTruth: "VIP learning is planned and has no fake room or premium activation.",
    mustNotClaim: ["VIP active", "private room active", "guaranteed profit", "win-rate"],
  }),
  path({
    id: "institutional-learning-path",
    planLayer: "institutional",
    label: "Institutional learning path",
    state: "future",
    purpose: "Prepare team-ready education, audit concepts, and controlled onboarding later.",
    lessons: ["platform_basics", "risk_safety_lessons", "why_blocked"],
    visibleToUser: true,
    accessTruth: "Institutional learning is future-only.",
    mustNotClaim: ["Institutional available", "team access active", "certification"],
  }),
];

export function getAcademyReadinessSnapshot(
  checkedAt = new Date().toISOString()
): AcademyReadinessSnapshot {
  return {
    checkedAt,
    mode: "academy_readiness",
    status: "ready",
    learningPaths,
    lessons,
    planAccess: {
      free: "foundation_visible",
      pro: "planned_not_active",
      vip: "planned_not_active",
      institutional: "future",
    },
    safety: {
      educationalOnly: true,
      financialAdvice: false,
      tradingSignals: false,
      guaranteedProfitClaims: false,
      fakePlanActivation: false,
      guardianReviewRequired: true,
      legalClaimReviewRequired: true,
    },
    truth: {
      fakeUsers: false,
      fakeProgressMetrics: false,
      billingActive: false,
      liveExecutionActive: false,
      realMoneyActive: false,
      copyTradingActive: false,
      socialAccountsConnected: false,
      founderCommandPublic: false,
    },
  };
}
