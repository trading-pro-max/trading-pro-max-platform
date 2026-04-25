import "server-only";

import type { MediaOfficeReadinessSnapshot } from "./types";
import {
  blockedMediaClaims,
  contentLifecycle,
  evaluateMediaContentDraft,
  mediaContentDefinitions,
  mediaOfficeTruth,
  mediaRiskLevels,
} from "./review";

export function getMediaOfficeReadinessSnapshot(
  checkedAt = new Date().toISOString()
): MediaOfficeReadinessSnapshot {
  const brand = mediaContentDefinitions
    .filter((definition) => definition.requiredReviews.includes("brand"))
    .map((definition) => definition.type);
  const guardian = mediaContentDefinitions
    .filter((definition) => definition.requiredReviews.includes("guardian"))
    .map((definition) => definition.type);
  const legal = mediaContentDefinitions
    .filter((definition) => definition.requiredReviews.includes("legal"))
    .map((definition) => definition.type);
  const founder = mediaContentDefinitions
    .filter((definition) => definition.requiredReviews.includes("founder"))
    .map((definition) => definition.type);

  return {
    checkedAt,
    mode: "media_office_workflow_readiness",
    status: "draft_review_only",
    contentTypes: mediaContentDefinitions,
    lifecycle: contentLifecycle,
    riskLevels: mediaRiskLevels,
    blockedClaims: blockedMediaClaims,
    queueSummary: {
      ideas: 3,
      drafts: 3,
      brandReview: brand.length,
      guardianReview: guardian.length,
      legalReview: legal.length,
      founderApproval: founder.length,
      scheduledLater: 0,
      blocked: blockedMediaClaims.length,
      archived: 0,
    },
    reviewQueue: {
      brand,
      guardian,
      legal,
      founder,
      blockedClaims: blockedMediaClaims,
    },
    sampleReviews: {
      safeEducation: evaluateMediaContentDraft({
        contentType: "education_post",
        title: "How paper mode works",
        summary: "Educational draft about paper-safe practice and why live execution is inactive.",
      }),
      proTeaser: evaluateMediaContentDraft({
        contentType: "pro_educational_teaser",
        title: "Pro education preview",
        summary: "Planned Pro workflow education without active entitlement or billing claim.",
      }),
      vipTeaser: evaluateMediaContentDraft({
        contentType: "vip_educational_teaser",
        title: "VIP education preview",
        summary: "Planned VIP education without signals, outcome promises, or private room activation claim.",
      }),
      partnershipDraft: evaluateMediaContentDraft({
        contentType: "partnership_draft",
        title: "Partnership concept",
        summary: "Internal draft for future contract-first review only.",
      }),
      guaranteedProfit: evaluateMediaContentDraft({
        contentType: "education_post",
        title: "Guaranteed profit claim",
        summary: "Unsafe draft claiming guaranteed profit and a win-rate.",
      }),
    },
    noPublishingActive: true,
    truth: mediaOfficeTruth,
  };
}
