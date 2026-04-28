import type { BrandMigrationPlan } from "./types";

export function getBrandMigrationPlan(): BrandMigrationPlan {
  return {
    status: "plan_only",
    executeNow: false,
    steps: [
      "Keep Alkon private.",
      "Map Pro Max working name to the approved final public brand only after clearance.",
      "Map Pro Max Trading to the first product name only after clearance.",
      "Update public routes and copy carefully with compatibility redirects where needed.",
      "Update docs, reports, README, assets, and tests after Ahmad approval.",
      "Preserve Product Truth, public/private boundary, and paper-safe language.",
    ],
    forbiddenNow: [
      "mass rename",
      "public launch",
      "domain purchase",
      "trademark ownership claim",
      "Swiss legal/regulatory claim",
      "public Alkon exposure",
    ],
  };
}
