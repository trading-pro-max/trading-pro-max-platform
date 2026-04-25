import "server-only";

import type {
  BlockedMediaClaim,
  ContentLifecycleState,
  ContentReviewReadinessSnapshot,
  MediaContentDefinition,
  MediaContentType,
  MediaOfficeTruth,
  MediaReviewEvaluation,
  MediaReviewInput,
  MediaReviewName,
  MediaRiskLevel,
} from "./types";

export const contentLifecycle: ContentLifecycleState[] = [
  "idea",
  "draft",
  "brand_review",
  "guardian_review",
  "legal_review",
  "founder_approval",
  "scheduled_later",
  "blocked",
  "archived",
];

export const mediaRiskLevels: MediaRiskLevel[] = [
  "safe_draft",
  "review_required",
  "founder_approval_required",
  "blocked",
];

export const blockedMediaClaims: BlockedMediaClaim[] = [
  "guaranteed_profit",
  "win_rate",
  "fake_live_trading",
  "fake_billing",
  "fake_vip",
  "fake_sharia",
  "fake_partnership",
  "uncontracted_brand_use",
  "misleading_urgency",
];

export const mediaOfficeTruth: MediaOfficeTruth = {
  socialAccountsConnected: false,
  socialTokensPresent: false,
  uploadActive: false,
  externalPublishingActive: false,
  publishingActive: false,
  fakeFollowersIncluded: false,
  fakeViewsIncluded: false,
  fakeMetricsIncluded: false,
  billingActive: false,
  publicLaunchActive: false,
  liveTradingActive: false,
  brokerFeedActive: false,
  founderCommandPublic: false,
  brandNamesAllowedWithoutContract: false,
};

export const mediaContentDefinitions: MediaContentDefinition[] = [
  {
    type: "education_post",
    label: "Education post",
    purpose: "Teach platform, paper-mode, safety, or learning concepts without claims.",
    defaultRisk: "safe_draft",
    requiredReviews: ["brand", "guardian"],
    founderApprovalRequired: false,
    safeUse: "Draft educational content for later review only.",
    forbiddenClaims: blockedMediaClaims,
  },
  {
    type: "product_update",
    label: "Product update",
    purpose: "Explain visible product changes and readiness truth.",
    defaultRisk: "review_required",
    requiredReviews: ["brand", "guardian"],
    founderApprovalRequired: false,
    safeUse: "Keep updates factual and non-launch.",
    forbiddenClaims: blockedMediaClaims,
  },
  {
    type: "trust_safety_post",
    label: "Trust/safety post",
    purpose: "Explain safety boundaries, product truth, and user protection.",
    defaultRisk: "review_required",
    requiredReviews: ["brand", "guardian", "legal"],
    founderApprovalRequired: false,
    safeUse: "Use calm public-safe wording and avoid legal advice.",
    forbiddenClaims: blockedMediaClaims,
  },
  {
    type: "pro_educational_teaser",
    label: "Pro educational teaser",
    purpose: "Describe future Pro learning value without fake activation.",
    defaultRisk: "founder_approval_required",
    requiredReviews: ["brand", "guardian", "legal", "founder"],
    founderApprovalRequired: true,
    safeUse: "Say Pro is planned unless entitlement truth changes later.",
    forbiddenClaims: blockedMediaClaims,
  },
  {
    type: "vip_educational_teaser",
    label: "VIP educational teaser",
    purpose: "Describe future VIP education without signals or performance promises.",
    defaultRisk: "founder_approval_required",
    requiredReviews: ["brand", "guardian", "legal", "founder"],
    founderApprovalRequired: true,
    safeUse: "Say VIP is planned and never imply guaranteed outcomes.",
    forbiddenClaims: blockedMediaClaims,
  },
  {
    type: "changelog",
    label: "Changelog",
    purpose: "Summarize shipped internal/local product changes.",
    defaultRisk: "review_required",
    requiredReviews: ["brand", "guardian"],
    founderApprovalRequired: false,
    safeUse: "Use factual local-readiness language.",
    forbiddenClaims: blockedMediaClaims,
  },
  {
    type: "community_announcement",
    label: "Community announcement",
    purpose: "Prepare future community safety and learning updates.",
    defaultRisk: "review_required",
    requiredReviews: ["brand", "guardian", "legal"],
    founderApprovalRequired: false,
    safeUse: "No active rooms, fake members, or signal claims.",
    forbiddenClaims: blockedMediaClaims,
  },
  {
    type: "partnership_draft",
    label: "Partnership draft",
    purpose: "Draft future partnership language for review before any claim.",
    defaultRisk: "founder_approval_required",
    requiredReviews: ["brand", "guardian", "legal", "founder"],
    founderApprovalRequired: true,
    safeUse: "No brand names or partnership claims without signed contracts.",
    forbiddenClaims: blockedMediaClaims,
  },
];

