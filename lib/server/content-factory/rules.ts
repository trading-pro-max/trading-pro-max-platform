import "server-only";

import type {
  ContentFactoryClassification,
  ContentFactoryLifecycle,
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
