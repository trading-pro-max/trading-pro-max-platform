import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getPrivateFounderRealm, getPublicPlanRealms } from "@/lib/plans/realms";
import { getAlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";
import { getAlkonCosmicPhysicsSnapshot } from "@/lib/server/alkon-physics";
import { getInvisibleOperatingLayerSnapshot } from "@/lib/server/invisible-operating-layer";
import {
  getLocalDailyOperationsLoopSnapshot,
  getLocalDailyOperationsReportSnapshot,
  getLocalLivingDayLoopSnapshot,
} from "@/lib/server/local-ops";
import { getProductTruthSnapshot } from "@/lib/server/product";
import {
  getProductMemoryDailySummarySnapshot,
  getProductMemorySummarySnapshot,
} from "@/lib/server/product-memory";
import { getSecuritySovereigntySnapshot } from "@/lib/server/security-sovereignty";
import { getSecretsAuthoritySnapshot } from "@/lib/server/secrets-authority";
import {
  getFounderIdeaInboxReadiness,
  getFounderSovereignAutonomyRoomSnapshot,
  getSovereignAutonomyReadinessSnapshot,
} from "@/lib/server/sovereign-autonomy";
import { getWorldInterfaceSnapshot } from "@/lib/server/world-interface";
import { buildAlkonUniverseMap } from "./universe-map";
import type { AlkonProductTruthStatus, AlkonSubsystem, AlkonUniverseSnapshot } from "./types";

function requireSubsystem(
  systems: AlkonSubsystem[],
  id: AlkonSubsystem["id"]
): AlkonSubsystem {
  const subsystem = systems.find((item) => item.id === id);

  if (!subsystem) {
    throw new Error(`Missing Alkon subsystem ${id}.`);
  }

  return subsystem;
}

function buildProductTruthStatus(): AlkonProductTruthStatus {
  return {
    liveExecutionBlocked: true,
    realMoneyBlocked: true,
    brokerFeedActivationBlocked: true,
    billingActivationBlocked: true,
    publicLaunchInactive: true,
    socialPublishingInactive: true,
    productionSecretsUntouched: true,
    noFakeUsersRevenueMetrics: true,
    noShellExecutionFromWebApp: true,
    noDirectCodexExecutionFromWebApp: true,
    noPublicAlkonExposure: true,
    authSecurityPreserved: true,
    overall: "preserved",
  };
}

export function getAlkonUniverseSnapshot(
  checkedAt = new Date().toISOString()
): AlkonUniverseSnapshot {
  const productTruth = getProductTruthSnapshot(checkedAt);
  const planEntitlements = getPlanEntitlementSnapshot("demo_free", checkedAt);
  const publicRealms = getPublicPlanRealms();
  const privateRealm = getPrivateFounderRealm();
  const localDailyLoop = getLocalDailyOperationsLoopSnapshot(checkedAt);
  const localDailyReport = getLocalDailyOperationsReportSnapshot(checkedAt);
  const localLivingDayLoop = getLocalLivingDayLoopSnapshot(checkedAt);
  const sovereignAutonomy = getSovereignAutonomyReadinessSnapshot(checkedAt);
  const founderRoom = getFounderSovereignAutonomyRoomSnapshot(checkedAt);
  const ideaInbox = getFounderIdeaInboxReadiness(checkedAt);
  const productMemory = getProductMemorySummarySnapshot(checkedAt);
  const productMemoryDaily = getProductMemoryDailySummarySnapshot(checkedAt);
  const security = getSecuritySovereigntySnapshot(checkedAt);
  const secrets = getSecretsAuthoritySnapshot(checkedAt);
  const worldInterface = getWorldInterfaceSnapshot(checkedAt);
  const invisibleLayer = getInvisibleOperatingLayerSnapshot(checkedAt);
  const cosmicPhysics = getAlkonCosmicPhysicsSnapshot(checkedAt);
  const sovereignOperatingConsciousness =
    getAlkonConsciousnessSnapshot(checkedAt);
  const universeMap = buildAlkonUniverseMap();

  return {
    universeId: "alkon_private_command_universe",
    name: "Alkon",
    arabicName: "الكون",
    visibility: "private_founder_only",
    publicExposure: false,
    earthPublicWorld: {
      ...requireSubsystem(universeMap, "earth_command"),
      readiness:
        `${publicRealms.length} public realms are modeled for Trading Pro Max; ${publicRealms.map((realm) => `${realm.publicPlanName}:${realm.activationState}`).join(", ")}.`,
      nextAction:
        "Keep public users in Trading Pro Max surfaces only; Alkon remains hidden from plans, navigation, Assistant, Settings, and Diagnostics.",
    },
    moonCycle: {
      ...requireSubsystem(universeMap, "moon_cycle"),
      readiness:
        `${localDailyLoop.summary.totalStages} daily loop stages, local day ${localDailyReport.dayNumber}, and Codebase Reality Audit ${localLivingDayLoop.codebaseRealityAudit.status} are summarized for closed laptop review.`,
      nextAction: localLivingDayLoop.today.nextSafeAction,
    },
    orbitCommand: {
      ...requireSubsystem(universeMap, "orbit_command"),
      readiness:
        `${ideaInbox.recentIdeaExamples.length} idea examples, ${founderRoom.eventQueueSummary.total} internal events, ${founderRoom.taskPassportsReady.length} valid passports, and ${founderRoom.codexDraftsReady.length} manual draft modes are ready for review.`,
      nextAction: founderRoom.nextSafeAction,
    },
    solarCommand: {
      ...requireSubsystem(universeMap, "solar_command"),
      readiness:
        `Founder priority law points to safe local scope; product truth summary keeps live execution ${productTruth.summary.liveExecution}, real money ${productTruth.summary.realMoneyRouting}, billing ${productTruth.summary.billing}, and public launch ${productTruth.summary.publicLaunch}.`,
      nextAction:
        "Approve only safe local build work; postpone public launch, production, billing, broker/feed, live execution, real money, and social publishing.",
    },
    planetarySystems: {
      ...requireSubsystem(universeMap, "planetary_systems"),
      readiness:
        `Plan entitlements expose ${planEntitlements.plans.length} public plans while ${privateRealm.realmName} stays ${privateRealm.activationState}.`,
      nextAction:
        "Review plan, Assistant, Journal/Coach, Academy, Community, media, diagnostics, and integrations gaps privately without exposing internal governance.",
    },
    defenseUniverse: {
      ...requireSubsystem(universeMap, "defense_universe"),
      readiness:
        `${security.authorities.length} security authorities and ${secrets.categories.length} secret categories are status-only; raw values visible: ${secrets.summary.rawValuesVisible}.`,
      nextAction:
        "Keep owner command protection planned, values hidden, red/blue/purple work defensive, and incident readiness evidence-safe.",
    },
    constructionUniverse: {
      ...requireSubsystem(universeMap, "construction_universe"),
      readiness:
        `${sovereignAutonomy.taskPassports.filter((passport) => passport.valid).length} valid Task Passports, ${sovereignAutonomy.codexSubmitReadiness.drafts.length} manual Codex drafts, and ${sovereignAutonomy.tribunalReports.length} tribunal samples are available.`,
      nextAction:
        "Use Task Passports and Result Tribunal before accepting any work; the web app never executes shell commands or calls Codex directly.",
    },
    memoryUniverse: {
      ...requireSubsystem(universeMap, "memory_universe"),
      readiness:
        `${productMemory.domainSummary.length} memory domains and ${productMemoryDaily.productGaps.open} open product gaps are summarized without secrets or raw private sensitive data.`,
      nextAction:
        "Record safe lessons about accepted patterns, visual feedback, no-images preference, logo history, chart annoyance, and validation summaries.",
    },
    worldInterface: {
      ...requireSubsystem(universeMap, "world_interface"),
      readiness:
        `${worldInterface.channelSummary.total} external channel categories are classified; connected ${worldInterface.channelSummary.connected}, token stored ${worldInterface.channelSummary.tokenStored}, sending ${worldInterface.channelSummary.sendingEnabled}, publishing ${worldInterface.channelSummary.publishingEnabled}.`,
      nextAction:
        "Keep email, social, support, partner, media, and security channels in draft/quarantine readiness with no sending, publishing, or tokens.",
    },
    invisibleOperatingLayer: {
      ...requireSubsystem(universeMap, "invisible_operating_layer"),
      readiness:
        `${invisibleLayer.systems.length} invisible systems map to ${invisibleLayer.publicSafeOutputs.length} public-safe outputs; ${invisibleLayer.hiddenFromPublic.length} internal systems stay hidden.`,
      nextAction:
        "Translate private readiness into public-safe state labels while keeping internal systems invisible.",
    },
    cosmicPhysics,
    sovereignOperatingConsciousness,
    universeMap,
    nextSafeActions: [
      "Keep Alkon and الكون private to Founder Command and founder-only readiness APIs.",
      "Use Alkon Cosmic Operating Physics privately so every idea, error, risk, feature, or task receives source, energy, gravity, orbit, owner, satellite, station, worker, passport, Codex License, validation, tribunal, memory, and Founder report.",
      "Use Alkon Sovereign Operating Consciousness privately to sense, interpret, law-check, prioritize, route, prepare, judge, remember, and evolve work under Founder authority.",
      "Keep public users inside Trading Pro Max, Free, Pro, VIP, Institutional, TPM Assistant, workspace, settings, diagnostics, and readiness language only.",
      "Use Founder Idea Inbox, Task Passports, manual Codex drafts, Result Tribunal, and Memory lessons as review-only systems.",
      "Add future private execution only after owner auth, device trust, step-up confirmation, audit, security, legal, and Product Truth gates exist.",
    ],
    blockedActions: [
      "Expose Alkon, الكون, Founder Command, ministries, councils, governance, construction queue, secrets authority, or product memory internals to normal users.",
      "Create public Alkon navigation, public plan access, public upgrade logic, or public Assistant output.",
      "Run shell commands, call Codex directly, submit tasks externally, connect social accounts, send email, publish, activate billing, activate broker/feed, enable live execution, route real money, or launch production from the web app.",
      "Fake users, revenue, metrics, Pro/VIP/Institutional activation, Swiss legal/company status, or Islamic/Sharia certification.",
    ],
    founderDecisionNeeded: [
      "Confirm when owner-only authentication, device trust, step-up confirmation, and audit-backed actions should be designed.",
      "Choose the next safe local build task from Founder Idea Inbox and Product Memory gaps.",
      "Review public/private boundary evidence before any private route becomes navigable.",
      "Keep real-world activation postponed until actual external setup and review gates exist.",
    ],
    productTruthStatus: buildProductTruthStatus(),
    apiExposure: {
      publicAlkonRoutesExposed: false,
      founderReadinessRoute: "/api/founder/alkon/readiness",
      founderPhysicsReadinessRoute: "/api/founder/alkon-physics/readiness",
      founderConsciousnessReadinessRoute:
        "/api/founder/alkon-consciousness/readiness",
      publicRouteDecision:
        "Non-founder /api/alkon/* and /api/alkon/physics/* routes were not created because Alkon and Cosmic Operating Physics are not public product surfaces.",
      routeMode: "read_only_status_only",
      secretsExposed: false,
      privateSensitiveDataExposed: false,
      executionEndpointsExposed: false,
    },
    createdAt: checkedAt,
  };
}
