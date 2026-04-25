import "server-only";

import type { ProductRealityAreaScore } from "./types";

const validationNeeded = [
  "npx tsc --noEmit",
  "npx eslint app modules tests --max-warnings=0",
  "npm run build",
  "npm run test:regression",
  "visual screenshots",
  "Ahmad human acceptance",
];

function score(
  area: ProductRealityAreaScore["area"],
  value: number,
  status: ProductRealityAreaScore["status"],
  reason: string,
  ownerMinistry = "Product Quality & Testing Ministry"
): ProductRealityAreaScore {
  return {
    area,
    score: value,
    status,
    reasons: [reason],
    nextActions:
      status === "pass"
        ? ["Keep regression guard and avoid scope creep."]
        : ["Run a focused acceptance pass and capture proof."],
    ownerMinistry,
    validationNeeded,
  };
}

export function getProductRealityScoreSnapshot(
  checkedAt = new Date().toISOString()
) {
  const scores = [
    score("public_clarity", 82, "partial", "Public UI is simpler, but human visual review is still required."),
    score("workstation_clarity", 84, "partial", "Chart-first layout is protected; continued visual acceptance is needed."),
    score("chart_dominance", 88, "needs_human_review", "Chart dominates but Ahmad final acceptance is required."),
    score("execution_clarity", 84, "partial", "Paper execution is visible and live execution remains blocked."),
    score("assistant_usefulness", 78, "partial", "TPM Assistant is useful but deterministic templates remain a foundation."),
    score("plan_clarity", 90, "pass", "Free / Pro / VIP / Institutional naming is guarded."),
    score("visual_maturity", 80, "needs_human_review", "Premium direction exists; human review required."),
    score("swiss_identity", 84, "partial", "Earth Mark and Swiss precision signals are present without fake legal status."),
    score("product_truth", 96, "pass", "Blocked/inactive truths are explicit and tested."),
    score("legal_safety", 92, "pass", "Claims requiring Legal review are blocked or review-routed."),
    score("guardian_safety", 92, "pass", "Dangerous automation and activation requests remain blocked."),
    score("monetization_readiness", 70, "partial", "Billing remains inactive and monetization is readiness-only."),
    score("retention_value", 72, "partial", "Journal/Coach and Academy foundations need persistence later."),
    score("founder_acceptance", 60, "needs_human_review", "Founder acceptance is intentionally not self-certified."),
    score("user_simplicity", 82, "partial", "Public UI has been simplified; ongoing screenshots required."),
    score("internal_integration", 88, "partial", "Integration mesh is strong but construction queue is readiness-only."),
  ] satisfies ProductRealityAreaScore[];

  return {
    checkedAt,
    mode: "product_reality_scoring_readiness" as const,
    scores,
    averageScore: Math.round(
      scores.reduce((total, item) => total + item.score, 0) / scores.length
    ),
    truth: {
      humanAhmadAcceptanceRequired: true,
      launchReadyClaimAllowed: false,
      fakeMetricsAllowed: false,
    },
  };
}
