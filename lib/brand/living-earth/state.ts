import { getLivingEarthAssetPolicy } from "./asset-policy";
import { getLivingEarthEvolutionState } from "./evolution";
import { getLivingEarthRenderDecision } from "./render-decision";
import type { LivingEarthRuntimeState, LivingEarthSurface } from "./types";

export const LIVING_EARTH_SURFACES: readonly LivingEarthSurface[] = [
  "home_hero",
  "public_header_logo",
  "compact_logo",
  "trading_workspace",
  "trading_chart_atmosphere",
  "settings",
  "diagnostics",
  "founder_private_preview",
  "future_world_ready",
] as const;

export function getLivingEarthRuntimeState(
  checkedAt = new Date().toISOString()
): LivingEarthRuntimeState {
  const assetPolicy = getLivingEarthAssetPolicy();

  return {
    checkedAt,
    status: "active_with_notes",
    acceptanceStatus: "needs_ahmad_review",
    assetStatus: assetPolicy.assetStatus,
    truth: {
      codeDriven: true,
      noExternalImages: true,
      noGeneratedImages: true,
      noUnknownLicenseAssets: true,
      noSwissRegulatoryClaim: true,
      chartProtection: "chart_must_remain_king",
      proceduralFallbackIsPhotoreal: false,
    },
    renderDecisions: LIVING_EARTH_SURFACES.map((surface) =>
      getLivingEarthRenderDecision({ surface })
    ),
    evolution: getLivingEarthEvolutionState(),
    publicSummary:
      "Living Earth is active as the public Pro Max identity through code-driven procedural/hybrid rendering.",
    privateSummary:
      "Alkon governs Living Earth evolution privately through Asset Law, Product Truth, evidence, and Ahmad visual acceptance.",
  };
}