const blockedClaimPatterns: Array<{
  claim: BlockedMediaClaim;
  patterns: RegExp[];
}> = [
  {
    claim: "guaranteed_profit",
    patterns: [/guaranteed?\s+profits?/i, /profit\s+guarantee/i, /risk[-\s]?free\s+profit/i],
  },
  {
    claim: "win_rate",
    patterns: [/\bwin[-\s]?rate\b/i, /\b\d{2,3}%\s+wins?\b/i],
  },
  {
    claim: "fake_live_trading",
    patterns: [/live\s+trading\s+(is\s+)?active/i, /real[-\s]?money\s+(is\s+)?active/i],
  },
  {
    claim: "fake_billing",
    patterns: [/billing\s+(is\s+)?active/i, /checkout\s+(is\s+)?active/i],
  },
  {
    claim: "fake_vip",
    patterns: [/vip\s+(is\s+)?active/i, /private\s+vip\s+room\s+(is\s+)?active/i],
  },
  {
    claim: "fake_sharia",
    patterns: [/sharia\s+certified/i, /islamic\s+certified/i],
  },
  {
    claim: "fake_partnership",
    patterns: [/official\s+partner/i, /sponsored\s+by/i, /partnership\s+with/i],
  },
  {
    claim: "uncontracted_brand_use",
    patterns: [/powered\s+by\s+[A-Z][A-Za-z0-9]+/i, /in\s+partnership\s+with\s+[A-Z]/i],
  },
  {
    claim: "misleading_urgency",
    patterns: [/act\s+now/i, /limited\s+spots?/i, /last\s+chance/i],
  },
];

function definitionFor(type: MediaContentType) {
  return mediaContentDefinitions.find((definition) => definition.type === type);
}

function uniqueReviews(reviews: MediaReviewName[]) {
  return Array.from(new Set(reviews));
}

function detectedClaims(text: string) {
  return blockedClaimPatterns
    .filter(({ patterns }) => patterns.some((pattern) => pattern.test(text)))
    .map(({ claim }) => claim);
}

function safeAlternativeFor(claims: BlockedMediaClaim[]) {
  if (claims.length > 0) {
    return "Rewrite as a factual draft about paper-safe readiness, planned features, and review requirements.";
  }

  return "Keep the item as a draft and complete brand, Guardian, Legal, and Founder review where required before external use.";
}

export function evaluateMediaContentDraft(
  input: MediaReviewInput
): MediaReviewEvaluation {
  const definition = definitionFor(input.contentType);
  const combined = `${input.title} ${input.summary}`;
  const claims = detectedClaims(combined);

  if (!definition) {
    return {
      contentType: input.contentType,
      riskLevel: "blocked",
      lifecycleState: "blocked",
      requiredReviews: ["brand", "guardian", "legal", "founder"],
      founderApprovalRequired: true,
      blockedReasons: ["Unsupported media content type."],
      detectedBlockedClaims: claims,
      safeAlternative: "Use a supported readiness-only media content type.",
      externalPublishingAllowed: false,
      tokensRequired: false,
    };
  }

  if (claims.length > 0) {
    return {
      contentType: input.contentType,
      riskLevel: "blocked",
      lifecycleState: "blocked",
      requiredReviews: ["brand", "guardian", "legal", "founder"],
      founderApprovalRequired: true,
      blockedReasons: claims.map((claim) => `Blocked claim: ${claim}`),
      detectedBlockedClaims: claims,
      safeAlternative: safeAlternativeFor(claims),
      externalPublishingAllowed: false,
      tokensRequired: false,
    };
  }

  const founderRequired =
    definition.founderApprovalRequired ||
    input.contentType === "partnership_draft" ||
    input.contentType === "pro_educational_teaser" ||
    input.contentType === "vip_educational_teaser";

  return {
    contentType: input.contentType,
    riskLevel: founderRequired ? "founder_approval_required" : definition.defaultRisk,
    lifecycleState: founderRequired ? "founder_approval" : "draft",
    requiredReviews: uniqueReviews(definition.requiredReviews),
    founderApprovalRequired: founderRequired,
    blockedReasons: [],
    detectedBlockedClaims: [],
    safeAlternative: safeAlternativeFor([]),
    externalPublishingAllowed: false,
    tokensRequired: false,
  };
}

export function getContentReviewReadinessSnapshot(
  checkedAt = new Date().toISOString()
): ContentReviewReadinessSnapshot {
  return {
    checkedAt,
    mode: "content_review_readiness",
    status: "review_gate_ready",
    lifecycle: contentLifecycle,
    riskLevels: mediaRiskLevels,
    blockedClaims: blockedMediaClaims,
    lifecyclePolicy: {
      scheduledLaterIsFutureOnly: true,
      publishedStateIncluded: false,
      founderApprovalBeforeExternalUse: true,
      guardianLegalBeforeSensitiveClaims: true,
    },
    samples: {
      safeEducation: evaluateMediaContentDraft({
        contentType: "education_post",
        title: "Paper mode guide",
        summary: "Explain paper-safe practice and product truth.",
      }),
      proTeaser: evaluateMediaContentDraft({
        contentType: "pro_educational_teaser",
        title: "Pro learning path preview",
        summary: "Draft a planned Pro education teaser with no activation claim.",
      }),
      vipTeaser: evaluateMediaContentDraft({
        contentType: "vip_educational_teaser",
        title: "VIP education preview",
        summary: "Draft a planned VIP education teaser with no signal or outcome claim.",
      }),
      partnershipDraft: evaluateMediaContentDraft({
        contentType: "partnership_draft",
        title: "Partnership review note",
        summary: "Prepare a contract-first draft without naming a partner publicly.",
      }),
      fakePartnership: evaluateMediaContentDraft({
        contentType: "partnership_draft",
        title: "Official partner announcement",
        summary: "Claim an official partner before a signed contract exists.",
      }),
      guaranteedProfit: evaluateMediaContentDraft({
        contentType: "education_post",
        title: "Guaranteed profit lesson",
        summary: "Claim a guaranteed profit and a fixed win-rate.",
      }),
    },
    truth: mediaOfficeTruth,
  };
}
