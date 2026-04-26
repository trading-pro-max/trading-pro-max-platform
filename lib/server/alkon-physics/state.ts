import "server-only";

import { getCosmicEventSamples } from "./cosmic-event-classifier";
import { COSMIC_HANDOFFS } from "./handoffs";
import { BLOCKED_LIFECYCLE_RULES, COSMIC_LIFECYCLE } from "./lifecycle";
import { COSMIC_ORBITS } from "./orbit-router";
import { getPlanetSystemOwners } from "./planet-systems";
import { BLACK_HOLE_RULES, RISK_BELT_RULES } from "./risk-zones";
import { SATELLITE_MONITORS } from "./satellites";
import { OPERATING_STATIONS } from "./stations";
import { buildCosmicTaskGraph } from "./task-graph";
import { COSMIC_WORKERS } from "./workers";
import type { AlkonCosmicPhysicsSnapshot } from "./types";

export function getAlkonCosmicPhysicsSnapshot(
  checkedAt = new Date().toISOString()
): AlkonCosmicPhysicsSnapshot {
  const sampleEvents = getCosmicEventSamples(checkedAt);
  const sampleTaskGraphs = [
    buildCosmicTaskGraph(
      {
        source: "founder_feedback",
        title: "logo rejected",
        description: "Founder rejected an Earth identity direction.",
      },
      checkedAt
    ),
    buildCosmicTaskGraph(
      {
        source: "product_truth_conflict",
        title: "live execution requested",
        description: "Live execution and real money activation requested.",
      },
      checkedAt
    ),
    buildCosmicTaskGraph(
      {
        source: "public_boundary_satellite",
        title: "internal term leaked",
        description: "Private command vocabulary appeared in public UI.",
      },
      checkedAt
    ),
  ];

  return {
    snapshotId: "alkon_cosmic_operating_physics",
    name: "Alkon Cosmic Operating Physics",
    arabicName: "ط§ظ„ظƒظˆظ†",
    visibility: "private_founder_only",
    publicExposure: false,
    publicApiRoutesExposed: false,
    founderReadinessRoute: "/api/founder/alkon-physics/readiness",
    cosmicDoctrineStatus: "ready",
    eventClassifierStatus: "ready",
    gravitySystemStatus: "ready",
    orbitRouterStatus: "ready",
    planetOwnersStatus: "ready",
    satelliteNetworkStatus: "ready",
    stationNetworkStatus: "ready",
    workerRegistryStatus: "ready",
    riskBeltStatus: "ready",
    blackHoleZoneStatus: "ready",
    taskGraphStatus: "ready",
    lifecycleStatus: "ready",
    memoryReportingStatus: "ready",
    registrySummary: {
      orbitPaths: Object.keys(COSMIC_ORBITS).length,
      planetOwners: getPlanetSystemOwners().length,
      satellites: Object.keys(SATELLITE_MONITORS).length,
      stations: Object.keys(OPERATING_STATIONS).length,
      workers: Object.keys(COSMIC_WORKERS).length,
      riskRules: RISK_BELT_RULES.length,
      blackHoleRules: BLACK_HOLE_RULES.length,
    },
    requiredCoreLaw: [
      "source",
      "energy",
      "gravity priority",
      "orbit path",
      "planet/system owner",
      "satellite monitoring",
      "station assignment",
      "worker assignment",
      "task passport",
      "Codex License",
      "validation",
      "Result Tribunal",
      "Memory Universe",
      "Founder Command report",
    ],
    lifecycleChain: COSMIC_LIFECYCLE,
    blockedLifecycleRules: BLOCKED_LIFECYCLE_RULES,
    handoffChain: COSMIC_HANDOFFS,
    sampleEvents,
    sampleTaskGraphs,
    nextSafeActions: [
      "Use Cosmic Operating Physics only inside private Founder Command and Alkon readiness contracts.",
      "Route every idea, error, risk, feature, and build task through source, energy, gravity, orbit, owner, satellites, station, worker, passport, license, validation, tribunal, memory, and Founder report.",
      "Keep public users on Trading Pro Max language only; public-looking /api/alkon/physics routes remain absent.",
      "Treat Codex output as manual draft/readiness only; the web app cannot execute shell commands or call Codex.",
    ],
    whatNotToAutomate: [
      "shell execution from the web app",
      "direct Codex calls from the web app",
      "production secret storage or exposure",
      "billing activation",
      "broker/feed activation",
      "live execution",
      "real-money routing",
      "social publishing",
      "email sending",
      "fake users, revenue, metrics, plan activation, legal status, or certification",
    ],
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      productionSecretsUntouched: true,
      socialPublishingInactive: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noPublicAlkonExposure: true,
      noImagesOrRasterAssets: true,
      overall: "preserved",
    },
    createdAt: checkedAt,
  };
}

export function getAlkonCosmicPhysicsReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getAlkonCosmicPhysicsSnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    snapshot,
    lifecycleLength: COSMIC_LIFECYCLE.length,
    handoffCount: COSMIC_HANDOFFS.length,
  };
}
