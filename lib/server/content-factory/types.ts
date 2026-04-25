export type ContentFactoryType =
  | "text_post"
  | "academy_post"
  | "product_update"
  | "trust_safety_post"
  | "pro_vip_teaser"
  | "ai_video_script"
  | "short_video_script"
  | "long_video_script"
  | "ai_video_caption"
  | "thumbnail_brief"
  | "partnership_brief"
  | "sponsored_clock_brief"
  | "carousel_outline"
  | "changelog_summary"
  | "community_announcement";

export type ContentFactoryLifecycle =
  | "idea"
  | "draft"
  | "brand_review"
  | "guardian_review"
  | "legal_review"
  | "founder_approval"
  | "scheduled"
  | "published"
  | "blocked"
  | "archived";

export type ContentFactoryRisk = "safe_auto_publish" | "approval_required" | "blocked";

export type ContentFactoryClassification = {
  checkedAt: string;
  mode: "content_factory_engine";
  contentType: ContentFactoryType;
  lifecycle: ContentFactoryLifecycle;
  risk: ContentFactoryRisk;
  requiredReviews: string[];
  blockedReasons: string[];
  safeNextStep: string;
  truth: {
    externalPublishing: "blocked";
    socialTokens: "not_present";
    fakeMetrics: "blocked";
  };
};

export type ContentFactoryReadinessSnapshot = {
  checkedAt: string;
  mode: "content_factory_readiness";
  lifecycle: {
    states: ContentFactoryLifecycle[];
    externalPublishing: "blocked";
    socialTokens: "not_present";
    fakeMetrics: "blocked";
  };
  samples: {
    educationTip: ContentFactoryClassification;
    vipClaim: ContentFactoryClassification;
    guaranteedProfitClaim: ContentFactoryClassification;
    islamicCertificationClaim: ContentFactoryClassification;
    liveTradingClaim: ContentFactoryClassification;
    sponsoredClockClaim: ContentFactoryClassification;
    aiVideoScript: ContentFactoryClassification;
  };
  mediaOffice: {
    channels: string[];
    accountsConnected: false;
    tokensPresent: false;
    externalPublishing: "blocked";
    metrics: "not_present";
  };
  aiVideoStudio: {
    upload: "blocked";
    publishing: "blocked";
    fakeViews: "blocked";
    requiredReviews: string[];
  };
  truth: {
    externalPublishing: "blocked";
    socialAccountsConnected: false;
    socialTokens: "not_present";
    fakeFollowersOrViews: "blocked";
    founderApprovalRequiredForSensitiveClaims: true;
  };
};
