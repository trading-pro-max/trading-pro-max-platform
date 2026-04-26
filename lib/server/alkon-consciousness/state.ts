import { getAlkonConsciousnessSampleInputs, runAlkonConsciousness } from "./engine";
import { senseAlkonSignal } from "./sense";
import type { AlkonConsciousnessSnapshot } from "./types";

export function getAlkonConsciousnessSnapshot(
  checkedAt = new Date().toISOString()
): AlkonConsciousnessSnapshot {
  const engine = runAlkonConsciousness(getAlkonConsciousnessSampleInputs(), checkedAt);

  return {
    snapshotId: "alkon_sovereign_operating_consciousness",
    name: "Alkon Sovereign Operating Consciousness",
    visibility: "private_founder_only",
    publicExposure: false,
    status: "ready",
    doctrine: {
      notHumanConsciousness: true,
      notIndependentAi: true,
      noUncontrolledAutonomy: true,
      founderFinalAuthority: true,
      productTruthIsLaw: true,
      codexIsWorkerNotRuler: true,
    },
    flow: [
      "sense",
      "meaning",
      "law",
      "gravity",
      "route",
      "act",
      "judge",
      "remember",
      "evolve",
    ],
    latestSignals: engine.latestSignals,
    meaningSummary: engine.meaningSummary,
    lawDecisions: engine.lawDecisions,
    gravityDistribution: engine.gravityDistribution,
    activeRoutes: engine.activeRoutes,
    preparedActions: engine.preparedActions,
    judgments: engine.judgments,
    memoryLessons: engine.memoryLessons,
    evolutionRules: engine.evolutionRules,
    reports: engine.reports,
    nextSafeActions: [
      "Use Sense, Meaning, Law, Gravity, Route, Act, Judge, Remember, and Evolve as private Founder decision support only.",
      "Prepare Task Passports, Codex draft previews, visual review requests, cleanup candidates, or blocked reports without execution.",
      "Keep public Trading Pro Max surfaces free from Alkon, consciousness, Codex, tribunal, and Product Memory internal language.",
      "Require Founder review for visual identity, chart, shell, Assistant behavior, launch, security, secrets, or plan wording changes.",
    ],
    blockedActions: [
      "Do not execute shell commands, call Codex directly, make external calls, send email, create accounts, publish, or connect social accounts from the web app.",
      "Do not activate live execution, real money routing, broker/feed, billing, production, public launch, or plan entitlements.",
      "Do not expose secrets, raw private sensitive data, Alkon, Founder Command, Task Passports, Result Tribunal, or consciousness terms publicly.",
      "Do not generate images or raster assets unless Ahmad explicitly requests them.",
      "Do not fake users, revenue, metrics, Swiss legal/company status, Islamic/Sharia certification, partnerships, downloads, or support backends.",
    ],
    founderDecisionsNeeded: [
      "Choose which prepared Task Passport or Codex draft preview is safe to execute manually outside the web app.",
      "Accept or reject visual work only after requested proof and human review.",
      "Approve future evolution rules before they affect sensitive systems.",
    ],
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
    },
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      socialPublishingInactive: true,
      productionSecretsUntouched: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
      noFakeClaims: true,
      noSecretsExposed: true,
    },
    createdAt: checkedAt,
  };
}

export function getAlkonConsciousnessReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getAlkonConsciousnessSnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    snapshot,
    readiness: {
      status: snapshot.status,
      visibility: snapshot.visibility,
      publicExposure: snapshot.publicExposure,
      flowReady: snapshot.flow.length === 9,
      signals: snapshot.latestSignals.length,
      memoryLessons: snapshot.memoryLessons.length,
      evolutionRules: snapshot.evolutionRules.length,
      preparedActions: snapshot.preparedActions.length,
      blockedActions: snapshot.blockedActions.length,
      noExecution: true,
      noSecrets: true,
      noExternalCalls: true,
    },
  };
}

export function getAlkonConsciousnessSampleSignal(
  text = "duplicate topbars in workspace"
) {
  const signal = senseAlkonSignal({ text, source: "founder" });
  const engine = runAlkonConsciousness([{ text, source: "founder" }]);

  return {
    ok: true,
    signal,
    chain: {
      meaning: engine.meaningSummary[0],
      law: engine.lawDecisions[0],
      gravity: engine.gravityDecisions[0],
      route: engine.activeRoutes[0],
      action: engine.preparedActions[0],
      report: engine.reports[0],
    },
    noExecution: true,
    noSecrets: true,
    previewOnly: true,
  };
}
