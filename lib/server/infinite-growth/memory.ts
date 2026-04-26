import type { GrowthDomain, GrowthMemoryLesson } from "./types";

const ALL_DOMAINS: GrowthDomain[] = [
  "idea",
  "design",
  "docs",
  "tests",
  "audit",
  "memory",
  "safe_local_build",
  "public_ui",
  "assistant",
  "workspace",
  "media",
  "support",
  "data",
  "billing",
  "payments",
  "treasury",
  "tax",
  "accounting",
  "launch",
  "production",
  "social",
  "broker_feed",
  "live_execution",
  "real_money",
  "financial_services",
  "regulated_activity",
];

export const INFINITE_GROWTH_MEMORY_LESSONS: GrowthMemoryLesson[] = [
  {
    lessonId: "safe_creation_only",
    lesson: "Infinity is safe creation only.",
    appliesTo: ALL_DOMAINS,
    futureGuard: "Every growth request must distinguish creation from activation.",
    requiredTest: "Growth permit blocks unsafe activation while allowing docs/tests/design.",
    founderReviewNeeded: false,
  },
  {
    lessonId: "reality_is_gated",
    lesson: "Reality is gated before public users, data, money, claims, launch, production, or regulated activity.",
    appliesTo: ["public_ui", "data", "billing", "launch", "production", "financial_services", "regulated_activity"],
    futureGuard: "Reality-facing actions require Product Truth, privacy, legal, security, rollback, and Founder gates.",
    requiredTest: "Reality gates must return review_required, delayed, blocked, or black_hole when evidence is missing.",
    founderReviewNeeded: true,
  },
  {
    lessonId: "money_is_governed",
    lesson: "Money is governed and never executed from code.",
    appliesTo: ["billing", "payments", "treasury", "tax", "accounting"],
    futureGuard: "Require invoice, budget, reserve, tax/accounting readiness, and Founder approval.",
    requiredTest: "TreasuryGate blocks bank/card data and payment execution.",
    founderReviewNeeded: true,
  },
  {
    lessonId: "data_is_protected",
    lesson: "Data is protected; GPS and hidden precise tracking are blocked.",
    appliesTo: ["data", "public_ui", "assistant", "workspace"],
    futureGuard: "PrivacyGate must review collection and block precise hidden tracking.",
    requiredTest: "PrivacyGate blocks precise tracking and requires review for user data.",
    founderReviewNeeded: true,
  },
  {
    lessonId: "claims_are_reviewed",
    lesson: "Claims are reviewed before public, media, social, launch, or regulated use.",
    appliesTo: ["public_ui", "assistant", "media", "support", "social", "launch"],
    futureGuard: "ClaimsGate blocks profit, win-rate, fake availability, fake status, and fake partnerships.",
    requiredTest: "ClaimsGate blocks risky public claims.",
    founderReviewNeeded: true,
  },
  {
    lessonId: "regulated_activity_needs_review",
    lesson: "Financial activity is regulated and cannot activate without review.",
    appliesTo: ["broker_feed", "live_execution", "real_money", "financial_services", "regulated_activity"],
    futureGuard: "FinancialServicesGate requires Swiss legal/regulatory review if applicable.",
    requiredTest: "Regulated domains require review or are blocked until cleared.",
    founderReviewNeeded: true,
  },
  {
    lessonId: "founder_authority_final",
    lesson: "Founder authority is final for sensitive growth.",
    appliesTo: ALL_DOMAINS,
    futureGuard: "Sensitive growth must produce a Founder decision requirement.",
    requiredTest: "FounderFinalAuthorityGate requires Ahmad for money, data, media, launch, production, and regulated activity.",
    founderReviewNeeded: false,
  },
  {
    lessonId: "no_images_unless_explicit",
    lesson: "No images or raster assets unless explicitly requested.",
    appliesTo: ["design", "public_ui", "media", "safe_local_build"],
    futureGuard: "Source scans must reject png, jpg, webp, gif, video, and image generation paths.",
    requiredTest: "No images/raster assets scan.",
    founderReviewNeeded: false,
  },
  {
    lessonId: "no_internal_public_exposure",
    lesson: "Alkon, Infinite Growth, Swiss-law gravity, and internal governance stay private.",
    appliesTo: ["public_ui", "assistant", "support", "media"],
    futureGuard: "Public leak tests must block private terms.",
    requiredTest: "Public UI does not expose Infinite Growth or Alkon terms.",
    founderReviewNeeded: false,
  },
  {
    lessonId: "no_web_shell_codex_execution",
    lesson: "The web app cannot execute shell commands or run Codex directly.",
    appliesTo: ["safe_local_build", "audit", "tests", "assistant"],
    futureGuard: "No shell process APIs, direct Codex, payment, publishing, or external activation from web routes.",
    requiredTest: "Source scan rejects shell execution and direct external activation.",
    founderReviewNeeded: false,
  },
];

export function selectGrowthMemoryLesson(domain: GrowthDomain): GrowthMemoryLesson {
  return (
    INFINITE_GROWTH_MEMORY_LESSONS.find((lesson) =>
      lesson.appliesTo.includes(domain)
    ) ?? INFINITE_GROWTH_MEMORY_LESSONS[0]
  );
}
