import "server-only";

export type MediaContentType =
  | "education_post"
  | "product_update"
  | "trust_safety_post"
  | "pro_educational_teaser"
  | "vip_educational_teaser"
  | "changelog"
  | "community_announcement"
  | "partnership_draft";

export type ContentLifecycleState =
  | "idea"
  | "draft"
  | "brand_review"
  | "guardian_review"
  | "legal_review"
  | "founder_approval"
  | "scheduled_later"
  | "blocked"
  | "archived";

export type MediaRiskLevel =
  | "safe_draft"
  | "review_required"
  | "founder_approval_required"
  | "blocked";

export type BlockedMediaClaim =
  | "guaranteed_profit"
  | "win_rate"
  | "fake_live_trading"
  | "fake_billing"
  | "fake_vip"
  | "fake_sharia"
  | "fake_partnership"
  | "uncontracted_brand_use"
  | "misleading_urgency";

export type MediaReviewName = "brand" | "guardian" | "legal" | "founder";

export type MediaContentDefinition = {
  type: MediaContentType;
  label: string;
  purpose: string;
  defaultRisk: MediaRiskLevel;
  requiredReviews: MediaReviewName[];
  founderApprovalRequired: boolean;
  safeUse: string;
  forbiddenClaims: BlockedMediaClaim[];
};

export type MediaOfficeTruth = {
  socialAccountsConnected: false;
  socialTokensPresent: false;
  uploadActive: false;
  externalPublishingActive: false;
  publishingActive: false;
  fakeFollowersIncluded: false;
  fakeViewsIncluded: false;
  fakeMetricsIncluded: false;
  billingActive: false;
  publicLaunchActive: false;
  liveTradingActive: false;
  brokerFeedActive: false;
  founderCommandPublic: false;
  brandNamesAllowedWithoutContract: false;
};

export type MediaReviewInput = {
  contentType: MediaContentType;
  title: string;
  summary: string;
};

export type MediaReviewEvaluation = {
  contentType: MediaContentType;
  riskLevel: MediaRiskLevel;
  lifecycleState: ContentLifecycleState;
  requiredReviews: MediaReviewName[];
  founderApprovalRequired: boolean;
  blockedReasons: string[];
  detectedBlockedClaims: BlockedMediaClaim[];
  safeAlternative: string;
  externalPublishingAllowed: false;
  tokensRequired: false;
};

export type MediaOfficeReadinessSnapshot = {
  checkedAt: string;
  mode: "media_office_workflow_readiness";
  status: "draft_review_only";
  contentTypes: MediaContentDefinition[];
  lifecycle: ContentLifecycleState[];
  riskLevels: MediaRiskLevel[];
  blockedClaims: BlockedMediaClaim[];
  queueSummary: {
    ideas: number;
    drafts: number;
    brandReview: number;
    guardianReview: number;
    legalReview: number;
    founderApproval: number;
    scheduledLater: number;
    blocked: number;
    archived: number;
  };
  reviewQueue: {
    brand: MediaContentType[];
    guardian: MediaContentType[];
    legal: MediaContentType[];
    founder: MediaContentType[];
    blockedClaims: BlockedMediaClaim[];
  };
  sampleReviews: {
    safeEducation: MediaReviewEvaluation;
    proTeaser: MediaReviewEvaluation;
    vipTeaser: MediaReviewEvaluation;
    partnershipDraft: MediaReviewEvaluation;
    guaranteedProfit: MediaReviewEvaluation;
  };
  noPublishingActive: true;
  truth: MediaOfficeTruth;
};

export type ContentReviewReadinessSnapshot = {
  checkedAt: string;
  mode: "content_review_readiness";
  status: "review_gate_ready";
  lifecycle: ContentLifecycleState[];
  riskLevels: MediaRiskLevel[];
  blockedClaims: BlockedMediaClaim[];
  lifecyclePolicy: {
    scheduledLaterIsFutureOnly: true;
    publishedStateIncluded: false;
    founderApprovalBeforeExternalUse: true;
    guardianLegalBeforeSensitiveClaims: true;
  };
  samples: {
    safeEducation: MediaReviewEvaluation;
    proTeaser: MediaReviewEvaluation;
    vipTeaser: MediaReviewEvaluation;
    partnershipDraft: MediaReviewEvaluation;
    fakePartnership: MediaReviewEvaluation;
    guaranteedProfit: MediaReviewEvaluation;
  };
  truth: MediaOfficeTruth;
};
