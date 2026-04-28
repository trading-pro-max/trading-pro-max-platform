import { PRODUCT_TRUTH, realityConversionPassports } from "./passport";
import { realityConversionResources } from "./resources";
import type { RealityConversionSnapshot } from "./types";

export function getRealityConversionSnapshot(
  checkedAt = new Date().toISOString()
): RealityConversionSnapshot {
  return {
    checkedAt,
    status: "active_with_notes",
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noPublicExposure: true,
    passports: realityConversionPassports,
    resources: realityConversionResources,
    productTruth: PRODUCT_TRUTH,
    firstRealityStep: "Review evidence, classify through Jar, then prepare a Command Passport if safe.",
    oneNextRealityAction:
      "Ahmad reviews the current Living Earth and Trading proof before Local Day One.",
    blockedActions: [
      "web shell execution",
      "web Codex execution",
      "billing activation",
      "live trading",
      "real money",
      "broker/feed activation",
      "public Alkon exposure",
      "unknown-license assets",
      "fake claims",
    ],
    evidenceRequired: [
      "Wake Report",
      "visual proof",
      "full regression",
      "route smoke",
      "Product Truth report",
    ],
    returnsToZeroTruth: true,
  };
}
