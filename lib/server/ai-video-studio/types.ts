import "server-only";

import type {
  ContentLifecycleState,
  MediaRiskLevel,
} from "@/lib/server/media-office";

export type AiVideoArtifactType =
  | "idea"
  | "short_script"
  | "long_script"
  | "captions"
  | "hashtags"
  | "thumbnail_brief"
  | "voiceover_brief"
  | "scene_outline"
  | "compliance_risk_score";

export type AiVideoArtifactDefinition = {
  type: AiVideoArtifactType;
  label: string;
  purpose: string;
  defaultRisk: MediaRiskLevel;
  requiresGuardianReview: boolean;
  requiresLegalReview: boolean;
  requiresFounderApproval: boolean;
};

export type AiVideoStudioTruth = {
  generationApiConnected: false;
  uploadActive: false;
  publishingActive: false;
  socialAccountsConnected: false;
  socialTokensPresent: false;
  fakeViewsIncluded: false;
  fakeFollowersIncluded: false;
  fakeMetricsIncluded: false;
  brandNamesAllowedWithoutContract: false;
  profitClaimsAllowed: false;
  publicLaunchActive: false;
};

export type AiVideoStudioReadinessSnapshot = {
  checkedAt: string;
  mode: "ai_video_studio_workflow_readiness";
  status: "script_readiness_only";
  artifactTypes: AiVideoArtifactDefinition[];
  lifecycle: ContentLifecycleState[];
  riskLevels: MediaRiskLevel[];
  reviewWorkflow: {
    brandReview: true;
    guardianReview: true;
    legalReview: true;
    founderApprovalForSensitive: true;
    externalPublishingEnabled: false;
  };
  queueSummary: {
    ideas: number;
    scripts: number;
    captions: number;
    briefs: number;
    riskScores: number;
    blocked: number;
  };
  blockedClaims: string[];
  sampleOutputs: Array<{
    type: AiVideoArtifactType;
    label: string;
    risk: MediaRiskLevel;
    lifecycleState: ContentLifecycleState;
    externalUseAllowed: false;
  }>;
  truth: AiVideoStudioTruth;
};
