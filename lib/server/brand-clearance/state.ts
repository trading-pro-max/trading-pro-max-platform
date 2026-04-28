import { evaluateBrandAdoptionGate } from "./adoption-gate";
import { getCurrentNameAssessments } from "./current-name-assessment";
import { getBrandMigrationPlan } from "./migration-plan";
import { generateDomainSearchTasks, generateTrademarkSearchTasks } from "./search-tasks";
import type { BrandCandidate, BrandClearanceSnapshot } from "./types";

export function getBrandClearanceSnapshot(
  checkedAt = new Date().toISOString()
): BrandClearanceSnapshot {
  const currentNames = getCurrentNameAssessments();
  const candidateShortlist: BrandCandidate[] = [];
  const trademarkSearchTasks = generateTrademarkSearchTasks("final global brand candidate");
  const domainSearchTasks = generateDomainSearchTasks("final global brand candidate");
  const legalReviewStatus = "required" as const;
  const adoptionGate = evaluateBrandAdoptionGate({
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
    currentNames,
    candidateShortlist,
    trademarkSearchTasks,
    domainSearchTasks,
    conflictRisk: {
      level: "high",
      reasons: [
        "Pro Max is generic and widely used.",
        "Alkon must stay private until Alkon/Alcon and existing-use risk is reviewed.",
        "No final global public brand exists yet.",
      ],
      majorConflictFamilies: ["Dell Pro Max", "Apple Pro Max", "Alcon", "Alkon"],
    },
    languageRisk: {
      level: "unknown",
      languagesToReview: ["Arabic", "English", "German", "French", "Italian", "Spanish"],
      notes: ["No final candidate has passed language safety review."],
    },
    sectorRisk: {
      level: "high",
      sectorsToReview: ["finance", "technology", "trading", "assistant", "academy", "business"],
      notes: [
        "Financial and technology brands need stronger clearance before global public use.",
      ],
    },
    legalReviewStatus,
    adoptionGate,
    migrationPlan: getBrandMigrationPlan(),
    blockedClaims: [
      "global exclusivity",
      "trademark ownership",
      "Swiss regulated",
      "FINMA approved",
      "licensed",
      "#1/global best",
      "profit guarantee",
      "win-rate",
    ],
    nextSafeBrandAction:
      "Generate or receive candidate names, then run manual trademark/domain/conflict/language/legal review before Ahmad approval.",
  };
}

export function getBrandClearanceReadiness(checkedAt = new Date().toISOString()) {
  const snapshot = getBrandClearanceSnapshot(checkedAt);

  return {
    checkedAt,
    status: "ready_with_notes" as const,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExternalCalls: true,
    noDomainPurchase: true,
    noPayments: true,
    noLegalClaims: true,
    publicExposure: false,
    currentNameCount: snapshot.currentNames.length,
    candidateCount: snapshot.candidateShortlist.length,
    trademarkTaskCount: snapshot.trademarkSearchTasks.length,
    domainTaskCount: snapshot.domainSearchTasks.length,
    adoptionStatus: snapshot.adoptionGate.adoptionStatus,
    nextSafeBrandAction: snapshot.nextSafeBrandAction,
  };
}
