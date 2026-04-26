import { createLegitimacyReview } from "./dimensions";
import type {
  AlkonLegitimacyRequest,
  AlkonTimingLegitimacyResult,
} from "./types";

const STAGE_ORDER = [
  "laptop_planet",
  "waitlist",
  "private_beta",
  "soft_launch_paper_only",
  "production_economic",
  "public_launch",
] as const;

function stageIndex(stage: AlkonLegitimacyRequest["currentStage"]) {
  return STAGE_ORDER.indexOf(stage);
}

function requiredStageFor(request: AlkonLegitimacyRequest) {
  if (
    request.actionCategory === "billing_activation" ||
    request.actionCategory === "production_activation" ||
    request.actionCategory === "real_money_activation" ||
    request.actionCategory === "broker_feed_activation" ||
    request.actionCategory === "live_execution_activation"
  ) {
    return "production_economic" as const;
  }
  if (request.actionCategory === "social_publishing" || request.actionCategory === "ad_spend") {
    return "private_beta" as const;
  }
  return "laptop_planet" as const;
}

export function reviewTimingLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonTimingLegitimacyResult {
  const requiredStage = requiredStageFor(request);
  const premature = stageIndex(request.currentStage) < stageIndex(requiredStage);
  const forbiddenNow = [
    "billing_activation",
    "production_activation",
    "broker_feed_activation",
    "live_execution_activation",
    "real_money_activation",
  ].includes(request.actionCategory);
  const outcome = forbiddenNow
    ? "blocked"
    : premature
      ? "delayed_until_ready"
      : "pass";
  const review = createLegitimacyReview(
    request,
    "timing_legitimacy",
    outcome,
    outcome === "pass"
      ? "Action fits the current local/laptop readiness stage."
      : "Action is premature for the current stage and must wait for readiness gates.",
    {
      evidenceNeeded: ["stage", "legal readiness", "support readiness", "security readiness", "audit/cleanup status"],
      requiredReview: outcome === "pass" ? [] : ["Launch/readiness timing review"],
      safeAlternative: "Keep as readiness model, draft, or Founder report until the stage exists.",
      memoryLesson: "Right action at wrong time becomes unsafe.",
    }
  );

  return {
    ...review,
    currentStage: request.currentStage,
    requiredStage,
    readinessGap:
      outcome === "pass"
        ? "none"
        : `Requires ${requiredStage}; current stage is ${request.currentStage}.`,
  };
}
