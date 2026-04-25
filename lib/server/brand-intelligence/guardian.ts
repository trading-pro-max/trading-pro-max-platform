import "server-only";

import type {
  BrandAudience,
  BrandSurface,
  IdentityGuardianOutcome,
  IdentityGuardianReview,
} from "./types";

type IdentityGuardianInput = {
  audience: BrandAudience;
  surface: BrandSurface;
  copy?: string;
  motionIntensity?: "none" | "low" | "medium" | "high";
  chartPriority?: "low" | "medium" | "high";
  occasionTheme?: string;
};

const blockedPatterns = [
  /guaranteed profit/i,
  /win[- ]?rate/i,
  /swiss (regulated|certified|company|bank)/i,
  /sharia certified|islamic certified/i,
  /official partnership|partnered with/i,
  /live execution active|real[- ]money active/i,
  /billing active|broker feed active/i,
];

const internalPublicLeakPatterns = [
  /Founder King/i,
  /Kingdom/i,
  /\bministries\b/i,
  /\bcouncils\b/i,
  /\bstates\b/i,
  /presidency/i,
  /governance/i,
  /ruler/i,
  /Founder Command as a user plan/i,
  /\bEnterprise\b/i,
];

function reviewOutcome(
  reasons: string[],
  blockedReasons: string[]
): IdentityGuardianOutcome {
  if (blockedReasons.length > 0) return "blocked";
  if (reasons.some((reason) => reason.includes("Founder approval"))) {
    return "founder_approval_required";
  }
  if (reasons.length > 0) return "review_required";
  return "safe";
}

export function reviewIdentityExpression(
  input: IdentityGuardianInput,
  checkedAt = new Date().toISOString()
): IdentityGuardianReview {
  const copy = input.copy ?? "";
  const reasons: string[] = [];
  const blockedReasons: string[] = [];
  const requiredReviews = new Set<string>();

  for (const pattern of blockedPatterns) {
    if (pattern.test(copy)) {
      blockedReasons.push("Unsafe claim blocked by identity rules.");
      requiredReviews.add("Legal");
      requiredReviews.add("Guardian");
    }
  }

  if (input.audience === "public" || input.audience === "authenticated_user") {
    for (const pattern of internalPublicLeakPatterns) {
      if (pattern.test(copy)) {
        blockedReasons.push("Public surfaces cannot show restricted internal identity terms.");
        requiredReviews.add("Identity Guardian");
      }
    }
  }

  if (input.chartPriority === "high" && input.motionIntensity === "high") {
    blockedReasons.push("High motion is blocked on chart-priority surfaces.");
    requiredReviews.add("Visual Quality");
  }

  if (
    input.occasionTheme &&
    input.occasionTheme !== "default" &&
    (input.audience === "public" || input.audience === "authenticated_user")
  ) {
    reasons.push("Founder approval required for public occasion themes.");
    requiredReviews.add("Founder approval");
    requiredReviews.add("Legal");
    requiredReviews.add("Guardian");
  }

  const outcome = reviewOutcome(reasons, blockedReasons);

  return {
    checkedAt,
    outcome,
    reasons,
    blockedReasons,
    safeAlternative:
      outcome === "safe"
        ? "Expression can remain within current visual system."
        : "Use public-safe Trading Pro Max language, low motion, no fake claims, and no restricted internal terms.",
    requiredReviews: [...requiredReviews],
  };
}

export function getIdentityGuardianSnapshot(checkedAt = new Date().toISOString()) {
  return {
    checkedAt,
    mode: "identity_guardian",
    status: "ready" as const,
    blockedCategories: [
      "visual clutter",
      "excessive motion",
      "casino/neon style",
      "childish/fantasy visuals",
      "internal term leaks in public UI",
      "Founder Command as user plan",
      "Enterprise public label",
      "fake Swiss legal/company claim",
      "fake Sharia certification",
      "fake Pro/VIP/Institutional activation",
      "fake partnership",
      "uncontracted brand/company use",
      "chart-distracting motion",
      "unreviewed occasion themes",
    ],
    samples: {
      publicInternalTermLeak: reviewIdentityExpression({
        audience: "public",
        surface: "public_entry",
        copy: "Founder Command as a user plan",
      }, checkedAt),
      fakeSwissClaim: reviewIdentityExpression({
        audience: "public",
        surface: "public_entry",
        copy: "Swiss certified trading company",
      }, checkedAt),
      chartHighMotion: reviewIdentityExpression({
        audience: "authenticated_user",
        surface: "workstation",
        motionIntensity: "high",
        chartPriority: "high",
      }, checkedAt),
    },
    truth: {
      publicInternalTerminologyAllowed: false,
      fakeClaimsAllowed: false,
      chartDistractionAllowed: false,
    },
  };
}
