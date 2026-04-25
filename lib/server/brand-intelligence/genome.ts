import "server-only";

import type { BrandGenomeSnapshot } from "./types";

export const BRAND_GENOME_CONSTANTS = Object.freeze([
  "Earth / world signal",
  "Swiss-inspired precision",
  "trust",
  "clarity",
  "safety",
  "premium calm",
  "trading workspace",
  "truthful state language",
  "chart-first principle",
  "no fake claims",
  "no casino feeling",
  "no competitor copying",
  "no uncontracted brand use",
]);

export function getBrandGenomeSnapshot(
  checkedAt = new Date().toISOString()
): BrandGenomeSnapshot {
  return {
    checkedAt,
    mode: "brand_genome",
    constants: [...BRAND_GENOME_CONSTANTS],
    immutable: true,
    truth: {
      noFakeClaims: true,
      noCasinoFeeling: true,
      noCompetitorCopying: true,
      noUncontractedBrandUse: true,
    },
  };
}
