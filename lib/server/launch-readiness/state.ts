import "server-only";

import type {
  RealWorldLaunchReadinessDiagnosticsProbe,
  RealWorldLaunchReadinessSnapshot,
} from "./types";
import { getBetaReadinessSnapshot } from "./beta";
import { getBillingReadinessSnapshot } from "./billing-readiness";
import { getLaunchBudgetSnapshot } from "./budget";
import { getLaunchInfrastructureSnapshot } from "./infrastructure";
import { getLaunchGateSnapshot, launchReadinessTruth } from "./launch-gate";
import { getLegalReadinessSnapshot } from "./legal";
import { getSupportReadinessSnapshot } from "./support";
import { getWaitlistReadinessSnapshot } from "./waitlist";

const stages: RealWorldLaunchReadinessSnapshot["stages"] = [
  "laptop_planet",
  "waitlist",
  "soft_launch_paper_only",
  "pro_paid_limited_later",
  "production_economic",
  "public_launch_after_gate",
];

export function getRealWorldLaunchReadinessSnapshot(
  checkedAt = new Date().toISOString()
): RealWorldLaunchReadinessSnapshot {
  const budget = getLaunchBudgetSnapshot(checkedAt);
  const infrastructure = getLaunchInfrastructureSnapshot(checkedAt);
  const waitlist = getWaitlistReadinessSnapshot(checkedAt);
  const legal = getLegalReadinessSnapshot(checkedAt);
  const support = getSupportReadinessSnapshot(checkedAt);
  const billing = getBillingReadinessSnapshot(checkedAt);
  const beta = getBetaReadinessSnapshot(checkedAt);
  const gate = getLaunchGateSnapshot({
    checkedAt,
    budget,
    infrastructure,
    waitlist,
    legal,
    support,
    billing,
    beta,
  });

  return {
    checkedAt,
    mode: "real_world_launch_readiness_gate",
    status: "partial",
    stages,
    budget,
    infrastructure,
    waitlist,
    legal,
    support,
    billing,
    beta,
    gate,
    founderCommand: {
      budgetCapChf: 250,
      finalDecisionRequired: true,
      blockedActivations: [
        "launch",
        "production",
        "billing",
        "broker/feed",
        "live execution",
        "real money",
        "social publishing",
        "external account creation",
      ],
      nextSafeAction: gate.nextSafeAction,
    },
    truth: launchReadinessTruth,
  };
}

export function getRealWorldLaunchReadinessDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): RealWorldLaunchReadinessDiagnosticsProbe {
  const snapshot = getRealWorldLaunchReadinessSnapshot(checkedAt);

  return {
    key: "real_world_launch_readiness",
    label: "Real-world readiness gate",
    status: "blocked",
    summary: "Future launch readiness is modeled; activation remains blocked",
    detail:
      `${snapshot.budget.initialOperatingTargetChf}/${snapshot.budget.monthlyCapChf} CHF planned. Gate has ${snapshot.gate.blockers.length} blocker(s); Founder final decision is required. No production, billing, broker/feed, live execution, real money, or publishing is active.`,
    checkedAt,
  };
}
