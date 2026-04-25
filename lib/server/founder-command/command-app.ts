import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import {
  getConstructionQueueSnapshot,
  getCodexTaskDraftReadinessSnapshot,
  getSelfHealingPipelineSnapshot,
  getValidationInterpreterReadinessSnapshot,
} from "@/lib/server/codex-construction";
import { getPlanetEconomyGrowthReadinessSnapshot } from "@/lib/server/economy-growth";
import { getTpmBrainContextSnapshot } from "@/lib/server/brain";
import { getGrowthIntelligenceReadinessSnapshot } from "@/lib/server/growth-intelligence";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import { getLocalOperationsReadinessSnapshot } from "@/lib/server/local-ops";
import { getPlanetConsciousnessSnapshot } from "@/lib/server/planet-consciousness";
import { getPlanetMemoryGraphSnapshot } from "@/lib/server/planet-memory";
import {
  getInterMinistryCoordinationSnapshot,
  getPlanetBlueprintSnapshot,
  getPlanetGovernanceSnapshot,
} from "@/lib/server/planet-os";
import { getProductTruthSnapshot } from "@/lib/server/product";
import { getProductMemorySummarySnapshot } from "@/lib/server/product-memory";
import {
  getProductRealityScoreSnapshot,
  getProductSurfaceDigitalTwinSnapshot,
} from "@/lib/server/product-reality";
import { getTrustGovernorSnapshot } from "@/lib/server/trust-governor";
import { getVisualAcceptanceSnapshot } from "@/lib/server/visual-acceptance";
import { getFounderLocalCommandAccessSnapshot } from "./access";
import { getFounderPersonalCompanionSnapshot } from "./founder-companion";
import { getFounderPreferenceSnapshot } from "./founder-preferences";
import { getFounderCommandRoomFoundationSnapshot } from "./room";
import { getFounderCommandSnapshot } from "./state";
import type {
  FounderCommandDeviceBlueprint,
  FounderCommandSafetySummary,
  FounderOwnerAccessPolicy,
} from "./types";

const ownerAccessPolicy: FounderOwnerAccessPolicy = {
  audience: "founder_king_only",
  ownerOnly: true,
  publicRouteExposed: false,
  publicNavigationVisible: false,
  userPlanAccess: false,
  readOnlyDefault: true,
  ownerDeviceTrust: "planned",
  stepUpConfirmation: "planned",
  auditBackedActions: "planned",
  secretsVisible: false,
};

const safetySummary: FounderCommandSafetySummary = {
  approvalExecutionActive: false,
  billingActivationActive: false,
  brokerFeedActivationActive: false,
  liveExecutionActive: false,
  realMoneyRoutingActive: false,
  socialPublishingActive: false,
  publicLaunchActive: false,
  fakeUsersIncluded: false,
  fakeRevenueIncluded: false,
  fakeMetricsIncluded: false,
  secretsExposed: false,
  privateUserDataExposed: false,
};

