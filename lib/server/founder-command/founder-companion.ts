import "server-only";

import {
  getFounderHybridEarthTextureReadiness,
  getPrivateBrandUniverse,
} from "@/lib/brand";
import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getPrivateFounderRealm, getPublicPlanRealms } from "@/lib/plans/realms";
import { getAlkonUniverseSnapshot } from "@/lib/server/alkon";
import { getConstructionQueueSnapshot } from "@/lib/server/codex-construction";
import { getCodexPresidencyReport } from "@/lib/server/codex-sovereignty";
import {
  getLocalDayOneReadinessSnapshot,
  getLocalDailyOperationsLoopSnapshot,
  getLocalDailyOperationsReportSnapshot,
  getLocalLivingDayLoopSnapshot,
  getLocalOperationsFinalReportSnapshot,
  getLocalOperationsReadinessSnapshot,
} from "@/lib/server/local-ops";
import { getRealWorldLaunchReadinessSnapshot } from "@/lib/server/launch-readiness";
import { getFinalConvergenceSnapshot } from "@/lib/server/final-convergence";
import { getAlkonContinuitySnapshot } from "@/lib/server/alkon-continuity";
import { getAlkonLegitimacySnapshot } from "@/lib/server/alkon-legitimacy";
import { getAlkonRuntimeSnapshot } from "@/lib/server/alkon-runtime";
import { getAlkonGenesisSnapshot } from "@/lib/server/alkon-genesis";
import { getInfiniteGrowthSnapshot } from "@/lib/server/infinite-growth";
import { getNumberOneDestinySnapshot } from "@/lib/server/number-one-destiny";
import { getSourceLawSnapshot } from "@/lib/server/source-law";
import { getAlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";
import { getAlkonKernelSnapshot } from "@/lib/server/alkon-kernel";
import { getAlkonChatReadiness } from "@/lib/server/alkon-chat";
import { getExistenceArchitectureSnapshot } from "@/lib/server/existence-architecture";
import { getBrandClearanceSnapshot } from "@/lib/server/brand-clearance";
import { getPlanetaryEnvironmentReadinessSnapshot } from "@/lib/server/environment";
import { getEarthRealitySnapshot } from "@/lib/server/earth-reality";
import { getPersonalRealityReadinessSnapshot } from "@/lib/server/personal-reality";
import { getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import { getLocalBuilderReadinessSnapshot } from "@/lib/server/local-builder";
import { getRealityProductionSnapshot } from "@/lib/server/reality-production";
import { getSelfCorrectionSnapshot } from "@/lib/server/self-correction";
import { getMediaIntelligenceSnapshot } from "@/lib/server/media-intelligence";
import { getIntentInterfaceReadinessSnapshot } from "@/lib/server/intent-interface";
import { getRevelationExperienceSnapshot } from "@/lib/server/revelation-experience";
import { getInvisibleOperatingLayerSnapshot } from "@/lib/server/invisible-operating-layer";
import {
  getProductMemoryDailySummarySnapshot,
  getProductMemorySummarySnapshot,
} from "@/lib/server/product-memory";
import { getProductRealityFinalScoreSnapshot } from "@/lib/server/product-reality";
import {
  getFounderIdeaInboxReadiness,
  getSovereignAutonomyReadinessSnapshot,
} from "@/lib/server/sovereign-autonomy";
import { getFounderToolingReadinessSnapshot } from "@/lib/server/integrations";
import { getTreasuryLifeSnapshot } from "@/lib/server/treasury-life";
import { getFounderBuildRoomSnapshot } from "./build-room";
import type { FounderBriefing, MinistryReport } from "@/lib/server/planet-os/types";
import { getFounderCommandReportingSnapshot } from "./reporting";

export type FounderPersonalCompanionSnapshot = {
  checkedAt: string;
  mode: "founder_personal_companion";
  source: "founder_command_reporting";
  planetStatus: FounderBriefing["planetStatus"];
  priorityBriefing: string[];
  riskSummary: string[];
  opportunitySummary: string[];
  ministriesNeedingAttention: string[];
  approvalsSummary: string[];
  guardianSummary: string[];
  legalSummary: string[];
  mediaSummary: string[];
  engineeringSummary: string[];
  productGapSummary: string[];
  visualGapSummary: string[];
  planReadinessSummary: string[];
  planRealmFunctionalExperienceSummary: string[];
  userFacingRiskSummary: string[];
  treasurySummary: string[];
  engineeringPrioritySuggestions: string[];
  constructionIntelligenceSummary: string[];
  localOperationsSummary: string[];
  localDayOneSummary: string[];
  productMemorySummary: string[];
  buildRoomSummary: string[];
  insideOutsidePlanetSummary: string[];
  alkonUniverseSummary: string[];
  alkonCosmicPhysicsSummary: string[];
  alkonSovereignConsciousnessSummary: string[];
  alkonOntologySummary: string[];
  alkonLegitimacySummary: string[];
  alkonContinuitySummary: string[];
  alkonRuntimeSummary: string[];
  alkonGenesisSummary: string[];
  brandUniverseSummary: string[];
  brandClearanceSummary: string[];
  infiniteGrowthSummary: string[];
  numberOneDestinySummary: string[];
  sourceLawSummary: string[];
  alkonOperatingModeSummary: string[];
  alkonKernelSummary: string[];
  alkonChatSummary: string[];
  existenceArchitectureSummary: string[];
  treasuryLifeSummary: string[];
  mediaIntelligenceSummary: string[];
  revelationExperienceSummary: string[];
  finalConvergenceSummary: string[];
  earthRealitySummary: string[];
  hybridEarthTextureSummary: string[];
  personalRealitySummary: string[];
  intentInterfaceSummary: string[];
  deviceConstellationSummary: string[];
  localBuilderSummary: string[];
  realityProductionSummary: string[];
  selfCorrectionSummary: string[];
  realWorldLaunchReadinessSummary: string[];
  planetaryEnvironmentSummary: string[];
  invisibleOperatingLayerSummary: string[];
  localLivingDayLoopSummary: string[];
  founderIdeaInboxSummary: string[];
  sovereignAutonomySummary: string[];
  codexSovereigntySummary: string[];
  toolingSummary: string[];
  whatNotToApprove: string[];
  nextSafeDecisions: string[];
  whatNotToDo: string[];
  ministrySignals: Array<{
    ministryId: string;
    ministryName: string;
    status: MinistryReport["status"];
    riskLevel: MinistryReport["riskLevel"];
    nextAction: string;
  }>;
  boundaries: {
    canApproveActionsAlone: false;
    canPublishMedia: false;
    canEnableLiveExecution: false;
    canEnableRealMoney: false;
    canExposeSecrets: false;
    canOverrideCriticalBlocks: false;
    canFakeReadiness: false;
  };
};

export function getFounderPersonalCompanionSnapshot(
  checkedAt = new Date().toISOString()
): FounderPersonalCompanionSnapshot {
  const reporting = getFounderCommandReportingSnapshot(checkedAt);
  const planEntitlements = getPlanEntitlementSnapshot("demo_free", checkedAt);
  const constructionQueue = getConstructionQueueSnapshot(checkedAt);
  const localOps = getLocalOperationsReadinessSnapshot(checkedAt);
  const localDailyLoop = getLocalDailyOperationsLoopSnapshot(checkedAt);
  const localDailyReport = getLocalDailyOperationsReportSnapshot(checkedAt);
  const localDayOne = getLocalDayOneReadinessSnapshot(checkedAt);
  const localFinalReport = getLocalOperationsFinalReportSnapshot(checkedAt);
  const productRealityFinalScore = getProductRealityFinalScoreSnapshot(checkedAt);
  const productMemory = getProductMemorySummarySnapshot(checkedAt);
  const productMemoryDailySummary =
    getProductMemoryDailySummarySnapshot(checkedAt);
  const buildRoom = getFounderBuildRoomSnapshot(checkedAt);
  const tooling = getFounderToolingReadinessSnapshot(checkedAt);
  const invisibleLayer = getInvisibleOperatingLayerSnapshot(checkedAt);
  const localLivingDayLoop = getLocalLivingDayLoopSnapshot(checkedAt);
  const sovereignAutonomy = getSovereignAutonomyReadinessSnapshot(checkedAt);
  const founderIdeaInbox = getFounderIdeaInboxReadiness(checkedAt);
  const codexSovereignty = getCodexPresidencyReport(checkedAt);
  const alkonUniverse = getAlkonUniverseSnapshot(checkedAt);
  const alkonContinuity = getAlkonContinuitySnapshot(checkedAt);
  const alkonLegitimacy = getAlkonLegitimacySnapshot(checkedAt);
  const alkonRuntime = getAlkonRuntimeSnapshot(checkedAt);
  const alkonGenesis = getAlkonGenesisSnapshot(checkedAt);
  const infiniteGrowth = getInfiniteGrowthSnapshot(checkedAt);
  const numberOneDestiny = getNumberOneDestinySnapshot(checkedAt);
  const sourceLaw = getSourceLawSnapshot(checkedAt);
  const alkonOperatingMode = getAlkonOperatingModeSnapshot(checkedAt);
  const alkonKernel = getAlkonKernelSnapshot(checkedAt);
  const alkonChat = getAlkonChatReadiness(checkedAt);
  const existenceArchitecture = getExistenceArchitectureSnapshot(checkedAt);
  const brandClearance = getBrandClearanceSnapshot(checkedAt);
  const brandUniverse = getPrivateBrandUniverse();
  const treasuryLife = getTreasuryLifeSnapshot();
  const mediaIntelligence = getMediaIntelligenceSnapshot();
  const revelationExperience = getRevelationExperienceSnapshot(checkedAt);
  const finalConvergence = getFinalConvergenceSnapshot(checkedAt);
  const realWorldLaunchReadiness =
    getRealWorldLaunchReadinessSnapshot(checkedAt);
  const planetaryEnvironment =
    getPlanetaryEnvironmentReadinessSnapshot(checkedAt);
  const earthReality = getEarthRealitySnapshot(checkedAt);
  const hybridEarthTextureReadiness = getFounderHybridEarthTextureReadiness();
  const personalReality = getPersonalRealityReadinessSnapshot(checkedAt);
  const intentInterface = getIntentInterfaceReadinessSnapshot(checkedAt);
  const deviceConstellation = getFounderDeviceReadinessSnapshot(checkedAt);
  const localBuilder = getLocalBuilderReadinessSnapshot(checkedAt);
  const realityProduction = getRealityProductionSnapshot(checkedAt);
  const selfCorrection = getSelfCorrectionSnapshot(checkedAt);
  const publicRealms = getPublicPlanRealms();
  const privateRealm = getPrivateFounderRealm();
  const decisionMinistries = reporting.ministries.filter(
    (report) => report.founderDecisionNeeded
  );
  const highRiskMinistries = reporting.ministries.filter(
    (report) => report.riskLevel === "high" || report.riskLevel === "critical"
  );
  const blockedOrDegradedMinistries = reporting.ministries.filter(
    (report) => report.status === "blocked" || report.status === "degraded"
  );

  return {
    checkedAt,
    mode: "founder_personal_companion",
    source: "founder_command_reporting",
    planetStatus: reporting.briefing.planetStatus,
    priorityBriefing: [
      `Planet status is ${reporting.briefing.planetStatus}.`,
      `${decisionMinistries.length} ministries need Founder attention.`,
      `${highRiskMinistries.length} ministries carry high or critical risk.`,
      "Live execution, real money, billing, broker/feed, public launch, and social publishing remain blocked or inactive.",
    ],
    riskSummary: reporting.briefing.topRisks,
    opportunitySummary: [
      "Companion, why-blocked, journal/coach, and plan truth can improve user confidence without launch work.",
      "Founder Command can become more actionable through read-only prioritization before approval execution exists.",
      "Plan value and VIP readiness can be clarified without billing or paid activation.",
      "State explanations can reduce confusion while preserving hard safety boundaries.",
      "Visual acceptance can keep public surfaces chart-first while internal Planet OS matures.",
    ],
    ministriesNeedingAttention: [
      ...decisionMinistries.map((report) => report.ministryName),
      ...blockedOrDegradedMinistries.map((report) => report.ministryName),
    ].filter((value, index, list) => list.indexOf(value) === index),
    approvalsSummary: reporting.briefing.approvalsNeeded,
    guardianSummary: reporting.briefing.guardianAlerts,
    legalSummary: reporting.briefing.legalWarnings,
    mediaSummary: reporting.briefing.mediaQueueReadiness,
    engineeringSummary: reporting.briefing.engineeringTasks,
    productGapSummary: reporting.briefing.productGaps,
    visualGapSummary: [
      "Human visual acceptance by Ahmad is still required before any final 10/10 claim.",
      "Chart-first hierarchy must be protected from diagnostics growth.",
      "Owner command native desktop/mobile visual shells remain planned.",
    ],
    planReadinessSummary: planEntitlements.plans.map(
      (plan) => `${plan.planName}: ${plan.truthState}`
    ),
    planRealmFunctionalExperienceSummary: [
      ...publicRealms.map(
        (realm) =>
          `${realm.publicPlanName}: ${realm.activationState}; ${realm.workspaceBehavior} ${realm.journalCoachDepth}`
      ),
      `${privateRealm.realmName} / الكون: ${privateRealm.activationState}; ${privateRealm.visibility}; never public plan access.`,
    ],
    userFacingRiskSummary: [
      "Users must not see owner command as a plan feature.",
      "Assistant must not produce trading signals, profit claims, or execution instructions.",
      "Plan surfaces must not imply paid access while billing is inactive.",
    ],
    treasurySummary: [
      "Free is active as paper-safe evaluation.",
      "Pro and VIP remain planned/locked.",
      "Billing is inactive and current performance fee remains 0%.",
    ],
    engineeringPrioritySuggestions: [
      "Keep intelligence contracts deterministic and tested.",
      "Prefer compact diagnostics over workstation clutter.",
      "Add UI only where it clarifies product truth.",
    ],
    constructionIntelligenceSummary: [
      `${constructionQueue.summary.total} construction queue drafts are readiness-only.`,
      `${constructionQueue.summary.blocked} blocked construction items remain blocked.`,
      "Codex task drafts must not be sent or executed automatically.",
      "Validation interpretation is required before Founder acceptance.",
    ],
    localOperationsSummary: [
      `Local operations state is ${localOps.report.readinessState}.`,
      `${localOps.dayCycle.totalStages} local day cycle stages are defined.`,
      `${localDailyLoop.summary.totalStages} daily operating loop stages connect acceptance, gaps, Codex drafts, validation, and memory.`,
      `Latest daily report is day ${localDailyReport.dayNumber} with validation ${localDailyReport.validation.status} and Git ${localDailyReport.gitClean}.`,
      `${localOps.digitalTwin.profileCount} local test personas are readiness-only and do not represent real users.`,
      "Founder Local Command shell is read-only and owner-only until owner auth, device trust, and step-up gates exist.",
      localOps.report.launchForbiddenReminder,
    ],
    localDayOneSummary: [
      `Local Day One gate is ${localDayOne.gateStatus}.`,
      `Ready to start local review: ${localDayOne.readyToStartLocalDayOne ? "yes" : "no"}.`,
      `Product reality final score is ${productRealityFinalScore.overallScore}/10 with ${productRealityFinalScore.status}.`,
      `Ahmad human visual review required: ${localDayOne.ahmadHumanReviewRequired ? "yes" : "no"}.`,
      localFinalReport.launchForbiddenReminder,
    ],
    productMemorySummary: [
      `${productMemory.domainSummary.length} memory domains are modeled for safe local/internal readiness.`,
      `${productMemory.founderSummary.openProductGaps.length} open product gaps are visible for review.`,
      `Daily memory summary tracks ${productMemoryDailySummary.productGaps.open} open gaps, ${productMemoryDailySummary.validation.commands} validation commands, and the suggested next task: ${productMemoryDailySummary.suggestedNextTask.title}.`,
      productMemory.founderSummary.journalCoachReadiness,
      "Memory forbids secrets, raw private sensitive data, fake users, fake revenue, and fake metrics.",
    ],
    buildRoomSummary: [
      `Build Room is ${buildRoom.readinessStatus}.`,
      `${buildRoom.codexTaskDrafts.length} Codex-ready draft candidates are available for manual Ahmad review.`,
      `${buildRoom.topProductGaps.length} product gaps and ${buildRoom.topVisualGaps.length} visual gaps are highlighted.`,
      "No automatic external Codex sending, approval execution, launch, billing, broker/feed, live execution, real money, or social publishing is active.",
    ],
    insideOutsidePlanetSummary: [
      "Public users live on the professional Pro Max Trading platform surface under the Pro Max mother brand.",
      "Ahmad lives inside private Founder Command and Alkon / الكون Universe with Idea Inbox, construction governance, memory, tribunal, and next safe actions.",
      "The invisible operating layer maps internal complexity to public-safe readiness outputs.",
      "The living Earth atmosphere is code-only and local-scope; no images, external maps, GPS, or precise location tracking are used.",
    ],
    alkonUniverseSummary: [
      `${alkonUniverse.name} / ${alkonUniverse.arabicName} is ${alkonUniverse.visibility}; public exposure is ${String(alkonUniverse.publicExposure)}.`,
      `${alkonUniverse.universeMap.length} command subsystems cover Earth, Moon, Orbit, Solar Command, Planetary Systems, Defense, Construction, Memory, World Interface, and the Invisible Operating Layer.`,
      alkonUniverse.apiExposure.publicRouteDecision,
      `Product truth is ${alkonUniverse.productTruthStatus.overall}; live execution, real money, billing, broker/feed, public launch, social publishing, and shell execution remain blocked or inactive.`,
    ],
    alkonCosmicPhysicsSummary: [
      `${alkonUniverse.cosmicPhysics.name} is ${alkonUniverse.cosmicPhysics.visibility}; public exposure is ${String(alkonUniverse.cosmicPhysics.publicExposure)}.`,
      `${alkonUniverse.cosmicPhysics.registrySummary.planetOwners} planet/system owners, ${alkonUniverse.cosmicPhysics.registrySummary.satellites} satellites, ${alkonUniverse.cosmicPhysics.registrySummary.stations} stations, and ${alkonUniverse.cosmicPhysics.registrySummary.workers} workers are registered.`,
      `${alkonUniverse.cosmicPhysics.sampleTaskGraphs.length} sample task graphs prove source, energy, gravity, orbit, owner, satellite, station, worker, passport, Codex License, validation, tribunal, memory, and Founder report.`,
      "Cosmic Operating Physics remains private, read-only, status-only, and cannot execute shell commands, call Codex, expose secrets, activate billing, trade live, route real money, or publish.",
    ],
    alkonSovereignConsciousnessSummary: [
      `${alkonUniverse.sovereignOperatingConsciousness.name} is ${alkonUniverse.sovereignOperatingConsciousness.visibility}; public exposure is ${String(alkonUniverse.sovereignOperatingConsciousness.publicExposure)}.`,
      `Flow is ${alkonUniverse.sovereignOperatingConsciousness.flow.join(" -> ")} with ${alkonUniverse.sovereignOperatingConsciousness.latestSignals.length} sample signals and ${alkonUniverse.sovereignOperatingConsciousness.preparedActions.length} prepared safe actions.`,
      `${alkonUniverse.sovereignOperatingConsciousness.memoryLessons.length} memory lessons and ${alkonUniverse.sovereignOperatingConsciousness.evolutionRules.length} evolution guards keep repeated mistakes from returning.`,
      "Alkon consciousness prepares reports, passports, review requests, blocks, memory, and evolution rules only; it cannot execute, call Codex, expose secrets, activate real-world systems, or become public.",
    ],
    alkonOntologySummary: [
      `${alkonUniverse.ontology.name} is ${alkonUniverse.ontology.visibility}; public exposure is ${String(alkonUniverse.ontology.publicExposure)}.`,
      `${alkonUniverse.ontology.entityCount} entities are registered across ${alkonUniverse.ontology.publicEntityCount} public, ${alkonUniverse.ontology.privateEntityCount} private, and ${alkonUniverse.ontology.invisibleEntityCount} invisible entities.`,
      `${alkonUniverse.ontology.completeEntities} entities are complete; ${alkonUniverse.ontology.partialEntities} require validation, memory, relationship, or cleanup review.`,
      "Ontology is private, read-only, and cannot delete entities, execute shell commands, expose secrets, activate launch, or expose Alkon publicly.",
    ],
    alkonLegitimacySummary: [
      `${alkonLegitimacy.name} is ${alkonLegitimacy.visibility}; public exposure is ${String(alkonLegitimacy.publicExposure)}.`,
      `${alkonLegitimacy.recentSampleDecisions.length} sample decisions prove permit outcomes across user, billing, treasury, and media actions.`,
      `${alkonLegitimacy.blackHoleCategories.length} categories are black-holed, including billing, broker/feed, live execution, real money, production, and secrets access.`,
      "Legitimacy is private, read-only, and cannot execute payments, expose bank/card data, publish, activate production, or override Product Truth.",
    ],
    alkonContinuitySummary: [
      `${alkonContinuity.name} is ${alkonContinuity.visibility}; public exposure is ${String(alkonContinuity.publicExposure)}.`,
      `${alkonContinuity.sampleReports.length} sample reports cover birth, identity, law, function, integration, proof, life, evolution, deprecation, removal, and memory.`,
      `${alkonContinuity.blackHoled.length} births are black-holed and ${alkonContinuity.deprecationCandidates.length} entities are deprecation candidates in the sample model.`,
      "Continuity is private, read-only, non-deleting, and cannot expose Alkon, execute shell commands, call Codex, activate real-world systems, or create raster assets.",
    ],
    alkonRuntimeSummary: [
      `${alkonRuntime.name} is ${alkonRuntime.visibility}; public exposure is ${String(alkonRuntime.publicExposure)}.`,
      `${alkonRuntime.sampleReports.length} sample runtime reports cover place, time, law, gravity, orbit, life, economy, defense, communication, reality, consequence, memory, and next fate.`,
      `${alkonRuntime.blackHoleCategories.length} categories are black-holed and ${alkonRuntime.nextSafeFates.length} next fates are readiness-only recommendations.`,
      "Runtime is private, read-only, non-paying, non-deleting, non-executing, and cannot expose secrets, call Codex, publish, launch, activate billing, broker/feed, live execution, or real money.",
    ],
    alkonGenesisSummary: [
      `${alkonGenesis.name} is ${alkonGenesis.visibility}; public exposure is ${String(alkonGenesis.publicExposure)}.`,
      `${alkonGenesis.primeWorld.name} remains the protected Prime World with ${alkonGenesis.worldSeedCount} private World Seeds under evaluation.`,
      `${alkonGenesis.delayedSeeds.length} seeds are delayed, ${alkonGenesis.prototypeAllowedSeeds.length} are prototype-allowed, and ${alkonGenesis.founderApprovalNeeded.length} need Founder approval in the readiness model.`,
      "Genesis is private, read-only, and cannot create projects, expose future worlds, launch, publish, bill, trade live, connect broker/feed, route real money, or expose Alkon.",
    ],
    brandUniverseSummary: [
      `${brandUniverse.motherBrand} is the public mother brand.`,
      `${brandUniverse.primeWorld} is the Prime World and first public product.`,
      `${brandUniverse.privateUniverse} / ${brandUniverse.privateUniverseArabic} remains the Founder-only operating universe.`,
      `Future Pro Max Worlds remain ${brandUniverse.futureWorldsReadiness}; public exposure is ${String(brandUniverse.publicExposure)}.`,
    ],
    brandClearanceSummary: [
      `Brand Clearance is ${brandClearance.status}; public exposure is ${String(brandClearance.publicExposure)}.`,
      `Current working name: ${brandClearance.currentWorkingName}; final brand approved: ${String(brandClearance.finalBrandApproved)}; launch blocked by brand gate: ${String(brandClearance.launchBlockedByBrandGate)}.`,
      `Candidate names prepared for private review: ${brandClearance.candidateShortlist.length}; all remain unchecked until official search and legal review.`,
      `Manual search tasks: ${brandClearance.trademarkSearchTasks.length} trademark/conflict and ${brandClearance.domainSearchTasks.length} domain/handle tasks.`,
      `Adoption gate is ${brandClearance.adoptionGate.adoptionStatus}; next safe action: ${brandClearance.nextSafeBrandAction}`,
      "Pro Max remains a working name; Alkon remains private; no global exclusivity, trademark ownership, Swiss regulation, FINMA, licensing, profit, or win-rate claim is allowed.",
    ],
    infiniteGrowthSummary: [
      `${infiniteGrowth.name} is ${infiniteGrowth.visibility}; public exposure is ${String(infiniteGrowth.publicExposure)}.`,
      `${infiniteGrowth.safeCreationDomains.length} domains allow safe creation and ${infiniteGrowth.gatedRealityDomains.length} domains are reality-gated under Swiss-law gravity.`,
      `${infiniteGrowth.blockedDomains.length} domains remain blocked/readiness-only and ${infiniteGrowth.blackHoleDomains.length} domains are black-holed in local scope.`,
      "Infinite Growth permits ideas, planning, design, docs, tests, audits, memory, and local build while gating users, data, money, claims, media, launch, production, and regulated activity.",
    ],
    numberOneDestinySummary: [
      `${numberOneDestiny.name} is ${numberOneDestiny.visibility}; public exposure is ${String(numberOneDestiny.publicExposure)}.`,
      `Internal mission is private and public claim status is ${numberOneDestiny.publicClaimStatus}.`,
      `Next critical decision: ${numberOneDestiny.nextOneCriticalDecision}`,
      `${numberOneDestiny.topDrifts.length} drift signals are tracked and ${numberOneDestiny.standards.length} Pro Max standards are ready.`,
      "Pro Max builds by #1 standards but does not publicly claim #1, best, global, regulated, guaranteed, profit, or win-rate status.",
    ],
    sourceLawSummary: [
      `${sourceLaw.name} is ${sourceLaw.visibility}; public exposure is ${String(sourceLaw.publicExposure)}.`,
      `Source chain: ${sourceLaw.sourceLaw}`,
      `One correct action: ${sourceLaw.oneCorrectAction.oneCorrectAction}`,
      `${sourceLaw.driftSignals.length} drift signals are active and ${sourceLaw.memoryLessons.length} memory lessons guard future work.`,
      "Source Law is private, read-only, and cannot execute, expose secrets, launch, bill, trade live, route real money, or expose Alkon publicly.",
    ],
    alkonOperatingModeSummary: [
      `${alkonOperatingMode.name} is ${alkonOperatingMode.status}; activation decision is ${alkonOperatingMode.activationDecision}.`,
      `Zero Truth audit is ${alkonOperatingMode.zeroTruthAudit.status} with ${alkonOperatingMode.zeroTruthAudit.blockers.length} blockers.`,
      `One next action: ${alkonOperatingMode.oneNextAction.oneNextAction}`,
      `Local Day One gate is ${alkonOperatingMode.localDayOneGate.status}; Founder decision needed: ${String(alkonOperatingMode.founderDecisionNeeded)}.`,
      "Operating Mode is private, read-only, no-execution, and cannot launch, bill, trade live, route real money, expose secrets, run shell commands, or expose Alkon publicly.",
    ],
    alkonKernelSummary: [
      `Alkon Sovereign Kernel is ${alkonKernel.status}; public exposure is ${String(alkonKernel.publicExposure)}.`,
      `${alkonKernel.commandStatuses.length} kernel command statuses cover Command 0 through Command 16.`,
      `One next action: ${alkonKernel.oneNextAction.oneNextAction}`,
      `Local Day One gate is ${alkonKernel.localDayOneGate.localDayOneStatus}; Ahmad visual acceptance required: ${String(alkonKernel.localDayOneGate.ahmadVisualAcceptanceRequired)}.`,
      "Kernel is private, read-only, no-execution, and cannot launch, bill, trade live, route real money, expose secrets, run shell commands, or expose Alkon publicly.",
    ],
    alkonChatSummary: [
      `Alkon Chat is ${alkonChat.statusLabel}; public exposure is ${String(alkonChat.publicExposure)}.`,
      `${alkonChat.availableIntents.length} private intents are available for read-only status, truth, evidence, devices, Local Day One, and command passport previews.`,
      `Current one next action: ${alkonChat.currentOneNextAction}`,
      "Alkon Chat can answer, classify, judge, and draft passports only; it cannot execute shell, call Codex, activate billing, trade live, route real money, expose secrets, or become public.",
    ],
    existenceArchitectureSummary: [
      `${existenceArchitecture.totalEntitiesReviewed} entities reviewed for permission to exist.`,
      `${existenceArchitecture.unknownEntities.length} unknown entities require Jar/Inbox classification.`,
      `${existenceArchitecture.cleanupCandidates.length} cleanup candidates are documented before deletion.`,
      `One next structural action: ${existenceArchitecture.oneNextStructuralAction}`,
    ],
    treasuryLifeSummary: [
      `Treasury Life is ${treasuryLife.status}; funding mode is ${treasuryLife.fundingMode}.`,
      `Initial cap is ${treasuryLife.budgetCap.initialCap} ${treasuryLife.budgetCap.currency}; payment execution is ${treasuryLife.paymentExecutionStatus}.`,
      `Tax reserve is ${treasuryLife.taxReserveReadiness}; VAT threshold watch is ${treasuryLife.vatThresholdWatch}; bank/card data is ${treasuryLife.bankCardSecretStatus}.`,
      treasuryLife.nextSafeFinancialAction,
    ],
    mediaIntelligenceSummary: [
      `Media Reality is ${mediaIntelligence.status}; publishing gate is ${mediaIntelligence.publishingGate}.`,
      `Claims firewall ready: ${String(mediaIntelligence.claimsFirewall.ready)}; social accounts connected: ${String(mediaIntelligence.channelReality.socialAccountsConnected)}.`,
      `AI content factory is ${mediaIntelligence.aiContentFactoryReadiness}; story architecture is ${mediaIntelligence.storyArchitecture}.`,
      "Media remains draft/review-only with no social tokens, no publishing, no ad spend, and no fake metrics.",
    ],
    revelationExperienceSummary: [
      `Living Earth Revelation Experience is ${revelationExperience.status}.`,
      `First 3 seconds ${revelationExperience.founderReadiness.first3SecondsStatus}, first 10 seconds ${revelationExperience.founderReadiness.first10SecondsStatus}, first 30 seconds ${revelationExperience.founderReadiness.first30SecondsStatus}, first 3 minutes ${revelationExperience.founderReadiness.first3MinutesStatus}, first day ${revelationExperience.founderReadiness.firstDayStatus}.`,
      `${revelationExperience.needsPolish.length} polish notes remain: ${revelationExperience.needsPolish.join(", ")}.`,
      "Public entry, Assistant guidance, Workspace usefulness, Journal/Coach continuity, Product Truth, accessibility, and public/private boundary checks stay read-only and non-executing.",
    ],
    finalConvergenceSummary: [
      `Final Convergence is ${finalConvergence.status} with score ${finalConvergence.convergenceScore.score}/10; no fake 10/10 is claimed.`,
      `${finalConvergence.layers.length} layers are registered and ${finalConvergence.layerGrowth.proposals.length} governed layer-growth proposals are ready for private review.`,
      `Automation maximum is ${finalConvergence.automationGovernor.currentMaximumLevel}; Level 4 remains disabled and Level 5 uncontrolled autopilot is forbidden.`,
      `Reality audit is ${finalConvergence.realityAuditReadiness.status}; cleanup execution active is ${String(finalConvergence.cleanupReadiness.executionActive)}; Local Day status is ${finalConvergence.localDayReadiness.status}.`,
      "Final Convergence remains Founder-only and cannot launch, bill, trade live, route real money, expose secrets, run shell commands, call Codex, or expose Alkon publicly.",
    ],
    earthRealitySummary: [
      `Earth Reality is ${earthReality.status} with score ${earthReality.score}/10; no fake 10/10 or launch claim is made.`,
      `${earthReality.layers.length} Earth layers and ${earthReality.surfaces.length} public surfaces are constitutionally mapped.`,
      `Public/private boundary is ${earthReality.publicPrivateBoundaryStatus}; live execution, real money, broker/feed, billing, production, and social publishing remain blocked or inactive.`,
      "Earth is the public reference reality for human orientation, time, privacy, markets, law/trust, learning/support, environment, and Product Truth.",
    ],
    hybridEarthTextureSummary: [
      `Hybrid Earth texture mode is ${hybridEarthTextureReadiness.activeTextureMode}.`,
      `${hybridEarthTextureReadiness.approvedTextureCount} approved texture is active; ${hybridEarthTextureReadiness.invalidMetadataCount} invalid metadata entries are disabled.`,
      hybridEarthTextureReadiness.nextSafeAction,
      "Procedural fallback remains active unless a local legally approved texture has complete metadata, checksum, and approval.",
    ],
    personalRealitySummary: [
      `Personal Reality is ${personalReality.status}; ${personalReality.freeControls.length} Free controls are active.`,
      `${personalReality.plannedControls.length} professional/premium controls are planned and ${personalReality.futureControls.length} institutional controls are future.`,
      `Assistant-controlled: ${String(personalReality.assistantControlled)}; plan-aware: ${String(personalReality.planAware)}; Product Truth guarded: ${String(personalReality.productTruthGuarded)}.`,
      "Personal Reality previews and explains allowed settings only; it cannot unlock paid plans, activate live execution, expose private systems, or use weather/session as trading advice.",
    ],
    intentInterfaceSummary: [
      `Human Intent OS is ${intentInterface.status}: ${intentInterface.coreButtonsKept.length} core buttons, ${intentInterface.contextualButtons.length} contextual buttons, ${intentInterface.assistantIntents.length} Assistant intents, and ${intentInterface.blockedIntents.length} blocked intents are modeled.`,
      "Public Pro Max Assistant handles user intent, explanations, settings, support, Journal/Coach guidance, and blocked-state truth.",
      `Private intents public: ${String(intentInterface.privateIntentsPubliclyAvailable)}. Private command language remains Founder-only.`,
    ],
    deviceConstellationSummary: [
      `Multi-device readiness is ${deviceConstellation.status}: ${deviceConstellation.publicDevices.length} public apps and ${deviceConstellation.privateDevices.length} private command devices are modeled.`,
      `Official constellation: ${deviceConstellation.officialConstellation.windows}, ${deviceConstellation.officialConstellation.iphone}, ${deviceConstellation.officialConstellation.samsung}.`,
      "Public Apps / Platforms truth remains Web current, Desktop planned, Mobile planned, and Tablet future with no fake downloads or store claims.",
      "Private Alkon devices are internal-only, read-only, secret-free, and non-executing.",
      `${deviceConstellation.blockedActions.length} hard-blocked actions apply across every device, including billing, broker/feed, live execution, real money, social publishing, secrets, and shell execution.`,
    ],
    localBuilderSummary: [
      `Local Builder is ${localBuilder.status} with ${localBuilder.scripts.length} terminal-only scripts.`,
      `Web shell execution: ${String(localBuilder.webAppCanExecuteShell)}; web Codex execution: ${String(localBuilder.webAppCanRunCodex)}.`,
      localBuilder.nextSafeAction,
    ],
    realityProductionSummary: [
      `Reality Production is ${realityProduction.status}; selected builder is ${realityProduction.selectedBuilder.builderId}.`,
      `Evidence closure allowed: ${String(realityProduction.evidence.canClose)}; next fate is ${realityProduction.nextFate}.`,
      "Codex remains a builder, not the leader; Ahmad decides sensitive matters.",
    ],
    selfCorrectionSummary: [
      `Self-Correction is ${selfCorrection.status} with ${selfCorrection.signals.length} monitored blocker signals.`,
      `${selfCorrection.signals.filter((signal) => signal.detected).length} signals are active notes, including visual acceptance and Local Day One blockers.`,
      selfCorrection.nextAction,
    ],
    realWorldLaunchReadinessSummary: [
      `Real-world readiness is ${realWorldLaunchReadiness.status}; launch gate is ${realWorldLaunchReadiness.gate.status}.`,
      `Initial budget target is ${realWorldLaunchReadiness.budget.initialOperatingTargetChf}/${realWorldLaunchReadiness.budget.monthlyCapChf} CHF per month.`,
      `Waitlist ${realWorldLaunchReadiness.waitlist.status}, staging ${realWorldLaunchReadiness.infrastructure.status}, legal ${realWorldLaunchReadiness.legal.status}, support ${realWorldLaunchReadiness.support.status}, billing ${realWorldLaunchReadiness.billing.status}.`,
      `Blocked activations: ${realWorldLaunchReadiness.founderCommand.blockedActivations.join(", ")}.`,
      realWorldLaunchReadiness.gate.nextSafeAction,
    ],
    planetaryEnvironmentSummary: [
      `${planetaryEnvironment.internalName} is ${planetaryEnvironment.status} and public-facing as ${planetaryEnvironment.publicName}.`,
      `Current deterministic snapshot resolves ${planetaryEnvironment.snapshot.solarPhase}, ${planetaryEnvironment.snapshot.weatherState}, ${planetaryEnvironment.snapshot.marketSession}, and ${planetaryEnvironment.snapshot.systemWeather}.`,
      "Public and workspace atmospheres stay code-only, privacy-safe, user-controlled, and chart-safe.",
      "No GPS, precise location tracking, external weather calls, weather trading advice, images, or raster assets are used.",
    ],
    invisibleOperatingLayerSummary: [
      `${invisibleLayer.systems.length} invisible operating systems are mapped.`,
      `${invisibleLayer.publicSafeOutputs.length} public-safe outputs are allowed and ${invisibleLayer.hiddenFromPublic.length} internal systems are hidden from users.`,
      "Billing blocked maps to billing inactive; Founder Command, Codex queue, Product Memory, Secrets Authority, and Security Sovereignty stay hidden publicly.",
    ],
    localLivingDayLoopSummary: [
      `${localLivingDayLoop.loop.length} Local Day One living stages are ready.`,
      localLivingDayLoop.today.ideaIntake,
      `${localLivingDayLoop.today.openGaps.length} open gaps and ${localLivingDayLoop.today.blockedRequests.length} blocked requests are visible to Founder Command.`,
      `Codebase Reality Audit is ${localLivingDayLoop.codebaseRealityAudit.status}; cleanup execution active: ${String(localLivingDayLoop.codebaseRealityAudit.cleanupExecutionActive)}.`,
      localLivingDayLoop.today.nextSafeAction,
    ],
    founderIdeaInboxSummary: [
      `Founder Idea Inbox is ${founderIdeaInbox.status}.`,
      `${founderIdeaInbox.recentIdeaExamples.length} recent idea examples are classified through intake, routing, gates, passports, and drafts.`,
      `${founderIdeaInbox.pendingIdeaDrafts.length} pending idea drafts and ${founderIdeaInbox.blockedIdeaExamples.length} blocked idea examples are available for private review.`,
      founderIdeaInbox.nextSafeIdeaAction,
      "Idea preview is stateless and cannot execute shell commands, call Codex, persist secrets, auto-submit, publish, bill, trade live, or route real money.",
    ],
    sovereignAutonomySummary: [
      `Sovereign Autonomy is ${sovereignAutonomy.mode} in ${sovereignAutonomy.operatingMode}.`,
      `${sovereignAutonomy.sampleFounderIdeas.length} sample Founder ideas become ${sovereignAutonomy.sampleEvents.length} classified events.`,
      `${sovereignAutonomy.taskPassports.filter((passport) => passport.valid).length} Task Passports and ${sovereignAutonomy.codexSubmitReadiness.drafts.length} Codex-ready drafts are available for review.`,
      `Result Tribunal sample decision is ${sovereignAutonomy.tribunalReports[0]?.decision ?? "needs_fix"}.`,
      "The web app cannot execute shell commands, call Codex directly, send secrets, publish, launch, bill, trade live, or route real money.",
    ],
    codexSovereigntySummary: [
      `Codex Sovereign Construction State is ${codexSovereignty.readiness}.`,
      `${codexSovereignty.taskPassportsReady} valid Task Passports are ready for governed drafting.`,
      `${codexSovereignty.tasksWaitingFounderApproval.length} tasks are waiting Founder approval.`,
      `Level 3.0 draft-only is ${codexSovereignty.level3Status.level30DraftOnly ? "ready" : "blocked"} and Level 3.1 remains readiness-only.`,
      "The web app cannot execute shell commands, call Codex directly, send secrets, activate billing, connect brokers/feeds, launch publicly, publish socially, or enable real money.",
    ],
    toolingSummary: [
      `Essential tooling hub is ${tooling.status}.`,
      `${tooling.essentialIntegrations.p0_local_required.count} P0 local tools and ${tooling.essentialIntegrations.p1_soon.count} P1 readiness items are classified.`,
      "Codex and GitHub are governed as manual, external workflows; the product only drafts tasks and records safe summaries.",
      `${tooling.localRuntime.commands.length} local runtime commands are documented for terminal use only; the web app cannot execute shell commands.`,
      `Blocked now: ${tooling.whatNotToConnectNow.join(", ")}.`,
    ],
    whatNotToApprove: [
      "live execution activation",
      "real-money routing",
      "billing activation",
      "broker/feed activation",
      "social publishing",
      "public launch claims",
      "fake Pro/VIP claims",
      "fake Islamic/Sharia certification",
    ],
    nextSafeDecisions: reporting.briefing.nextSafeActions,
    whatNotToDo: reporting.briefing.whatNotToDoToday,
    ministrySignals: reporting.ministries.map((report) => ({
      ministryId: report.ministryId,
      ministryName: report.ministryName,
      status: report.status,
      riskLevel: report.riskLevel,
      nextAction:
        report.nextActions[0] ?? "Keep readiness truth visible and reviewed.",
    })),
    boundaries: {
      canApproveActionsAlone: false,
      canPublishMedia: false,
      canEnableLiveExecution: false,
      canEnableRealMoney: false,
      canExposeSecrets: false,
      canOverrideCriticalBlocks: false,
      canFakeReadiness: false,
    },
  };
}
