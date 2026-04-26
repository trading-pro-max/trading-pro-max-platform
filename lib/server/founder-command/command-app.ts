import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getPrivateFounderRealm, getPublicPlanRealms } from "@/lib/plans/realms";
import { getAcademyReadinessSnapshot } from "@/lib/server/academy";
import { getAlkonUniverseSnapshot } from "@/lib/server/alkon";
import { getBrandIntelligenceInternalReadiness } from "@/lib/server/brand-intelligence";
import { getAiVideoStudioReadinessSnapshot } from "@/lib/server/ai-video-studio";
import { getCommunityReadinessSnapshot } from "@/lib/server/community";
import {
  getConstructionQueueSnapshot,
  getCodexTaskDraftReadinessSnapshot,
  getSelfHealingPipelineSnapshot,
  getValidationInterpreterReadinessSnapshot,
} from "@/lib/server/codex-construction";
import {
  getCodexPresidencyReport,
  getCodexSovereigntySnapshot,
} from "@/lib/server/codex-sovereignty";
import { getDesignMinistrySnapshot } from "@/lib/server/design-ministry";
import { getPlanetEconomyGrowthReadinessSnapshot } from "@/lib/server/economy-growth";
import { getTpmBrainContextSnapshot } from "@/lib/server/brain";
import { getGrowthIntelligenceReadinessSnapshot } from "@/lib/server/growth-intelligence";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import {
  getLocalDayOneReadinessSnapshot,
  getLocalDayOneOperationSnapshot,
  getLocalDailyOperationsLoopSnapshot,
  getLocalDailyOperationsReportSnapshot,
  getLocalLivingDayLoopSnapshot,
  getLocalOperationsFinalReportSnapshot,
  getLocalOperationsReadinessSnapshot,
} from "@/lib/server/local-ops";
import { getRealWorldLaunchReadinessSnapshot } from "@/lib/server/launch-readiness";
import { getFinalConvergenceSnapshot } from "@/lib/server/final-convergence";
import { getPlanetaryEnvironmentReadinessSnapshot } from "@/lib/server/environment";
import { getEarthRealitySnapshot } from "@/lib/server/earth-reality";
import { getPersonalRealityReadinessSnapshot } from "@/lib/server/personal-reality";
import { getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import { getInvisibleOperatingLayerSnapshot } from "@/lib/server/invisible-operating-layer";
import {
  getContentReviewReadinessSnapshot,
  getMediaOfficeReadinessSnapshot,
} from "@/lib/server/media-office";
import { getPlanetConsciousnessSnapshot } from "@/lib/server/planet-consciousness";
import { getPlanetMemoryGraphSnapshot } from "@/lib/server/planet-memory";
import {
  getInterMinistryCoordinationSnapshot,
  getPlanetBlueprintSnapshot,
  getPlanetGovernanceSnapshot,
} from "@/lib/server/planet-os";
import { getProductTruthSnapshot } from "@/lib/server/product";
import {
  getProductMemoryDailySummarySnapshot,
  getProductMemorySummarySnapshot,
} from "@/lib/server/product-memory";
import { getFounderToolingReadinessSnapshot } from "@/lib/server/integrations";
import {
  getProductRealityFinalScoreSnapshot,
  getProductRealityLocalStartScoreSnapshot,
  getProductRealityScoreSnapshot,
  getProductSurfaceDigitalTwinSnapshot,
} from "@/lib/server/product-reality";
import { getSecuritySovereigntySnapshot } from "@/lib/server/security-sovereignty";
import {
  getFounderSecurityReadinessSnapshot,
  getSecretsAuthoritySnapshot,
} from "@/lib/server/secrets-authority";
import {
  getFounderIdeaInboxReadiness,
  getFounderSovereignAutonomyRoomSnapshot,
  getSovereignAutonomyReadinessSnapshot,
} from "@/lib/server/sovereign-autonomy";
import { getTrustGovernorSnapshot } from "@/lib/server/trust-governor";
import { getVisualAcceptanceSnapshot } from "@/lib/server/visual-acceptance";
import { getVipRoomsReadinessSnapshot } from "@/lib/server/vip-rooms";
import { getWorldInterfaceSnapshot } from "@/lib/server/world-interface";
import { getFounderLocalCommandAccessSnapshot } from "./access";
import { getFounderBuildRoomSnapshot } from "./build-room";
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
  const mediaOfficeWorkflow = getMediaOfficeReadinessSnapshot(checkedAt);
  const aiVideoStudioWorkflow = getAiVideoStudioReadinessSnapshot(checkedAt);
  const contentReviewWorkflow = getContentReviewReadinessSnapshot(checkedAt);
  const constructionQueue = getConstructionQueueSnapshot(checkedAt);
  const consciousness = getPlanetConsciousnessSnapshot(checkedAt);
  const taskDrafts = getCodexTaskDraftReadinessSnapshot(checkedAt);
  const validationInterpreter = getValidationInterpreterReadinessSnapshot(checkedAt);
  const selfHealing = getSelfHealingPipelineSnapshot(checkedAt);
  const productRealityScore = getProductRealityScoreSnapshot(checkedAt);
  const productRealityFinalScore = getProductRealityFinalScoreSnapshot(checkedAt);
  const productRealityLocalStartScore =
    getProductRealityLocalStartScoreSnapshot(checkedAt);
  const digitalTwin = getProductSurfaceDigitalTwinSnapshot(checkedAt);
  const memoryGraph = getPlanetMemoryGraphSnapshot(checkedAt);
  const founderPreferences = getFounderPreferenceSnapshot(checkedAt);
  const growthIntelligence = getGrowthIntelligenceReadinessSnapshot(checkedAt);
  const trustGovernor = getTrustGovernorSnapshot(checkedAt);
  const localOps = getLocalOperationsReadinessSnapshot(checkedAt);
  const localDayOne = getLocalDayOneReadinessSnapshot(checkedAt);
  const localDayOneOperation = getLocalDayOneOperationSnapshot(checkedAt);
  const localDailyLoop = getLocalDailyOperationsLoopSnapshot(checkedAt);
  const localDailyReport = getLocalDailyOperationsReportSnapshot(checkedAt);
  const localFinalReport = getLocalOperationsFinalReportSnapshot(checkedAt);
  const productMemory = getProductMemorySummarySnapshot(checkedAt);
  const productMemoryDailySummary =
    getProductMemoryDailySummarySnapshot(checkedAt);
  const localCommandAccess = getFounderLocalCommandAccessSnapshot(checkedAt);
  const buildRoom = getFounderBuildRoomSnapshot(checkedAt);
  const designMinistry = getDesignMinistrySnapshot(checkedAt);
  const brandIntelligence = getBrandIntelligenceInternalReadiness(checkedAt);
  const securitySovereignty = getSecuritySovereigntySnapshot(checkedAt);
  const secretsAuthority = getSecretsAuthoritySnapshot(checkedAt);
  const founderSecurity = getFounderSecurityReadinessSnapshot(checkedAt);
  const worldInterface = getWorldInterfaceSnapshot(checkedAt);
  const academy = getAcademyReadinessSnapshot(checkedAt);
  const community = getCommunityReadinessSnapshot(checkedAt);
  const vipRooms = getVipRoomsReadinessSnapshot(checkedAt);
  const toolingReadiness = getFounderToolingReadinessSnapshot(checkedAt);
  const sovereignAutonomy = getSovereignAutonomyReadinessSnapshot(checkedAt);
  const sovereignAutonomyRoom =
    getFounderSovereignAutonomyRoomSnapshot(checkedAt);
  const founderIdeaInbox = getFounderIdeaInboxReadiness(checkedAt);
  const codexSovereignty = getCodexSovereigntySnapshot(checkedAt);
  const codexPresidencyReport = getCodexPresidencyReport(checkedAt);
  const invisibleOperatingLayer = getInvisibleOperatingLayerSnapshot(checkedAt);
  const localLivingDayLoop = getLocalLivingDayLoopSnapshot(checkedAt);
  const publicRealms = getPublicPlanRealms();
  const privateAlkonRealm = getPrivateFounderRealm();
  const alkonCommandUniverse = getAlkonUniverseSnapshot(checkedAt);
  const realWorldLaunchReadiness =
    getRealWorldLaunchReadinessSnapshot(checkedAt);
  const finalConvergence = getFinalConvergenceSnapshot(checkedAt);
  const planetaryEnvironment =
    getPlanetaryEnvironmentReadinessSnapshot(checkedAt);
  const earthReality = getEarthRealitySnapshot(checkedAt);
  const personalReality = getPersonalRealityReadinessSnapshot(checkedAt);
  const deviceConstellation = getFounderDeviceReadinessSnapshot(checkedAt);

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
    insideOutsidePlanet: {
      readiness: "local_living_experience_ready" as const,
      publicWorld: {
        status: "complete_public_platform_world",
        surfaces: [
          "Home",
          "Trading Workspace",
          "Markets",
          "Plans",
          "Apps / Platforms",
          "Academy",
          "Community",
          "Support",
          "Settings",
          "Diagnostics",
        ],
        founderTerminologyVisible: false,
      },
      privateWorld: {
        status: "private_founder_planet_command_world",
        ownerOnly: ownerAccessPolicy.ownerOnly,
        publicNavigationVisible: ownerAccessPolicy.publicNavigationVisible,
        approvalExecutionActive: false,
        ideaInboxReady: founderIdeaInbox.status === "ready",
        alkonUniverse: {
          realmId: privateAlkonRealm.realmId,
          privateNames: ["Alkon", "الكون"],
          visibility: privateAlkonRealm.visibility,
          universeVisibility: alkonCommandUniverse.visibility,
          activationState: privateAlkonRealm.activationState,
          publicExposure: alkonCommandUniverse.publicExposure,
          publicRouteExposed:
            alkonCommandUniverse.apiExposure.publicAlkonRoutesExposed,
          founderReadinessRoute:
            alkonCommandUniverse.apiExposure.founderReadinessRoute,
          productTruthStatus: alkonCommandUniverse.productTruthStatus.overall,
          publicPlanAccess: false,
          cosmicPhysicsReady:
            alkonCommandUniverse.cosmicPhysics.taskGraphStatus === "ready",
          cosmicPhysicsPublicExposure:
            alkonCommandUniverse.cosmicPhysics.publicExposure,
        },
      },
      planRealmFunctionalExperience: {
        publicRealms: publicRealms.map((realm) => ({
          realmId: realm.realmId,
          publicPlanName: realm.publicPlanName,
          activationState: realm.activationState,
          visualIdentity: realm.visualIdentity,
          assistantBehavior: realm.assistantBehavior,
          journalCoachDepth: realm.journalCoachDepth,
          workspaceBehavior: realm.workspaceBehavior,
          reportsDepth: realm.reportsDepth,
          featureGapCount:
            realm.lockedFeatures.length + realm.plannedFeatures.length,
        })),
        realmGaps: publicRealms.map(
          (realm) =>
            `${realm.publicPlanName}: ${realm.activationState}; ${realm.lockedFeatures.length} locked, ${realm.plannedFeatures.length} planned.`
        ),
        visualAcceptance: publicRealms.map((realm) => ({
          realmId: realm.realmId,
          publicPlanName: realm.publicPlanName,
          shapeLanguage: realm.visualIdentity.shapeLanguage,
          motion: realm.visualIdentity.motion,
        })),
        nextSafeActions: [
          "Keep Free complete and active for paper-safe use.",
          "Keep Pro and VIP planned or entitlement-gated until real gates exist.",
          "Keep Institutional future-only until team/admin/audit/compliance systems exist.",
          "Keep Alkon / الكون private to Founder Command only.",
        ],
      },
      invisibleOperatingLayer: {
        systems: invisibleOperatingLayer.systems.length,
        publicSafeOutputs: invisibleOperatingLayer.publicSafeOutputs.length,
        hiddenFromPublic: invisibleOperatingLayer.hiddenFromPublic,
        truth: invisibleOperatingLayer.truth,
      },
      localLivingDayLoop: {
        mode: localLivingDayLoop.mode,
        stages: localLivingDayLoop.loop.length,
        todayIdeaIntake: localLivingDayLoop.today.ideaIntake,
        openGaps: localLivingDayLoop.today.openGaps,
        proposedCodexDrafts: localLivingDayLoop.today.proposedCodexDrafts,
        blockedRequests: localLivingDayLoop.today.blockedRequests,
        visualReviewNeeds: localLivingDayLoop.today.visualReviewNeeds,
        nextSafeAction: localLivingDayLoop.today.nextSafeAction,
        codebaseRealityAudit: localLivingDayLoop.codebaseRealityAudit,
        truth: localLivingDayLoop.truth,
      },
    },
    alkonUniverse: alkonCommandUniverse,
    alkonCosmicPhysics: alkonCommandUniverse.cosmicPhysics,
    finalConvergence,
    earthReality: {
      status: earthReality.status,
      score: earthReality.score,
      layerCount: earthReality.layers.length,
      surfaceCount: earthReality.surfaces.length,
      publicPrivateBoundaryStatus: earthReality.publicPrivateBoundaryStatus,
      productTruthStatus: earthReality.productTruthStatus,
      nextSafeActions: earthReality.nextSafeActions,
      founderReviewNeeded: earthReality.founderReviewNeeded,
    },
    personalReality: {
      status: personalReality.status,
      publicProfiles: personalReality.publicProfiles.length,
      activeFreeControls: personalReality.freeControls,
      plannedControls: personalReality.plannedControls,
      futureControls: personalReality.futureControls,
      internalProfilesHidden: personalReality.internalProfilesHidden,
      assistantControlled: personalReality.assistantControlled,
      planAware: personalReality.planAware,
      productTruthGuarded: personalReality.productTruthGuarded,
      publicPrivateBoundaryStatus: personalReality.publicPrivateBoundaryStatus,
    },
    deviceConstellation: {
      status: deviceConstellation.status,
      publicDeviceCount: deviceConstellation.publicDevices.length,
      privateDeviceCount: deviceConstellation.privateDevices.length,
      publicDevices: deviceConstellation.publicDevices.map((device) => ({
        deviceId: device.deviceId,
        publicName: device.publicName,
        availability: device.availability,
        permissionLevel: device.permissionLevel,
        installStatus: device.installStatus,
        publicVisible: device.publicVisible,
      })),
      privateDevices: deviceConstellation.privateDevices.map((device) => ({
        deviceId: device.deviceId,
        publicName: device.publicName,
        privateName: device.privateName,
        availability: device.availability,
        permissionLevel: device.permissionLevel,
        securityPosture: device.securityPosture,
        founderVisible: device.founderVisible,
        publicVisible: device.publicVisible,
        nextSafeAction: device.nextSafeAction,
      })),
      permissionRules: deviceConstellation.permissionRules,
      securityReadiness: deviceConstellation.securityReadiness,
      continuity: deviceConstellation.continuity,
      publicExposure: deviceConstellation.publicExposure,
      noExecution: deviceConstellation.noExecution,
      noSecrets: deviceConstellation.noSecrets,
      blockedActions: deviceConstellation.blockedActions,
      nextSafeActions: deviceConstellation.nextSafeActions,
    },
    planetaryEnvironment: {
      status: planetaryEnvironment.status,
      publicName: planetaryEnvironment.publicName,
      internalName: planetaryEnvironment.internalName,
      solarPhase: planetaryEnvironment.snapshot.solarPhase,
      lunarLayer: planetaryEnvironment.snapshot.lunarLayer,
      weatherReadiness: planetaryEnvironment.snapshot.weatherState,
      marketSession: planetaryEnvironment.snapshot.marketSession,
      systemWeather: planetaryEnvironment.snapshot.systemWeather,
      publicIntensity: "expressive",
      workspaceIntensity: "subtle",
      chartIntensity: "none",
      privacy: planetaryEnvironment.snapshot.diagnostics.privacy,
      whatNotToAutomate: [
        "Do not request GPS or precise location.",
        "Do not use weather, lunar, solar, or market-session state as trading advice.",
        "Do not connect external weather providers until a reviewed consent model exists.",
        "Do not increase workspace atmosphere enough to harm chart readability.",
      ],
      truth: planetaryEnvironment.snapshot.truth,
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
      workflowReadiness: mediaOfficeWorkflow.status,
      aiVideoWorkflowReadiness: aiVideoStudioWorkflow.status,
      contentReviewReadiness: contentReviewWorkflow.status,
      mediaQueue: mediaOfficeWorkflow.queueSummary,
      aiVideoQueue: aiVideoStudioWorkflow.queueSummary,
      blockedClaims: mediaOfficeWorkflow.blockedClaims,
      reviewRequired:
        mediaOfficeWorkflow.reviewQueue.guardian.length +
        mediaOfficeWorkflow.reviewQueue.legal.length,
      founderApprovalRequiredItems: mediaOfficeWorkflow.reviewQueue.founder.length,
      noPublishingActive: mediaOfficeWorkflow.noPublishingActive,
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
    mediaAiVideoWorkflowReadiness: {
      readiness: "draft_review_only" as const,
      mediaOffice: {
        mode: mediaOfficeWorkflow.mode,
        status: mediaOfficeWorkflow.status,
        contentTypes: mediaOfficeWorkflow.contentTypes.length,
        lifecycle: mediaOfficeWorkflow.lifecycle,
        riskLevels: mediaOfficeWorkflow.riskLevels,
        queueSummary: mediaOfficeWorkflow.queueSummary,
        reviewQueue: mediaOfficeWorkflow.reviewQueue,
        blockedClaims: mediaOfficeWorkflow.blockedClaims,
      },
      aiVideoStudio: {
        mode: aiVideoStudioWorkflow.mode,
        status: aiVideoStudioWorkflow.status,
        artifactTypes: aiVideoStudioWorkflow.artifactTypes.length,
        lifecycle: aiVideoStudioWorkflow.lifecycle,
        riskLevels: aiVideoStudioWorkflow.riskLevels,
        queueSummary: aiVideoStudioWorkflow.queueSummary,
        reviewWorkflow: aiVideoStudioWorkflow.reviewWorkflow,
      },
      reviewLifecycle: {
        mode: contentReviewWorkflow.mode,
        status: contentReviewWorkflow.status,
        lifecycle: contentReviewWorkflow.lifecycle,
        publishedStateIncluded:
          contentReviewWorkflow.lifecyclePolicy.publishedStateIncluded,
        samples: {
          safeEducation: contentReviewWorkflow.samples.safeEducation.riskLevel,
          proTeaser: contentReviewWorkflow.samples.proTeaser.riskLevel,
          vipTeaser: contentReviewWorkflow.samples.vipTeaser.riskLevel,
          partnershipDraft:
            contentReviewWorkflow.samples.partnershipDraft.riskLevel,
          fakePartnership:
            contentReviewWorkflow.samples.fakePartnership.riskLevel,
          guaranteedProfit:
            contentReviewWorkflow.samples.guaranteedProfit.riskLevel,
        },
      },
      founderCommandQueue: {
        mediaQueue: mediaOfficeWorkflow.queueSummary,
        aiVideoQueue: aiVideoStudioWorkflow.queueSummary,
        blockedClaims: mediaOfficeWorkflow.blockedClaims,
        reviewRequired:
          mediaOfficeWorkflow.reviewQueue.guardian.length +
          mediaOfficeWorkflow.reviewQueue.legal.length,
        founderApprovalRequired: mediaOfficeWorkflow.reviewQueue.founder.length,
        noPublishingActive: true,
      },
      truth: {
        media: mediaOfficeWorkflow.truth,
        aiVideo: aiVideoStudioWorkflow.truth,
        contentReview: contentReviewWorkflow.truth,
      },
    },
    worldInterfaceCommand: {
      readiness: "readiness_only" as const,
      unifiedInbox: worldInterface.founderCommandReadiness.unifiedInboxReadiness,
      channelHealth: worldInterface.founderCommandReadiness.channelHealth,
      channels: worldInterface.channelSummary,
      quarantine: worldInterface.quarantine,
      diplomaticResponse: worldInterface.diplomaticResponse,
      draftReplies: worldInterface.founderCommandReadiness.draftReplies,
      legalGuardianQueues:
        worldInterface.founderCommandReadiness.legalGuardianQueues,
      vipInstitutionalInterest:
        worldInterface.founderCommandReadiness.vipInstitutionalInterest,
      partnershipOpportunities:
        worldInterface.founderCommandReadiness.partnershipOpportunities,
      brandProtectionAlerts:
        worldInterface.founderCommandReadiness.brandProtectionAlerts,
      sampleOutcomes: {
        supportRequest:
          worldInterface.sampleClassifications.supportRequest.outcome,
        partnerRequest:
          worldInterface.sampleClassifications.partnerRequest.outcome,
        mediaRequest: worldInterface.sampleClassifications.mediaRequest.outcome,
        vipInterest: worldInterface.sampleClassifications.vipInterest.outcome,
        brandImpersonation:
          worldInterface.sampleClassifications.brandImpersonation.outcome,
        securityAlert:
          worldInterface.sampleClassifications.securityAlert.outcome,
        legalNotice: worldInterface.sampleClassifications.legalNotice.outcome,
        scamAttempt: worldInterface.sampleClassifications.scamAttempt.outcome,
        secretRequest:
          worldInterface.sampleClassifications.secretRequest.outcome,
      },
      truth: worldInterface.truth,
    },
    communityVipGrowth: {
      readiness: "planned_only" as const,
      community: economyGrowth.community,
      vip: economyGrowth.vip,
      noFakeRooms: !economyGrowth.community.fakeActiveRooms,
      noFakeVipActivation: economyGrowth.vip.status === "planned_not_active",
    },
    academyCommunityVipReadiness: {
      readiness: "readiness_only" as const,
      academy: {
        status: academy.status,
        learningPaths: academy.learningPaths.length,
        lessons: academy.lessons.length,
        free: academy.planAccess.free,
        pro: academy.planAccess.pro,
        vip: academy.planAccess.vip,
        institutional: academy.planAccess.institutional,
        safety: academy.safety,
      },
      community: {
        status: community.status,
        rooms: community.rooms.length,
        free: community.planAccess.free,
        pro: community.planAccess.pro,
        vip: community.planAccess.vip,
        institutional: community.planAccess.institutional,
        safetyRules: community.safetyPolicy.rules,
        guardianModeration: community.safetyPolicy.moderation,
        legalReview: community.safetyPolicy.legalReview,
      },
      vipRooms: {
        status: vipRooms.status,
        capabilities: vipRooms.capabilities.length,
        vipAccess: vipRooms.planAccess.vip,
        signalGuarantees: vipRooms.roomRules.signalGuarantees,
        copyTrading: vipRooms.roomRules.copyTrading,
        profitPromises: vipRooms.roomRules.profitPromises,
        guardianModerationRequired:
          vipRooms.roomRules.guardianModerationRequired,
        legalClaimReviewRequired: vipRooms.roomRules.legalClaimReviewRequired,
      },
      safetyRules: [
        "no fake active rooms",
        "no fake users or members",
        "no fake Pro/VIP access",
        "no signal rooms",
        "no copy trading",
        "no profit promises",
        "Guardian moderation required",
        "Legal claim review required",
      ],
      truth: {
        academyFakeUsers: academy.truth.fakeUsers,
        communityActiveRooms: community.truth.activeRooms,
        communityFakeMembers: community.truth.fakeMembers,
        vipActive: vipRooms.truth.vipActive,
        vipPrivateRoomsActive: vipRooms.truth.privateRoomsActive,
        copyTradingActive: vipRooms.truth.copyTrading,
        billingActive:
          academy.truth.billingActive ||
          community.truth.billingActive ||
          vipRooms.truth.billingActive,
        founderCommandPublic:
          academy.truth.founderCommandPublic ||
          community.truth.founderCommandPublic ||
          vipRooms.truth.founderCommandPublic,
      },
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
    realWorldLaunchReadiness: {
      status: realWorldLaunchReadiness.status,
      budgetCapChf: realWorldLaunchReadiness.budget.monthlyCapChf,
      monthlyTargetChf:
        realWorldLaunchReadiness.budget.initialOperatingTargetChf,
      stagingReadiness: realWorldLaunchReadiness.infrastructure.status,
      waitlistReadiness: realWorldLaunchReadiness.waitlist.status,
      legalReadiness: realWorldLaunchReadiness.legal.status,
      supportReadiness: realWorldLaunchReadiness.support.status,
      billingReadiness: realWorldLaunchReadiness.billing.status,
      betaReadiness: realWorldLaunchReadiness.beta.status,
      launchGateStatus: realWorldLaunchReadiness.gate.status,
      founderFinalDecisionRequired:
        realWorldLaunchReadiness.gate.founderFinalDecisionRequired,
      blockedActivations:
        realWorldLaunchReadiness.founderCommand.blockedActivations,
      nextSafeAction: realWorldLaunchReadiness.gate.nextSafeAction,
      truth: realWorldLaunchReadiness.truth,
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
      dailyLoop: {
        status: localDailyLoop.status,
        totalStages: localDailyLoop.summary.totalStages,
        memoryTouchpoints: localDailyLoop.summary.memoryTouchpoints,
        codexTouchpoints: localDailyLoop.summary.codexTouchpoints,
        automaticLaunch: localDailyLoop.summary.automaticLaunch,
        secretStorageIncluded: localDailyLoop.summary.secretStorageIncluded,
        surveillanceIncluded: localDailyLoop.summary.surveillanceIncluded,
      },
      readinessLaw: localOps.readinessLaw,
      digitalTwin: localOps.digitalTwin,
      founderAcceptance: localOps.founderAcceptance,
      dailyReport: {
        dayNumber: localDailyReport.dayNumber,
        readiness: localDailyReport.readiness.state,
        productRealityOverall: localDailyReport.scores.productRealityOverall,
        openGaps: localDailyReport.gaps.length,
        suggestedTask: localDailyReport.nextTask.title,
        validationStatus: localDailyReport.validation.status,
        gitClean: localDailyReport.gitClean,
        launchForbiddenReminder: localDailyReport.launchForbiddenReminder,
      },
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
    dailyOperationsMemoryLoop: {
      readiness: "ready" as const,
      latestLocalDay: {
        dayNumber: productMemoryDailySummary.latestLocalDay.dayNumber,
        readinessState:
          productMemoryDailySummary.latestLocalDay.readinessState,
        validationStatus:
          productMemoryDailySummary.latestLocalDay.validationStatus,
        gitClean: productMemoryDailySummary.latestLocalDay.gitClean,
      },
      openGaps: productMemoryDailySummary.productGaps.open,
      suggestedTask: productMemoryDailySummary.suggestedNextTask,
      memoryStatus: productMemoryDailySummary.memoryStatus,
      validationStatus: productMemoryDailySummary.validation,
      launchForbiddenReminder:
        productMemoryDailySummary.latestLocalDay.launchForbiddenReminder,
      truth: productMemoryDailySummary.truth,
    },
    localDayOneAcceptance: {
      readiness: "local_day_one_gate" as const,
      gateStatus: localDayOne.gateStatus,
      readyToStartLocalDayOne: localDayOne.readyToStartLocalDayOne,
      ahmadHumanReviewRequired: localDayOne.ahmadHumanReviewRequired,
      globalLaunchEvaluation: localDayOne.globalLaunchEvaluation,
      categorySummary: localDayOne.summary,
      blockers: localDayOne.blockers,
      checklistRoutes: localDayOne.routes,
      productRealityFinalScore: {
        overallScore: productRealityFinalScore.overallScore,
        status: productRealityFinalScore.status,
        ahmadHumanAcceptanceRequired:
          productRealityFinalScore.ahmadHumanAcceptanceRequired,
        noPerfectScoreClaim:
          productRealityFinalScore.truth.noPerfectScoreClaim,
      },
      operationGate: {
        status: localDayOneOperation.status,
        canStartLocalWork: localDayOneOperation.canStartLocalWork,
        canStartOnlyAs: localDayOneOperation.canStartOnlyAs,
        ahmadHumanVisualAcceptanceRequired:
          localDayOneOperation.ahmadHumanVisualAcceptanceRequired,
        ahmadVisualReviewRecorded:
          localDayOneOperation.ahmadVisualReviewRecorded,
        visualProofDirectory: localDayOneOperation.visualProofDirectory,
        requiredScreenshots: localDayOneOperation.requiredScreenshots,
        remainingLocalBlockers: localDayOneOperation.remainingLocalBlockers,
      },
      productRealityLocalStartScore: {
        overallScore: productRealityLocalStartScore.overallScore,
        status: productRealityLocalStartScore.status,
        summary: productRealityLocalStartScore.summary,
        noPerfectScoreClaim:
          productRealityLocalStartScore.truth.noPerfectScoreClaim,
      },
      finalReport: {
        canStartLocalDayOne: localFinalReport.canStartLocalDayOne,
        complete: localFinalReport.complete.length,
        partial: localFinalReport.partial.length,
        planned: localFinalReport.planned.length,
        blockedByDesign: localFinalReport.blockedByDesign.length,
      },
      whatNotToDo: localFinalReport.blockedByDesign,
      nextSafeActions: localFinalReport.nextSafeActions,
      launchForbiddenReminder: localDayOne.launchForbiddenReminder,
      truth: localDayOne.truth,
    },
    persistentProductMemory: {
      readiness: "safe_local_internal_foundation" as const,
      storage: productMemory.storage,
      domainSummary: productMemory.domainSummary,
      dailySummary: {
        loopStages: productMemoryDailySummary.dailyLoop.totalStages,
        latestLocalDay:
          productMemoryDailySummary.latestLocalDay.dayNumber,
        openProductGaps: productMemoryDailySummary.productGaps.open,
        validationCommands: productMemoryDailySummary.validation.commands,
        suggestedNextTask:
          productMemoryDailySummary.suggestedNextTask.title,
        automaticLaunch:
          productMemoryDailySummary.dailyLoop.automaticLaunch,
      },
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
    founderBuildRoom: {
      readiness: buildRoom.readinessStatus,
      localMode: buildRoom.localMode,
      routeExposure: buildRoom.routeExposure,
      localDayReadiness: buildRoom.localDayReadiness,
      topProductGaps: buildRoom.topProductGaps.length,
      topVisualGaps: buildRoom.topVisualGaps.length,
      codexTaskDrafts: buildRoom.codexTaskDrafts.length,
      constructionQueue: buildRoom.constructionQueueStatus,
      validationCommands: buildRoom.validationStatus.commands.length,
      founderDecisionNeeded: buildRoom.founderDecisionNeeded,
      nextSafeBuildActions: buildRoom.nextSafeBuildActions,
      blockedActions: buildRoom.blockedActions,
      truth: buildRoom.truth,
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
      designMinistry: {
        status: designMinistry.status,
        authorities: designMinistry.authorities.map((authority) => authority.label),
        planIdentities: designMinistry.planIdentities.map((identity) => ({
          label: identity.publicLabel,
          state: identity.state,
          audience: identity.audience,
        })),
        platformExperiences: designMinistry.platformExperiences.length,
        publicLanguageGuarded:
          designMinistry.diagnostics.publicLanguageGuarded,
      },
      livingBrandIntelligence: {
        status: brandIntelligence.snapshot.status,
        genomeConstants: brandIntelligence.genome.constants.length,
        planDNALayers: brandIntelligence.planDNA.length,
        stateLanguageRules: brandIntelligence.stateLanguage.length,
        guardianStatus: brandIntelligence.guardian.status,
        occasionThemes: brandIntelligence.occasionThemes.length,
        surfaceSimulations: brandIntelligence.simulation.simulations.length,
        identityMemoryPreferences:
          brandIntelligence.memory.preferences.length,
        rasterAssetsUsed: brandIntelligence.snapshot.truth.rasterAssetsUsed,
        externalImagesUsed: brandIntelligence.snapshot.truth.externalImagesUsed,
        publicInternalTerminologyLeakAllowed:
          brandIntelligence.snapshot.truth.publicInternalTerminologyLeakAllowed,
      },
      securitySovereignty: {
        status: securitySovereignty.status,
        coreLaw: securitySovereignty.coreLaw,
        authorities: securitySovereignty.authorities.length,
        decisionLevels: securitySovereignty.decisionLevels,
        redTeamReadiness: securitySovereignty.redTeam.status,
        blueTeamReadiness: securitySovereignty.blueTeam.status,
        purpleTeamReadiness: securitySovereignty.purpleTeam.status,
        incidentReadiness: securitySovereignty.incidentResponse.status,
        evidenceReadiness: securitySovereignty.evidenceLedger.status,
        hardeningReadiness: securitySovereignty.hardening.status,
        blockedSampleDecisions: {
          thirdPartyRedTeam:
            securitySovereignty.decisionSamples.thirdPartyRedTeam.decisionLevel,
          secretExposureAttempt:
            securitySovereignty.decisionSamples.secretExposureAttempt.decisionLevel,
          launchAttempt:
            securitySovereignty.decisionSamples.launchAttempt.decisionLevel,
          billingAttempt:
            securitySovereignty.decisionSamples.billingAttempt.decisionLevel,
          liveExecutionAttempt:
            securitySovereignty.decisionSamples.liveExecutionAttempt.decisionLevel,
          realMoneyAttempt:
            securitySovereignty.decisionSamples.realMoneyAttempt.decisionLevel,
          brokerFeedAttempt:
            securitySovereignty.decisionSamples.brokerFeedAttempt.decisionLevel,
          socialPublishingAttempt:
            securitySovereignty.decisionSamples.socialPublishingAttempt.decisionLevel,
          malwareExploitAttempt:
            securitySovereignty.decisionSamples.malwareExploitAttempt.decisionLevel,
          founderCommandPublicAttempt:
            securitySovereignty.decisionSamples.founderCommandPublicAttempt
              .decisionLevel,
        },
        localDefensiveReview:
          securitySovereignty.decisionSamples.localDefensiveReview.decisionLevel,
        productTruth: securitySovereignty.productTruth,
        truth: securitySovereignty.truth,
      },
      secretsAuthority: {
        status: secretsAuthority.status,
        coreRule: secretsAuthority.coreRule,
        categories: secretsAuthority.categories.length,
        supportedStates: secretsAuthority.supportedStates,
        environments: secretsAuthority.environments,
        configuredCount: secretsAuthority.summary.configuredCount,
        blockedCount: secretsAuthority.summary.blockedCount,
        productionForbiddenCount:
          secretsAuthority.summary.productionForbiddenCount,
        rotationRequiredCount: secretsAuthority.summary.rotationRequiredCount,
        rawValuesVisible: secretsAuthority.summary.rawValuesVisible,
        envFilesCommitted: secretsAuthority.summary.envFilesCommitted,
        exposurePolicy: secretsAuthority.exposurePolicy,
        rotationReadiness: secretsAuthority.rotationReadiness,
        founderProtection: founderSecurity.commandProtection,
        truth: founderSecurity.truth,
      },
      essentialIntegrationsTooling: {
        status: toolingReadiness.status,
        prioritySummary: toolingReadiness.essentialIntegrations,
        codex: {
          localCodexCli: toolingReadiness.codexReadiness.localCodexCli,
          codexCloud: toolingReadiness.codexReadiness.codexCloud,
          githubReviewViaCodex:
            toolingReadiness.codexReadiness.githubReviewViaCodex,
          productCanDraftPrompts:
            toolingReadiness.codexReadiness.productCanDraftPrompts,
          productCanSendPromptsAutomatically:
            toolingReadiness.codexReadiness.productCanSendPromptsAutomatically,
          productCanExecuteCodex:
            toolingReadiness.codexReadiness.productCanExecuteCodex,
          productCanExposeSecretsToCodex:
            toolingReadiness.codexReadiness.productCanExposeSecretsToCodex,
        },
        githubReadiness: {
          status: toolingReadiness.githubReadiness.currentStatus,
          safeNextAction: toolingReadiness.githubReadiness.safeNextAction,
        },
        localRuntimeCommands: toolingReadiness.localRuntime.commands.map(
          (command) => ({
            command: command.command,
            executableFromWebApp: command.executableFromWebApp,
          })
        ),
        secretsReadiness: toolingReadiness.secretsReadiness.currentStatus,
        worldInterfaceReadiness:
          toolingReadiness.worldInterfaceReadiness.currentStatus,
        appsPlatformsReadiness:
          toolingReadiness.appsPlatformsReadiness.currentStatus,
        nextSafeSetupActions: toolingReadiness.nextSafeSetupActions,
        whatNotToConnectNow: toolingReadiness.whatNotToConnectNow,
        truth: toolingReadiness.truth,
      },
      sovereignAutonomy: {
        status: "ready",
        operatingMode: sovereignAutonomy.operatingMode,
        ideaIntakeReady: sovereignAutonomy.ideaIntakeReady,
        ideaInboxReady: founderIdeaInbox.status === "ready",
        ideaInbox: {
          status: founderIdeaInbox.status,
          recentIdeaExamples: founderIdeaInbox.recentIdeaExamples.length,
          pendingIdeaDrafts: founderIdeaInbox.pendingIdeaDrafts.length,
          blockedIdeaExamples: founderIdeaInbox.blockedIdeaExamples.length,
          nextSafeIdeaAction: founderIdeaInbox.nextSafeIdeaAction,
          publicNavigationVisible:
            founderIdeaInbox.access.publicNavigationVisible,
          userPlanExposure: founderIdeaInbox.access.userPlanExposure,
          previewPostOnly: founderIdeaInbox.access.previewPostOnly,
          persistenceActive: founderIdeaInbox.access.persistenceActive,
          alkonBridge: founderIdeaInbox.alkonBridge,
          truth: founderIdeaInbox.truth,
        },
        eventSystemReady: sovereignAutonomy.eventSystemReady,
        policyGatesReady: sovereignAutonomy.policyEvaluations.length > 0,
        taskPassportsReady: sovereignAutonomy.taskPassports.filter(
          (passport) => passport.valid
        ).length,
        codexDraftsReady: sovereignAutonomy.codexSubmitReadiness.drafts.length,
        permitDecisions: sovereignAutonomy.codexLicenses.map(
          (license) => license.permitState
        ),
        submitReadiness: {
          defaultMode: sovereignAutonomy.codexSubmitReadiness.defaultMode,
          supportedModes: sovereignAutonomy.codexSubmitReadiness.supportedModes,
          webAppCanExecute:
            sovereignAutonomy.codexSubmitReadiness.truth.webAppShellExecution,
        },
        resultTribunal:
          sovereignAutonomy.tribunalReports[0]?.decision ?? "needs_fix",
        memoryLessons: sovereignAutonomy.memoryLessons.length,
        founderRoom: sovereignAutonomyRoom,
        nextSafeActions: sovereignAutonomy.nextSafeActions,
        whatNotToAutomate: sovereignAutonomy.blockedSystems,
        truth: sovereignAutonomy.truth,
      },
      codexSovereignty: {
        status: codexSovereignty.status,
        mode: codexSovereignty.mode,
        constitutionStatus: codexPresidencyReport.constitutionStatus,
        parliamentReady: codexSovereignty.parliamentReady,
        jurisdictionReady: codexSovereignty.jurisdictionReady,
        taskPassportsReady: codexPresidencyReport.taskPassportsReady,
        executionPermits: codexPresidencyReport.permits,
        blockedTaskCategories: codexPresidencyReport.blockedTaskCategories,
        level3Status: codexPresidencyReport.level3Status,
        resultTribunalStatus: codexPresidencyReport.resultTribunalStatus,
        lessonsLearned: codexPresidencyReport.lessonsLearned,
        tasksWaitingFounderApproval:
          codexPresidencyReport.tasksWaitingFounderApproval,
        autoSubmitEligibleCategories:
          codexPresidencyReport.autoSubmitEligibleCategories,
        promptCompilerReady: codexSovereignty.promptCompilerReady,
        autoSubmitReady: codexSovereignty.autoSubmitReady,
        whatNotToAutomate: codexPresidencyReport.whatNotToAutomate,
        truth: codexSovereignty.truth,
      },
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
      "/api/founder/build-room/readiness",
      "/api/founder/alkon/readiness",
      "/api/founder/alkon-physics/readiness",
      "/api/founder/final-convergence/readiness",
      "/api/founder/final-convergence/snapshot",
      "/api/founder/final-convergence/layers",
      "/api/founder/final-convergence/growth-proposals",
      "/api/earth-reality/status",
      "/api/earth-reality/public-matrix",
      "/api/earth-reality/product-truth",
      "/api/earth-reality/privacy",
      "/api/personal-reality/status",
      "/api/personal-reality/preview",
      "/api/personal-reality/profiles",
      "/api/founder/earth-reality/readiness",
      "/api/founder/personal-reality/readiness",
      "/api/founder/ideas/readiness",
      "/api/founder/ideas/preview",
      "/api/founder/launch-readiness",
      "/api/environment/status",
      "/api/environment/preview",
      "/api/environment/market-session",
      "/api/environment/privacy",
      "/api/founder/environment/readiness",
      "/api/launch-readiness/status",
      "/api/launch-readiness/budget",
      "/api/launch-readiness/waitlist",
      "/api/launch-readiness/legal",
      "/api/launch-readiness/support",
      "/api/launch-readiness/billing",
      "/api/launch-readiness/beta",
      "/api/launch-readiness/gate",
      "/api/invisible-operating-layer/readiness",
      "/api/founder/sovereign-autonomy/readiness",
      "/api/founder/codex-sovereignty/readiness",
      "/api/sovereign-autonomy/status",
      "/api/sovereign-autonomy/founder-ideas",
      "/api/sovereign-autonomy/events",
      "/api/sovereign-autonomy/codex-drafts",
      "/api/codex-sovereignty/status",
      "/api/codex-sovereignty/constitution",
      "/api/codex-sovereignty/passport/sample",
      "/api/codex-sovereignty/permit/sample",
      "/api/codex-sovereignty/tribunal/sample",
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
      "/api/local-ops/day-one",
      "/api/local-ops/start-readiness",
      "/api/local-ops/day-one-operation",
      "/api/local-ops/daily-loop",
      "/api/local-ops/living-day-loop",
      "/api/local-ops/daily-report",
      "/api/local-ops/readiness-law",
      "/api/local-ops/report",
      "/api/local-ops/final-report",
      "/api/local-ops/digital-twin",
      "/api/product-reality/final-score",
      "/api/product-reality/local-start-score",
      "/api/founder/local-day-one/readiness",
      "/api/product-memory/summary",
      "/api/product-memory/founder-acceptance",
      "/api/product-memory/product-gaps",
      "/api/product-memory/local-day",
      "/api/product-memory/daily-summary",
      "/api/product-memory/validation-summary",
      "/api/brand-intelligence/summary",
      "/api/brand-intelligence/simulation",
      "/api/brand-intelligence/guardian",
      "/api/brand-intelligence/occasion-themes",
      "/api/founder/secrets/readiness",
      "/api/founder/security/readiness",
      "/api/founder/tooling/readiness",
      "/api/integrations/readiness",
      "/api/integrations/registry",
      "/api/integrations/account-provisioning",
      "/api/world-interface/readiness",
      "/api/world-interface/channels",
      "/api/world-interface/quarantine/readiness",
      "/api/founder/world-interface/readiness",
      "/api/academy/readiness",
      "/api/community/readiness",
      "/api/vip-rooms/readiness",
      "/api/media-office/readiness",
      "/api/ai-video-studio/readiness",
      "/api/content-review/readiness",
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
