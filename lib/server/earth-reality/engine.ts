import { getEarthEnvironmentLayerChecks } from "./environment-layer";
import { getEarthHumanLayerChecks } from "./human-layer";
import { getEarthLawTrustLayerChecks } from "./law-trust-layer";
import { getEarthLearningSupportLayerChecks } from "./learning-support-layer";
import { getEarthMarketLayerChecks } from "./market-layer";
import { getEarthPlacePrivacyLayerChecks } from "./place-privacy-layer";
import { getEarthProductTruthLayerChecks } from "./product-truth-layer";
import { getPublicWorldMatrix } from "./public-world-matrix";
import { getEarthTimeLayerChecks } from "./time-layer";
import type {
  EarthRealityCheck,
  EarthRealityDecision,
  EarthRealityLayer,
  EarthRealityLayerSummary,
  EarthRealitySnapshot,
} from "./types";

const layerLabels: Record<EarthRealityLayer, string> = {
  human: "Earth Human Layer",
  time: "Earth Time Layer",
  place_privacy: "Earth Place / Privacy Layer",
  market: "Earth Market Layer",
  law: "Earth Law Layer",
  trust: "Earth Trust Layer",
  learning: "Earth Learning Layer",
  support: "Earth Support Layer",
  environment: "Earth Environment Layer",
  product_truth: "Earth Product Truth Layer",
};

function summarizeLayer(
  layer: EarthRealityLayer,
  checks: EarthRealityCheck[]
): EarthRealityLayerSummary {
  const layerChecks = checks.filter((check) => check.layer === layer);
  const blocked = layerChecks.filter((check) => check.decision === "blocked").length;
  const needsReview = layerChecks.filter((check) =>
    ["needs_review", "founder_review_required"].includes(check.decision)
  ).length;
  const status: EarthRealityDecision =
    blocked > 0 ? "blocked" : needsReview > 0 ? "needs_review" : "pass";

  return {
    layer,
    label: layerLabels[layer],
    status,
    pass: layerChecks.filter((check) => check.decision === "pass").length,
    needsReview,
    blocked,
    nextSafeAction:
      layerChecks.find((check) => check.decision !== "pass")?.requiredFix ??
      "Keep this layer truthful, public-safe, and validated.",
  };
}

function calculateScore(checks: EarthRealityCheck[]) {
  const score = checks.reduce((total, check) => {
    if (check.decision === "pass") return total + 1;
    if (check.decision === "future") return total + 0.6;
    if (check.decision === "needs_review") return total + 0.5;
    if (check.decision === "founder_review_required") return total + 0.35;
    return total;
  }, 0);

  return Number(((score / checks.length) * 9.1).toFixed(1));
}

export function getEarthRealitySnapshot(
  checkedAt = new Date().toISOString()
): EarthRealitySnapshot {
  const checks = [
    ...getEarthHumanLayerChecks(),
    ...getEarthTimeLayerChecks(checkedAt),
    ...getEarthPlacePrivacyLayerChecks(),
    ...getEarthMarketLayerChecks(),
    ...getEarthLawTrustLayerChecks(),
    ...getEarthLearningSupportLayerChecks(),
    ...getEarthEnvironmentLayerChecks(),
    ...getEarthProductTruthLayerChecks(),
  ];
  const layers = (Object.keys(layerLabels) as EarthRealityLayer[]).map((layer) =>
    summarizeLayer(layer, checks)
  );
  const blockedViolations = checks
    .filter((check) => check.decision === "blocked")
    .map((check) => `${check.checkId}: ${check.reason}`);
  const founderReviewNeeded = checks
    .filter((check) => check.decision === "founder_review_required")
    .map((check) => check.requiredFix);
  const score = calculateScore(checks);

  return {
    checkedAt,
    mode: "earth_reality_constitution",
    status: blockedViolations.length > 0 ? "blocked" : "ready_with_notes",
    score,
    layers,
    surfaces: getPublicWorldMatrix(),
    publicReadiness: "ready_with_notes",
    privacyReadiness: "ready",
    productTruthReadiness: "preserved",
    supportReadiness: "readiness_only",
    learningReadiness: "ready",
    marketReadiness: "paper_safe",
    environmentReadiness: "privacy_safe",
    launchGateReadiness: "inactive_guarded",
    publicPrivateBoundaryStatus: "preserved",
    blockedViolations,
    nextSafeActions: [
      "Keep Earth as the public reference reality for every user-facing decision.",
      "Keep Personal Reality changes Assistant-explained, plan-aware, and Product Truth guarded.",
      "Keep Free complete and paper-safe while Pro, VIP, and Institutional remain planned/future unless entitled.",
      "Keep private command systems behind the public boundary.",
    ],
    founderReviewNeeded,
    checks,
    publicDiagnosticsSummary: {
      label: "Earth Reality",
      status: "ready_with_notes",
      copy:
        "Earth Reality keeps public surfaces human, truthful, privacy-safe, paper-safe, and clearly active/planned/future.",
      visibleToPublic: true,
    },
    privateReadinessSummary: {
      label: "Earth Reality Constitution",
      founderVisible: true,
      publicExposure: false,
      checks: checks.length,
    },
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedBillingInactive: true,
      productionInactive: true,
      socialPublishingInactive: true,
      noFakeClaims: true,
      noPrivateTermsPublic: true,
      noImagesOrRasterAssets: true,
    },
  };
}
