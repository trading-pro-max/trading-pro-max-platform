export type MediaIntelligenceSnapshot = {
  snapshotId: "media_reality_communication_readiness";
  visibility: "private_founder_only";
  status: "readiness_only";
  realitySource: "Product Truth";
  truthTranslation: "public_safe_only";
  audienceReality: "no_fake_users_or_metrics";
  channelReality: {
    socialAccountsConnected: false;
    tokensPresent: false;
    publishingEnabled: false;
    adSpendEnabled: false;
  };
  claimsFirewall: {
    ready: true;
    blocksProfitClaims: true;
    blocksFakeLaunchClaims: true;
    blocksFakeDownloads: true;
    blocksFakePartnerships: true;
  };
  storyArchitecture: "draft_review_only";
  aiContentFactoryReadiness: "draft_review_only";
  reviewGates: string[];
  publishingGate: "inactive";
  reputationDefense: "claims_review_required";
  feedbackIntelligence: "planned";
  mediaEconomy: "no_ad_spend";
  mediaMemory: string[];
  publicExposure: false;
  noExternalCalls: true;
};
