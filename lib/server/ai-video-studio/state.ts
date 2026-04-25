import "server-only";

import {
  blockedMediaClaims,
  contentLifecycle,
  mediaRiskLevels,
} from "@/lib/server/media-office";
import type {
  AiVideoArtifactDefinition,
  AiVideoStudioReadinessSnapshot,
  AiVideoStudioTruth,
} from "./types";

const artifactTypes: AiVideoArtifactDefinition[] = [
  {
    type: "idea",
    label: "Idea",
    purpose: "Capture a content concept for future review.",
    defaultRisk: "safe_draft",
    requiresGuardianReview: true,
    requiresLegalReview: false,
    requiresFounderApproval: false,
  },
  {
    type: "short_script",
    label: "Short script",
    purpose: "Draft a short-form educational or product update script.",
    defaultRisk: "review_required",
    requiresGuardianReview: true,
    requiresLegalReview: true,
    requiresFounderApproval: false,
  },
  {
    type: "long_script",
    label: "Long script",
    purpose: "Draft deeper educational narrative for later review.",
    defaultRisk: "review_required",
    requiresGuardianReview: true,
    requiresLegalReview: true,
    requiresFounderApproval: false,
  },
  {
    type: "captions",
    label: "Captions",
    purpose: "Prepare accessible captions and safe public wording.",
    defaultRisk: "review_required",
    requiresGuardianReview: true,
    requiresLegalReview: true,
    requiresFounderApproval: false,
  },
  {
    type: "hashtags",
    label: "Hashtags",
    purpose: "Prepare non-spam, non-misleading topic tags for review.",
    defaultRisk: "review_required",
    requiresGuardianReview: true,
    requiresLegalReview: true,
    requiresFounderApproval: false,
  },
  {
    type: "thumbnail_brief",
    label: "Thumbnail brief",
    purpose: "Describe a safe future thumbnail concept without generating images.",
    defaultRisk: "review_required",
    requiresGuardianReview: true,
    requiresLegalReview: true,
    requiresFounderApproval: false,
  },
  {
    type: "voiceover_brief",
    label: "Voiceover brief",
    purpose: "Prepare tone and narration guidance without voice generation.",
    defaultRisk: "review_required",
    requiresGuardianReview: true,
    requiresLegalReview: true,
    requiresFounderApproval: false,
  },
  {
    type: "scene_outline",
    label: "Scene outline",
    purpose: "Plan scenes for future internal review without video generation.",
    defaultRisk: "review_required",
    requiresGuardianReview: true,
    requiresLegalReview: true,
    requiresFounderApproval: false,
  },
  {
    type: "compliance_risk_score",
    label: "Compliance risk score",
    purpose: "Classify claims, plan language, brand risk, and approval needs.",
    defaultRisk: "founder_approval_required",
    requiresGuardianReview: true,
    requiresLegalReview: true,
    requiresFounderApproval: true,
  },
];

const truth: AiVideoStudioTruth = {
  generationApiConnected: false,
  uploadActive: false,
  publishingActive: false,
  socialAccountsConnected: false,
  socialTokensPresent: false,
  fakeViewsIncluded: false,
  fakeFollowersIncluded: false,
  fakeMetricsIncluded: false,
  brandNamesAllowedWithoutContract: false,
  profitClaimsAllowed: false,
  publicLaunchActive: false,
};

export function getAiVideoStudioReadinessSnapshot(
  checkedAt = new Date().toISOString()
): AiVideoStudioReadinessSnapshot {
  return {
    checkedAt,
    mode: "ai_video_studio_workflow_readiness",
    status: "script_readiness_only",
    artifactTypes,
    lifecycle: contentLifecycle,
    riskLevels: mediaRiskLevels,
    reviewWorkflow: {
      brandReview: true,
      guardianReview: true,
      legalReview: true,
      founderApprovalForSensitive: true,
      externalPublishingEnabled: false,
    },
    queueSummary: {
      ideas: 2,
      scripts: 2,
      captions: 1,
      briefs: 3,
      riskScores: 1,
      blocked: blockedMediaClaims.length,
    },
    blockedClaims: blockedMediaClaims,
    sampleOutputs: [
      {
        type: "idea",
        label: "Paper-safe education idea",
        risk: "safe_draft",
        lifecycleState: "idea",
        externalUseAllowed: false,
      },
      {
        type: "short_script",
        label: "Why live execution is inactive",
        risk: "review_required",
        lifecycleState: "guardian_review",
        externalUseAllowed: false,
      },
      {
        type: "compliance_risk_score",
        label: "VIP teaser risk score",
        risk: "founder_approval_required",
        lifecycleState: "founder_approval",
        externalUseAllowed: false,
      },
    ],
    truth,
  };
}
