import { evaluateBrandAdoptionGate } from "./adoption-gate";
import { generateBrandCandidates } from "./candidate-engine";
import { getBrandMigrationPlan } from "./migration-plan";
import { getProMaxRiskStatus } from "./pro-max-risk";
import { brandSearchSources, getBrandSearchPlan } from "./search-plan";
import { generateDomainSearchTasks, generateTrademarkSearchTasks } from "./search-tasks";
import type { BrandClearanceSnapshot } from "./types";

export function runBrandClearanceEngine(
  checkedAt = new Date().toISOString()
): BrandClearanceSnapshot {
  const proMax = getProMaxRiskStatus();
  const candidateList = generateBrandCandidates();
  const representativeCandidate = candidateList[0]?.name ?? "final global brand candidate";
  const requiredSearches = brandSearchSources;
  const trademarkSearchTasks = generateTrademarkSearchTasks(representativeCandidate);
  const domainSearchTasks = generateDomainSearchTasks(representativeCandidate);
  const legalReviewStatus = "required" as const;
  const adoptionGate = evaluateBrandAdoptionGate({
    candidate: candidateList[0],
    trademarkTasks: trademarkSearchTasks,
    domainTasks: domainSearchTasks,
    legalReviewStatus,
    ahmadApproval: {
      required: true,
      status: "not_requested",
      approvalScope: "candidate_review",
    },
  });

  return {
    checkedAt,
    status: "active_with_notes",
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExternalCalls: true,
    noDomainPurchase: true,
    noPayments: true,
    noLegalClaims: true,
    publicExposure: false,
    currentNames: [proMax],
    candidateShortlist: candidateList,
    trademarkSearchTasks,
    domainSearchTasks,
    conflictRisk: {
      level: "high",
      reasons: [
        "Pro Max is generic and widely used.",
        "Final global brand is not approved.",
        "Candidate names are generated but unchecked.",
      ],
      majorConflictFamilies: ["Dell Pro Max", "Apple Pro Max", "Alcon", "Alkon"],
    },
    languageRisk: {
      level: "unknown",
      languagesToReview: ["Arabic", "English", "German", "French", "Italian", "Spanish"],
      notes: ["All generated candidates require human language review."],
    },
    sectorRisk: {
      level: "high",
      sectorsToReview: ["finance", "technology", "trading", "assistant", "academy", "business"],
      notes: ["Financial, software, education, and AI classes require formal review."],
    },
    legalReviewStatus,
    adoptionGate,
    migrationPlan: getBrandMigrationPlan(),
    currentWorkingName: "Pro Max",
    finalBrandApproved: false,
    launchBlockedByBrandGate: true,
    requiredSearches,
    requiredLegalReview: true,
    oneNextAction: {
      action:
        "Ahmad chooses candidate names for official manual trademark, domain, conflict, language, class, and legal review.",
      owner: "Ahmad",
      status: "ready_for_review",
    },
    blockedClaims: [
      "global exclusivity",
      "trademark ownership",
      "registered",
      "Swiss regulated",
      "FINMA approved",
      "licensed",
      "#1/global best",
      "profit guarantee",
      "win-rate",
    ],
    nextSafeBrandAction:
      "Choose/search candidate names through the official search plan before any public/global launch.",
    searchPlan: getBrandSearchPlan(representativeCandidate),
  };
}
