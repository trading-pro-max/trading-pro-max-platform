import { createDecisionPermit } from "./decision-permit";
import { reviewFinancialLegitimacy } from "./financial-legitimacy";
import { reviewFounderResponsibility } from "./founder-responsibility";
import { reviewLegalGuardianLegitimacy } from "./legal-guardian-legitimacy";
import { reviewPurposeLegitimacy } from "./purpose-legitimacy";
import { reviewReputationLegitimacy } from "./reputation-legitimacy";
import { reviewReversibilityLegitimacy } from "./reversibility-legitimacy";
import { reviewSecurityLegitimacy } from "./security-legitimacy";
import { reviewTimingLegitimacy } from "./timing-legitimacy";
import { reviewTruthLegitimacy } from "./truth-legitimacy";
import { reviewUserLegitimacy } from "./user-legitimacy";
import type {
  AlkonLegitimacyDecision,
  AlkonLegitimacyDecisionOutcome,
  AlkonLegitimacyRequest,
  AlkonMemoryLegitimacyLesson,
} from "./types";

function decisionOutcomeFromPermit(
  permitOutcome: AlkonLegitimacyDecision["permit"]["outcome"]
): AlkonLegitimacyDecisionOutcome {
  switch (permitOutcome) {
    case "permit_black_holed":
      return "black_holed";
    case "permit_blocked":
      return "blocked";
    case "permit_delayed_until_ready":
      return "delayed_until_ready";
    case "permit_founder_approval_required":
      return "founder_approval_required";
    case "permit_review_required":
      return "legitimate_with_review";
    default:
      return "legitimate";
  }
}

function createMemoryLesson(
  request: AlkonLegitimacyRequest,
  permitOutcome: AlkonLegitimacyDecision["permit"]["outcome"]
): AlkonMemoryLegitimacyLesson {
  return {
    lessonId: `legitimacy_${request.actionCategory}`,
    appliesTo: [request.actionCategory],
    lesson:
      permitOutcome === "permit_black_holed" || permitOutcome === "permit_blocked"
        ? "Possible authority is not legitimate when Product Truth, safety, finance, legal, reputation, or timing fail."
        : "Legitimate actions remain report/draft/readiness-only until required reviews and Founder responsibility are clear.",
    futureGuard:
      "Re-run sovereign legitimacy before accepting sensitive Founder, treasury, media, launch, security, or public claim actions.",
    containsSecrets: false,
    containsBankCardData: false,
  };
}

export function evaluateAlkonLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonLegitimacyDecision {
  const reviews = [
    reviewPurposeLegitimacy(request),
    reviewTruthLegitimacy(request),
    reviewUserLegitimacy(request),
    reviewFinancialLegitimacy(request),
    reviewSecurityLegitimacy(request),
    reviewTimingLegitimacy(request),
    reviewReversibilityLegitimacy(request),
    reviewReputationLegitimacy(request),
    reviewLegalGuardianLegitimacy(request),
    reviewFounderResponsibility(request),
  ];
  const permit = createDecisionPermit(request, reviews);
  const outcome = decisionOutcomeFromPermit(permit.outcome);
  const memoryLesson = createMemoryLesson(request, permit.outcome);
  const founderReviewNeeded = [
    ...permit.requiredReviews,
    ...reviews
      .filter((review) => review.outcome === "founder_approval_required")
      .map((review) => `${review.dimension}: ${review.reason}`),
  ];

  return {
    request,
    outcome,
    authorityLevel: permit.authorityLevel,
    riskLevel: permit.riskLevel,
    reviews,
    permit,
    report: {
      reportId: `legitimacy_report_${request.actionCategory}`,
      title: request.title,
      summary: permit.legitimacySummary,
      decision: outcome,
      founderResponsibility:
        founderReviewNeeded.length > 0
          ? "Explicit Founder responsibility is required before this can move beyond readiness."
          : "Founder can keep this as report/draft readiness.",
      auditReadiness: {
        auditLedgerReady: true,
        recordsRawSecrets: false,
        recordsBankCardData: false,
        recordMode: "readiness_only",
        requiredFields: [
          "request category",
          "purpose",
          "Product Truth",
          "required reviews",
          "rollback evidence",
          "Founder note",
        ],
      },
    },
    nextSafeAction: permit.nextSafeAction,
    memoryLesson,
    founderReviewNeeded,
  };
}

export const SAMPLE_LEGITIMACY_REQUESTS: AlkonLegitimacyRequest[] = [
  {
    actionCategory: "public_ui_change",
    title: "Simplify public support path",
    description: "Improve clarity for real public users and reduce confusion without adding private terms.",
    requestedBy: "founder",
    affectedWorld: "public_earth",
    affectedSurface: "Support",
    currentStage: "laptop_planet",
    fundingMode: "founder_funded",
    hasInvoice: false,
    hasRollback: true,
    requiresSecrets: false,
    publicVisible: true,
    planImpact: "none",
    productTruthImpact: "copy_only",
  },
  {
    actionCategory: "billing_activation",
    title: "Activate billing now",
    description: "Enable paid checkout immediately.",
    requestedBy: "founder",
    affectedWorld: "public_earth",
    affectedSurface: "Plans",
    currentStage: "laptop_planet",
    fundingMode: "founder_funded",
    hasInvoice: false,
    hasRollback: false,
    requiresSecrets: true,
    publicVisible: true,
    planImpact: "pro",
    productTruthImpact: "billing",
  },
  {
    actionCategory: "treasury_payment",
    title: "Pay software vendor",
    description: "Record readiness for a possible founder-funded software invoice inside the monthly cap.",
    requestedBy: "founder",
    affectedWorld: "private_alkon",
    affectedSurface: "Treasury Life",
    amount: 40,
    currency: "CHF",
    currentStage: "laptop_planet",
    fundingMode: "founder_funded",
    hasInvoice: false,
    hasRollback: false,
    requiresSecrets: false,
    publicVisible: false,
    planImpact: "alkon_private",
    productTruthImpact: "none",
  },
  {
    actionCategory: "media_content",
    title: "Publish platform claim",
    description: "Draft a post about paper-safe workspace readiness without profit claims.",
    claimText: "Trading Pro Max is paper-safe and not live trading.",
    requestedBy: "founder",
    affectedWorld: "private_alkon",
    affectedSurface: "Media Reality",
    currentStage: "laptop_planet",
    fundingMode: "founder_funded",
    hasInvoice: false,
    hasRollback: true,
    requiresSecrets: false,
    publicVisible: false,
    planImpact: "none",
    productTruthImpact: "copy_only",
  },
];
