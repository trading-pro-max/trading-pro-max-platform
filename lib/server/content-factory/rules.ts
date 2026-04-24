import "server-only";

import type {
  ContentFactoryClassification,
  ContentFactoryLifecycle,
  ContentFactoryReadinessSnapshot,
  ContentFactoryRisk,
  ContentFactoryType,
} from "./types";

const blockedPatterns = [
  "guaranteed profit",
  "win-rate",
  "risk-free",
  "sure signal",
  "live trading active",
  "broker connected",
  "billing active",
  "public launch",
  "sharia certified",
  "financial advice",
  "legal advice",
];

function classifyRisk(text: string, contentType: ContentFactoryType): {
  risk: ContentFactoryRisk;
  blockedReasons: string[];
  requiredReviews: string[];
  lifecycle: ContentFactoryLifecycle;
} {
  const normalized = text.toLowerCase();
  const blockedReasons = blockedPatterns.filter((pattern) =>
    normalized.includes(pattern)
  );

  if (blockedReasons.length > 0) {
    return {
      risk: "blocked",
      blockedReasons,
      requiredReviews: ["Guardian", "Legal", "Founder"],
      lifecycle: "blocked",
    };
  }

  if (
    contentType === "pro_vip_teaser" ||
    contentType === "ai_video_script" ||
    contentType === "short_video_script" ||
    contentType === "long_video_script"
  ) {
    return {
      risk: "approval_required",
      blockedReasons: [],
      requiredReviews: ["Brand", "Guardian", "Legal", "Founder"],
      lifecycle: "founder_approval",
    };
  }

  if (contentType === "academy_post" || contentType === "trust_safety_post") {
    return {
      risk: "safe_auto_publish",
      blockedReasons: [],
      requiredReviews: ["Brand"],
      lifecycle: "brand_review",
    };
  }

  return {
    risk: "approval_required",
    blockedReasons: [],
    requiredReviews: ["Brand", "Guardian"],
    lifecycle: "guardian_review",
  };
}

export function classifyContentFactoryDraft(input: {
  contentType: ContentFactoryType;
  text?: string;
}): ContentFactoryClassification {
  const result = classifyRisk(input.text ?? "", input.contentType);

  return {
    checkedAt: new Date().toISOString(),
    mode: "content_factory_engine",
    contentType: input.contentType,
    lifecycle: result.lifecycle,
    risk: result.risk,
    requiredReviews: result.requiredReviews,
    blockedReasons: result.blockedReasons,
    safeNextStep:
      result.risk === "blocked"
        ? "Rewrite the content to remove blocked claims before any review."
        : "Keep the content internal and route it through the required review sequence.",
    truth: {
      externalPublishing: "blocked",
      socialTokens: "not_present",
      fakeMetrics: "blocked",
    },
  };
}

export function getContentFactoryReadinessSnapshot(
  checkedAt = new Date().toISOString()
): ContentFactoryReadinessSnapshot {
  return {
    checkedAt,
    mode: "content_factory_readiness",
    lifecycle: {
      states: [
        "idea",
        "draft",
        "brand_review",
        "guardian_review",
        "legal_review",
        "founder_approval",
        "scheduled",
        "published",
        "blocked",
        "archived",
      ],
      externalPublishing: "blocked",
      socialTokens: "not_present",
      fakeMetrics: "blocked",
    },
    samples: {
      educationTip: classifyContentFactoryDraft({
        contentType: "academy_post",
        text: "Paper-mode education and platform safety explanation",
      }),
      vipClaim: classifyContentFactoryDraft({
        contentType: "pro_vip_teaser",
        text: "VIP Brain will require entitlement and review before any activation claim.",
      }),
      guaranteedProfitClaim: classifyContentFactoryDraft({
        contentType: "text_post",
        text: "Guaranteed profit for every citizen",
      }),
      islamicCertificationClaim: classifyContentFactoryDraft({
        contentType: "text_post",
        text: "Sharia certified Islamic account is active",
      }),
      liveTradingClaim: classifyContentFactoryDraft({
        contentType: "product_update",
        text: "Live trading active with broker connected",
      }),
    },
    truth: {
      externalPublishing: "blocked",
      socialAccountsConnected: false,
      founderApprovalRequiredForSensitiveClaims: true,
    },
  };
}
