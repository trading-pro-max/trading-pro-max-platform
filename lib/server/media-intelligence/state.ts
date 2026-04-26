import type { MediaIntelligenceSnapshot } from "./types";

export function getMediaIntelligenceSnapshot(): MediaIntelligenceSnapshot {
  return {
    snapshotId: "media_reality_communication_readiness",
    visibility: "private_founder_only",
    status: "readiness_only",
    realitySource: "Product Truth",
    truthTranslation: "public_safe_only",
    audienceReality: "no_fake_users_or_metrics",
    channelReality: {
      socialAccountsConnected: false,
      tokensPresent: false,
      publishingEnabled: false,
      adSpendEnabled: false,
    },
    claimsFirewall: {
      ready: true,
      blocksProfitClaims: true,
      blocksFakeLaunchClaims: true,
      blocksFakeDownloads: true,
      blocksFakePartnerships: true,
    },
    storyArchitecture: "draft_review_only",
    aiContentFactoryReadiness: "draft_review_only",
    reviewGates: ["Founder review", "Guardian review", "Legal review", "Claims firewall"],
    publishingGate: "inactive",
    reputationDefense: "claims_review_required",
    feedbackIntelligence: "planned",
    mediaEconomy: "no_ad_spend",
    mediaMemory: [
      "No social publishing without explicit future approval.",
      "No fake users, revenue, followers, or metrics.",
      "No profit, signal, win-rate, launch, download, partnership, or certification claims.",
    ],
    publicExposure: false,
    noExternalCalls: true,
  };
}

export function getMediaIntelligenceReadiness() {
  const snapshot = getMediaIntelligenceSnapshot();

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    noPublishing: true,
    noSocialConnection: true,
    noAdSpend: true,
    noSecrets: true,
    noExternalCalls: true,
    snapshot,
  };
}
