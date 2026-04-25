import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getBuildPlannerReadinessSnapshot } from "@/lib/server/build-planner";
import { getContentFactoryReadinessSnapshot } from "@/lib/server/content-factory";
import {
  classifyPlanetConstructionEvent,
  getPlanetEventReadinessSamples,
} from "@/lib/server/planet-events";
import {
  getInterMinistryCoordinationSnapshot,
  getPlanetBlueprintSnapshot,
} from "@/lib/server/planet-os";
import { getProductTruthSnapshot } from "@/lib/server/product";
import { getVisualAcceptanceSnapshot } from "@/lib/server/visual-acceptance";
import type {
  PlanetConsciousnessLoopStep,
  PlanetConsciousnessSnapshot,
} from "./types";

const coreLoop: PlanetConsciousnessLoopStep[] = [
  "observe",
  "understand",
  "classify",
  "route",
  "decide",
  "draft",
  "validate",
  "learn",
  "report",
];

export function getPlanetConsciousnessSnapshot(
  checkedAt = new Date().toISOString()
): PlanetConsciousnessSnapshot {
  const productTruth = getProductTruthSnapshot(checkedAt);
  const planEntitlements = getPlanEntitlementSnapshot("demo_free", checkedAt);
  const visualAcceptance = getVisualAcceptanceSnapshot(checkedAt);
  const contentFactory = getContentFactoryReadinessSnapshot(checkedAt);
  const buildPlanner = getBuildPlannerReadinessSnapshot(checkedAt);
  const blueprint = getPlanetBlueprintSnapshot(checkedAt);
  const coordination = getInterMinistryCoordinationSnapshot(checkedAt);
  const observedEvents = [
    ...getPlanetEventReadinessSamples(checkedAt),
    classifyPlanetConstructionEvent(
      {
        title: "Missing screenshot proof after visual polish",
        affectedArea: "Visual Acceptance",
        affectedFiles: ["test-results"],
      },
      checkedAt
    ),
  ];
  const riskSummary = observedEvents.reduce<PlanetConsciousnessSnapshot["riskSummary"]>(
    (summary, event) => {
      summary[event.riskLevel] += 1;
      return summary;
    },
    { low: 0, medium: 0, high: 0, critical: 0 }
  );

  return {
    checkedAt,
    mode: "tpm_planet_consciousness_layer",
    coreLoop,
    inputs: [
      "Product Truth",
      "Plan Entitlements",
      "TPM Assistant Context",
      "Why Blocked / State Explanations",
      "Guardian + Legal Rules",
      "Founder Command Reporting",
      "Visual Acceptance",
      "Content Factory",
      "AI Build Planner",
      "Planet Hierarchy",
      "Presidency Coordination",
      "Diagnostics",
      "Validation Results",
    ],
    outputs: [
      "consciousness snapshot",
      "top gaps",
      "top risks",
      "safe actions",
      "blocked actions",
      "Founder approval needs",
      "Codex task draft candidates",
      "validation recommendations",
      "learning notes",
    ],
    consciousnessStatus: "ready_readiness_only",
    topGaps: [
      "Persistent journal storage remains a future productization gap.",
      "Human visual acceptance by Ahmad remains required for final visual approval.",
      "Owner-only command app auth/device trust remains planned.",
    ],
    topRisks: [
      "Any request to activate launch, billing, live execution, real money, broker/feed, secrets, or social publishing must remain blocked.",
      "Public UI must continue using Free / Pro / VIP / Institutional language only.",
      "Assistant and media drafts must not imply guaranteed profit, win-rate, or AI certainty.",
    ],
    topSafeActions: [
      "Draft scoped visual polish tasks with screenshots and public-language guards.",
      "Keep Product Truth checks attached to Assistant, plan, diagnostics, and Founder reports.",
      "Use construction queue drafts for Codex prompts; do not auto-send or auto-execute them.",
    ],
    blockedActions: [
      "live execution activation",
      "real-money routing",
      "broker/feed activation",
      "billing activation",
      "public launch",
      "production secret changes",
      "social publishing",
    ],
    founderApprovalNeeds: [
      "partnership claims",
      "VIP/Pro/Institutional activation wording",
      "Islamic/Sharia wording",
      "media campaigns",
      "pricing or performance-fee research",
    ],
    codexTaskDraftCandidates: [
      "public-language leak audit",
      "chart-first visual acceptance pass",
      "TPM Assistant blocked-intent copy cleanup",
      "diagnostics readiness compaction",
    ],
    validationRecommendations: buildPlanner.plans.chartPolish.suggestedValidation,
    learningNotes: [
      `Product truth currently reports live=${productTruth.summary.liveExecution}, billing=${productTruth.summary.billing}, launch=${productTruth.summary.publicLaunch}.`,
      `Plan snapshot keeps ${planEntitlements.plans.map((plan) => `${plan.planName}:${plan.truthState}`).join(", ")}.`,
      `Visual acceptance status is ${visualAcceptance.status}; human acceptance remains ${visualAcceptance.truth.humanAcceptanceRequired ? "required" : "not required"}.`,
      `Content factory publishing is ${contentFactory.truth.externalPublishing} and social tokens are ${contentFactory.truth.socialTokens}.`,
      `Hierarchy summary: ${blueprint.structure.continents} continents, ${blueprint.structure.ministries} ministries; coordination workflows=${coordination.summary.workflows}.`,
    ],
    observedEvents,
    riskSummary,
    truth: {
      readinessOnly: true,
      externalExecution: "not_enabled",
      productionActions: "blocked",
      secrets: "not_allowed",
      fakeMetrics: "not_allowed",
    },
  };
}
