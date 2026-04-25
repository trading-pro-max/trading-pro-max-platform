import "server-only";

import { getConstructionQueueSnapshot } from "@/lib/server/codex-construction";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import { getLocalOperationsReadinessSnapshot } from "@/lib/server/local-ops";
import { getProductTruthSnapshot } from "@/lib/server/product";
import {
  getProductMemorySummarySnapshot,
  getProductGapMemorySnapshot,
  getValidationSummaryMemorySnapshot,
} from "@/lib/server/product-memory";
import { getFounderLocalCommandAccessSnapshot } from "./access";
import { getFounderCommandAppSnapshot } from "./command-app";

export function getFounderLocalCommandSnapshot(
  checkedAt = new Date().toISOString()
) {
  const commandApp = getFounderCommandAppSnapshot(checkedAt);
  const access = getFounderLocalCommandAccessSnapshot(checkedAt);
  const localOps = getLocalOperationsReadinessSnapshot(checkedAt);
  const productMemory = getProductMemorySummarySnapshot(checkedAt);
  const productGaps = getProductGapMemorySnapshot(checkedAt);
  const validationSummary = getValidationSummaryMemorySnapshot(checkedAt);
  const constructionQueue = getConstructionQueueSnapshot(checkedAt);
  const journalCoach = getJournalCoachSnapshot(checkedAt);
  const productTruth = getProductTruthSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_local_command_app_shell" as const,
    access,
    routeExposure: {
      apiSnapshotAdded: true,
      apiReadinessAdded: true,
      previewRouteCreated: false,
      publicNavigationVisible: false,
      userPlanExposure: false,
      reason:
        "The local command shell remains reusable and API-readable only until owner authentication, device trust, and step-up confirmation are implemented.",
    },
    localCommandStatus: {
      state: "read_only_local_foundation" as const,
      localOnly: true,
      ownerOnly: true,
      approvalExecutionActive: false,
      nativeDesktopShellShipped: false,
      nativeMobileShellShipped: false,
      publicRouteExposed: false,
    },
    dailyBriefing: {
      priority: commandApp.companionBrain.founderCompanion.priorityBriefing,
      risks: commandApp.companionBrain.founderCompanion.riskSummary,
      approvals: commandApp.companionBrain.founderCompanion.approvalsSummary,
      productGaps: commandApp.companionBrain.founderCompanion.productGapSummary,
      visualGaps: commandApp.companionBrain.founderCompanion.visualGapSummary,
      guardianLegal: [
        ...commandApp.companionBrain.founderCompanion.guardianSummary,
        ...commandApp.companionBrain.founderCompanion.legalSummary,
      ],
    },
    localOperations: {
      readiness: commandApp.localUniverseOperations.readiness,
      doctrine: localOps.doctrine,
      dayCycle: localOps.dayCycle,
      readinessLaw: localOps.readinessLaw,
      report: localOps.report,
      nextSafeLocalActions: commandApp.localUniverseOperations.nextSafeLocalActions,
      launchForbiddenReminder:
        commandApp.localUniverseOperations.launchForbiddenReminder,
    },
    productMemory: {
      storage: productMemory.storage,
      domainSummary: productMemory.domainSummary,
      founderSummary: productMemory.founderSummary,
      truth: productMemory.truth,
    },
    productGaps: {
      summary: productGaps.summary,
      gaps: productGaps.gaps,
      truth: productGaps.truth,
    },
    validation: {
      commandStatuses: validationSummary.commandStatuses,
      storagePolicy: validationSummary.storagePolicy,
      truth: validationSummary.truth,
      humanAhmadAcceptanceRequired: true,
    },
    constructionQueue: {
      summary: constructionQueue.summary,
      items: constructionQueue.items,
      truth: constructionQueue.truth,
      whatNotToSendToCodex:
        commandApp.autonomousConstructionIntelligence.whatNotToSendToCodex,
      nextSafeConstructionActions:
        commandApp.autonomousConstructionIntelligence.nextSafeConstructionActions,
    },
    readiness: {
      constructionIntelligence:
        commandApp.autonomousConstructionIntelligence.readiness,
      productTruth: productTruth.summary,
      planReadiness: commandApp.treasuryCommand.planReadiness,
      planTruth: commandApp.treasuryCommand.planTruth,
      assistant: {
        publicAssistant: "TPM Assistant",
        founderCompanionMode: commandApp.companionBrain.founderCompanion.mode,
        canApproveAlone: commandApp.companionBrain.canApproveAlone,
        canOverrideBlocks: commandApp.companionBrain.canOverrideBlocks,
      },
      journalCoach: {
        planAccess: journalCoach.planAccess,
        memoryFoundation: journalCoach.memoryFoundation,
        safety: journalCoach.safety,
      },
      qualityVisual: commandApp.engineeringOpsQuality.visualAcceptance,
      ops: commandApp.engineeringOpsQuality.opsHealth,
    },
    treasuryMedia: {
      treasury: commandApp.treasuryCommand,
      media: commandApp.mediaCommand,
      communityVip: commandApp.communityVipGrowth,
      billingInactive: true,
      performanceFeeHiddenInactive: true,
      socialPublishingInactive: true,
      fakePartnershipClaimsAllowed: false,
      swissLegalCompanyClaimAllowed: false,
      islamicShariaCertificationClaimAllowed: false,
    },
    guardianLegal: commandApp.guardianLegal,
    whatNotToDoToday: commandApp.whatNotToDoToday,
    nextSafeActions: [
      ...commandApp.nextSafeActions,
      ...commandApp.localUniverseOperations.nextSafeLocalActions,
    ],
    safety: {
      ...commandApp.safety,
      localCommandApprovalExecution: false,
      hiddenFromNormalUsers: true,
      noPublicNavigation: true,
      noUserPlanExposure: true,
    },
    truth: {
      noSecrets: true,
      noPrivateUserData: true,
      noFakeUsers: true,
      noFakeRevenue: true,
      noFakeMetrics: true,
      liveExecution: "blocked" as const,
      realMoneyRouting: "blocked" as const,
      brokerFeedActivation: "blocked" as const,
      billing: "inactive" as const,
      publicLaunch: "inactive" as const,
      socialPublishing: "inactive" as const,
      approvalExecution: "disabled" as const,
      externalAutomation: "not_enabled" as const,
    },
  };
}

export function getFounderLocalCommandReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getFounderLocalCommandSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_local_command_readiness" as const,
    access: snapshot.access,
    localCommandStatus: snapshot.localCommandStatus,
    routeExposure: snapshot.routeExposure,
    summaries: {
      localDayStages: snapshot.localOperations.dayCycle.totalStages,
      memoryDomains: snapshot.productMemory.domainSummary.length,
      openProductGaps: snapshot.productGaps.summary.open,
      constructionQueueItems: snapshot.constructionQueue.summary.total,
      validationCommands: snapshot.validation.commandStatuses.length,
      nextSafeActions: snapshot.nextSafeActions.length,
      whatNotToDoToday: snapshot.whatNotToDoToday.length,
    },
    safety: snapshot.safety,
    truth: snapshot.truth,
  };
}

export type FounderLocalCommandSnapshot = ReturnType<
  typeof getFounderLocalCommandSnapshot
>;

export type FounderLocalCommandReadinessSnapshot = ReturnType<
  typeof getFounderLocalCommandReadinessSnapshot
>;