export function getFounderCommandAppSnapshot(
  checkedAt = new Date().toISOString()
) {
  const command = getFounderCommandSnapshot(checkedAt);
  const room = getFounderCommandRoomFoundationSnapshot(checkedAt);
  const blueprint = getPlanetBlueprintSnapshot(checkedAt);
  const governance = getPlanetGovernanceSnapshot(checkedAt);
  const coordination = getInterMinistryCoordinationSnapshot(checkedAt);
  const productTruth = getProductTruthSnapshot(checkedAt);
  const visualAcceptance = getVisualAcceptanceSnapshot(checkedAt);
  const brain = getTpmBrainContextSnapshot({}, checkedAt);
  const journalCoach = getJournalCoachSnapshot(checkedAt);
  const planEntitlements = getPlanEntitlementSnapshot("demo_free", checkedAt);
  const founderCompanion = getFounderPersonalCompanionSnapshot(checkedAt);
  const economyGrowth = getPlanetEconomyGrowthReadinessSnapshot(checkedAt);
  const constructionQueue = getConstructionQueueSnapshot(checkedAt);
  const consciousness = getPlanetConsciousnessSnapshot(checkedAt);
  const taskDrafts = getCodexTaskDraftReadinessSnapshot(checkedAt);
  const validationInterpreter = getValidationInterpreterReadinessSnapshot(checkedAt);
  const selfHealing = getSelfHealingPipelineSnapshot(checkedAt);
  const productRealityScore = getProductRealityScoreSnapshot(checkedAt);
  const digitalTwin = getProductSurfaceDigitalTwinSnapshot(checkedAt);
  const memoryGraph = getPlanetMemoryGraphSnapshot(checkedAt);
  const founderPreferences = getFounderPreferenceSnapshot(checkedAt);
  const growthIntelligence = getGrowthIntelligenceReadinessSnapshot(checkedAt);
  const trustGovernor = getTrustGovernorSnapshot(checkedAt);
  const localOps = getLocalOperationsReadinessSnapshot(checkedAt);
  const productMemory = getProductMemorySummarySnapshot(checkedAt);
  const localCommandAccess = getFounderLocalCommandAccessSnapshot(checkedAt);

  const desktopApp: FounderCommandDeviceBlueprint = {
    platform: "desktop",
    purpose:
      "Full private command view for planet overview, ministries, coordination, approvals, treasury, media, engineering, ops, Guardian, Legal, and product truth.",
    targetDevices: command.deviceTargets.filter((device) =>
      ["windows", "macos", "linux"].includes(device)
    ),
    primaryScreens: [
      "Top command status",
      "Planet overview",
      "Ministry grid",
      "Presidency coordination queue",
      "Founder approval queue",
      "Guardian and Legal panels",
      "Treasury and Media command",
      "Engineering and Ops tower",
      "Daily briefing",
      "Next safe actions",
    ],
    currentState: "foundation_only",
    routeExposed: false,
    nativeAppShipped: false,
    actionExecutionActive: false,
  };

  const mobileApp: FounderCommandDeviceBlueprint = {
    platform: "mobile",
    purpose:
      "Urgent private review surface for daily briefing, critical alerts, approval cards, Guardian/Legal warnings, media review, ops incidents, and review-later concepts.",
    targetDevices: command.deviceTargets.filter((device) =>
      ["android", "ios"].includes(device)
    ),
    primaryScreens: [
      "Today Briefing",
      "Critical Alerts",
      "Approval Queue",
      "Guardian Alerts",
      "Legal Warnings",
      "Media Review",
      "Ops Incidents",
      "Treasury Readiness",
      "Review Later",
    ],
    currentState: "foundation_only",
    routeExposed: false,
    nativeAppShipped: false,
    actionExecutionActive: false,
  };

  const moduleSummary = {
    total: command.modules.length,
    desktopModules: command.modules.filter((module) =>
      module.platforms.includes("desktop")
    ).length,
    mobileFriendlyModules: command.modules.filter((module) => module.mobileFriendly)
      .length,
    founderApprovalRequired: command.modules.filter(
      (module) => module.actionState === "founder_approval_required"
    ).length,
    blockedModules: command.modules.filter((module) => module.actionState === "blocked")
      .length,
  };

  return {
    checkedAt,
    mode: "founder_king_command_app_deep_foundation",
    access: ownerAccessPolicy,
    desktopApp,
    mobileApp,
    planetOverview: {
      status: room.overview.planetStatus,
      continents: blueprint.structure.continents,
      states: blueprint.structure.states,
      ministries: blueprint.structure.ministries,
      cityModules: blueprint.structure.cityModules,
      blockedOrPlannedSystems: room.overview.blockedOrPlannedSystems,
      topRisks: room.overview.highestRisks,
    },
    modules: command.modules,
    moduleSummary,
    approvalCenter: {
      readOnly: true,
      executionActive: false,
      criticalOverrideWithoutRemediationAllowed: false,
      states: room.approvalQueue.states,
      categories: room.approvalQueue.categories,
      items: command.approvalQueue,
      rules: [
        "Founder approval cannot override Critical blocks without remediation.",
        "Guardian and Legal hard blocks remain hard blocks.",
        "Approval execution is not implemented.",
        "No publishing, billing, broker/feed activation, live execution, real-money routing, or launch activation exists.",
      ],
      blockedActions: room.approvalQueue.blockedActions,
    },
    presidencyCoordination: {
      readiness: "readiness_only" as const,
      coordinationCenter: coordination.coordinationCenter,
      workflowCount: coordination.summary.workflows,
      messageTypeCount: coordination.summary.messageTypes,
      councilIntegration: coordination.councilIntegration,
      criticalBlockedCategories: coordination.summary.criticalBlockedCategories,
      realWorkflowExecutionActive: coordination.summary.realWorkflowExecutionActive,
    },
    councils: {
      readiness: "active_contract" as const,
      councilCount: governance.summary.councils,
      constitutionRuleCount: governance.summary.constitutionRules,
      criticalOverrideAllowedWithoutRemediation:
        governance.summary.criticalOverrideAllowedWithoutRemediation,
      publicLaunchAllowed: governance.summary.publicLaunchAllowed,
      councils: governance.councils,
    },
    guardianLegal: room.guardianLegal,
    treasuryCommand: {
      readiness: "readiness_only" as const,
      controls: command.treasury,
      economyReadiness: economyGrowth.economy,
      growthPath: economyGrowth.growth,
      planTruth: planEntitlements.truth,
      planReadiness: room.planVisibility.planReadiness,
      billingInactive: true,
      subscriptionsInactive: true,
      currentPerformanceFee: "0%",
      futurePerformanceFeeResearchRange: "5%-10%",
      performanceBasedRevenueResearch:
        economyGrowth.economy.monetizationReadiness.performanceBasedRevenue,
      ownerOnlyFutureActivation: true,
      visibleToPublicUsers: false,
      requiredBeforeActivation: [
        "billing provider",
        "legal review",
        "regulatory review",
        "user consent",
        "Founder approval",
        "audit trail",
      ],
    },
    mediaCommand: {
      readiness: "readiness_only" as const,
      media: command.media,
      mediaOffice: economyGrowth.mediaOffice,
      aiVideoStudio: economyGrowth.aiVideoStudio,
      partnershipReadiness: economyGrowth.partnerships,
      contentDraftReadiness: "draft_review_only",
      aiVideoScriptReadiness: "draft_review_only",
      campaignReadiness: "planned_review_only",
      socialAccountRegistryReadiness: "not_connected",
      legalReviewRequired: true,
      guardianReviewRequired: true,
      founderApprovalRequired: true,
      socialAccountsConnected: false,
      socialTokensPresent: false,
      externalPublishingActive: false,
      fakeFollowersIncluded: false,
      fakeMetricsIncluded: false,
    },
    communityVipGrowth: {
      readiness: "planned_only" as const,
      community: economyGrowth.community,
      vip: economyGrowth.vip,
      noFakeRooms: !economyGrowth.community.fakeActiveRooms,
      noFakeVipActivation: economyGrowth.vip.status === "planned_not_active",
    },
    partnershipsCommand: {
      readiness: "inactive_planned" as const,
      sponsoredClock: economyGrowth.partnerships.sponsoredClock,
      partnershipTypes: economyGrowth.partnerships.partnershipTypes,
      requiredReviews: economyGrowth.partnerships.requiredReviews,
      fakePartnershipClaims: economyGrowth.partnerships.fakePartnershipClaims,
      impliedEndorsementAllowed: economyGrowth.partnerships.impliedEndorsementAllowed,
    },
    resourcesEconomyMap: economyGrowth.resourcesToEconomy,
    finalInternalAcceptance: {
      readiness: economyGrowth.finalAcceptance.status,
      launchReady: economyGrowth.finalAcceptance.launchReady,
      publicLaunchApproved: economyGrowth.finalAcceptance.publicLaunchApproved,
      productionApproved: economyGrowth.finalAcceptance.productionApproved,
      humanVisualAcceptanceRequired:
        economyGrowth.finalAcceptance.humanVisualAcceptanceRequired,
      realWorldBetaTestingRequired:
        economyGrowth.finalAcceptance.realWorldBetaTestingRequired,
      recommendation: economyGrowth.finalAcceptance.recommendation,
      gapChecklist: economyGrowth.finalGapChecklist,
      nonLaunchRoadmap: economyGrowth.nonLaunchRoadmap,
    },
    autonomousConstructionIntelligence: {
      readiness: "readiness_only" as const,
      loop: consciousness.coreLoop,
      eventSummary: consciousness.riskSummary,
      constructionQueue: constructionQueue.summary,
      taskDrafts: {
        total: taskDrafts.drafts.length,
        blocked: taskDrafts.drafts.filter((draft) => draft.autonomyLevel === "blocked").length,
        externalExecution: taskDrafts.truth.externalCodexExecution,
      },
      validationInterpreter: {
        sampleStatuses: Object.values(validationInterpreter.samples).map((sample) => sample.status),
        falsePassAllowed: validationInterpreter.truth.falsePassAllowed,
      },
      selfHealing: {
        automaticRepairExecution: selfHealing.truth.automaticRepairExecution,
        supportedFailures: selfHealing.supportedFailures,
      },
      productRealityScore: {
        averageScore: productRealityScore.averageScore,
        humanAcceptanceRequired: productRealityScore.truth.humanAhmadAcceptanceRequired,
      },
      digitalTwin: {
        layers: digitalTwin.layers.map((layer) => ({
          role: layer.role,
          founderCommandExposure: layer.founderCommandExposure,
        })),
        usersSeeFounderCommand: digitalTwin.truth.usersSeeFounderCommand,
      },
      memoryGraph: {
        nodes: memoryGraph.nodes.length,
        edges: memoryGraph.edges.length,
        privateUserDataStored: memoryGraph.truth.privateUserDataStored,
        secretsStored: memoryGraph.truth.secretsStored,
      },
      founderPreferences: founderPreferences.preferences,
      growthIntelligence: {
        signals: growthIntelligence.signals.length,
        realAnalytics: growthIntelligence.truth.realAnalytics,
      },
      trustGovernor: {
        guaranteedProfitOutcome: trustGovernor.samples.guaranteedProfit.outcome,
        fakePartnershipAllowed: trustGovernor.truth.fakePartnershipAllowed,
      },
      whatNotToSendToCodex: [
        "production secret changes",
        "live execution activation",
        "real-money routing",
        "broker/feed activation",
        "billing activation",
        "social publishing",
        "public launch claims",
      ],
      nextSafeConstructionActions: [
        "Use queue drafts for scoped Codex prompts only after review.",
        "Interpret validation results before accepting work.",
        "Report blocked activation requests to Founder Command as blocked readiness only.",
      ],
      externalExecutionActive: false,
    },
    localUniverseOperations: {
      readiness: "readiness_only" as const,
      doctrine: localOps.doctrine,
      dayCycle: localOps.dayCycle,
      readinessLaw: localOps.readinessLaw,
      digitalTwin: localOps.digitalTwin,
      founderAcceptance: localOps.founderAcceptance,
      localReport: {
        localDayNumber: localOps.report.localDayNumber,
        readinessState: localOps.report.readinessState,
        completedStages: localOps.report.completedStages,
        failedStages: localOps.report.failedStages,
        validationStatus: localOps.report.validationStatus,
        gitStatus: localOps.report.gitStatus,
        blockers: localOps.report.blockers,
        nextActions: localOps.report.nextActions,
        launchForbiddenReminder: localOps.report.launchForbiddenReminder,
      },
      nextSafeLocalActions: localOps.report.nextActions,
      launchForbiddenReminder: localOps.report.launchForbiddenReminder,
      launchAutomationActive: false,
    },
    persistentProductMemory: {
      readiness: "safe_local_internal_foundation" as const,
      storage: productMemory.storage,
      domainSummary: productMemory.domainSummary,
      recentFounderAcceptance:
        productMemory.founderSummary.recentAcceptanceDecisions.length,
      openProductGaps: productMemory.founderSummary.openProductGaps.length,
      recentValidationSummaries:
        productMemory.founderSummary.recentValidationSummaries.length,
      buildDecisions: productMemory.founderSummary.buildDecisions.length,
      localDayReports: productMemory.founderSummary.localDayReports.length,
      journalCoachMemory: productMemory.founderSummary.journalCoachReadiness,
      memorySafetyStatus: productMemory.founderSummary.memorySafetyStatus,
      forbiddenStorageReminders:
        productMemory.founderSummary.forbiddenStorageReminders,
      truth: productMemory.truth,
    },
    localCommandAppShell: {
      readiness: "local_read_only_shell_foundation" as const,
      access: localCommandAccess,
      routeExposure: {
        apiSnapshotAdded: true,
        apiReadinessAdded: true,
        hiddenPreviewRouteCreated: false,
        publicNavigationVisible: false,
        userPlanExposure: false,
      },
      shellZones: [
        "local command status",
        "daily briefing",
        "local day cycle",
        "construction queue",
        "product memory",
        "product gaps",
        "validation summaries",
        "Guardian/Legal warnings",
        "Treasury/Media readiness",
        "next safe actions",
        "what not to do",
      ],
      approvalExecutionActive: false,
      nativeDesktopShellShipped: false,
      nativeMobileShellShipped: false,
      secretsVisible: false,
      privateUserDataVisible: false,
      fakeMetricsVisible: false,
    },
    companionBrain: {
      founderCompanion,
      brainContextQuality: brain.contextQuality,
      founderGuidanceMode: brain.founderGuidanceMode,
      blockedCapabilities: brain.blockedCapabilities,
      safeNextActions: brain.safeNextActions,
      journalCoachReadiness: journalCoach.planAccess,
      canApproveAlone: false,
      canOverrideBlocks: false,
    },
    engineeringOpsQuality: {
      engineeringTasks: room.briefing.engineeringTasks,
      opsHealth: command.ops,
      visualAcceptance: {
        status: visualAcceptance.status,
        averageScoreEstimate: visualAcceptance.averageScoreEstimate,
        humanAcceptanceRequired: visualAcceptance.truth.humanAcceptanceRequired,
      },
    },
    productTruth: productTruth.summary,
    whatNotToDoToday: room.overview.whatNotToDoNow,
    nextSafeActions: room.overview.nextSafeActions,
    apiReadiness: [
      "/api/founder/command/snapshot",
      "/api/founder/command/modules",
      "/api/founder/approval/readiness",
      "/api/founder/treasury/readiness",
      "/api/founder/media/readiness",
      "/api/founder/economy/readiness",
      "/api/founder/partnerships/readiness",
      "/api/founder/final-acceptance/readiness",
      "/api/founder/local-command/snapshot",
      "/api/founder/local-command/readiness",
      "/api/planet/economy/readiness",
      "/api/planet/media/readiness",
      "/api/planet/consciousness",
      "/api/planet/events/readiness",
      "/api/planet/construction/queue",
      "/api/planet/codex/task-drafts",
      "/api/planet/validation/interpreter",
      "/api/planet/product-reality/score",
      "/api/planet/trust-governor",
      "/api/founder/construction/readiness",
      "/api/local-ops/day-cycle",
      "/api/local-ops/readiness-law",
      "/api/local-ops/report",
      "/api/local-ops/digital-twin",
      "/api/product-memory/summary",
      "/api/product-memory/founder-acceptance",
      "/api/product-memory/product-gaps",
      "/api/product-memory/local-day",
      "/api/product-memory/validation-summary",
    ],
    safety: safetySummary,
    blockers: [
      "owner-only desktop/mobile app authentication is not shipped",
      "device trust and step-up confirmation are planned",
      "audit-backed approval execution is planned",
      "native desktop and mobile app shells are planned",
      "Founder Command remains hidden from public navigation and user plans",
    ],
  };
}

export function getFounderCommandModulesReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getFounderCommandAppSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_command_modules_readiness",
    access: snapshot.access,
    moduleSummary: snapshot.moduleSummary,
    modules: snapshot.modules,
    safety: snapshot.safety,
  };
}

export function getFounderApprovalReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getFounderCommandAppSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_approval_center_readiness",
    access: snapshot.access,
    approvalCenter: snapshot.approvalCenter,
    safety: snapshot.safety,
  };
}

export function getFounderTreasuryReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getFounderCommandAppSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_treasury_command_readiness",
    access: snapshot.access,
    treasuryCommand: snapshot.treasuryCommand,
    safety: snapshot.safety,
  };
}

export function getFounderMediaReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getFounderCommandAppSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_media_command_readiness",
    access: snapshot.access,
    mediaCommand: snapshot.mediaCommand,
    safety: snapshot.safety,
  };
}
