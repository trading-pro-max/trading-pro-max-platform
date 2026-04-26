import "server-only";

import { getSovereignAutonomyReadinessSnapshot } from "./state";

export function getFounderSovereignAutonomyRoomSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getSovereignAutonomyReadinessSnapshot(checkedAt);
  const blockedEvents = snapshot.sampleEvents.filter(
    (event) => event.status === "blocked"
  );
  const waitingReview = snapshot.sampleEvents.filter(
    (event) => event.status === "waiting_review"
  );
  const waitingFounder = snapshot.sampleEvents.filter(
    (event) => event.status === "waiting_founder"
  );
  const validPassports = snapshot.taskPassports.filter(
    (passport) => passport.valid
  );
  const permittedLicenses = snapshot.codexLicenses.filter(
    (license) => license.permitted
  );

  return {
    checkedAt,
    mode: "founder_sovereign_autonomy_room" as const,
    access: {
      ownerOnly: true,
      publicNavigationVisible: false,
      userPlanExposure: false,
      readOnly: true,
      approvalExecutionActive: false,
      secretsVisible: false,
    },
    status: {
      operatingMode: snapshot.operatingMode,
      ideaIntakeReady: snapshot.ideaIntakeReady,
      eventSystemReady: snapshot.eventSystemReady,
      codexDraftingReady: snapshot.codexDraftingReady,
      founderCommandReady: snapshot.founderCommandReady,
      publicPrivateBoundary: "protected",
      productTruth: "preserved",
    },
    incomingFounderIdeas: snapshot.sampleFounderIdeas,
    eventQueueSummary: {
      total: snapshot.sampleEvents.length,
      blocked: blockedEvents.length,
      waitingReview: waitingReview.length,
      waitingFounder: waitingFounder.length,
      draftReady: snapshot.sampleEvents.filter(
        (event) => event.status === "draft_ready"
      ).length,
    },
    blockedEvents,
    tasksWaitingReview: waitingReview,
    tasksWaitingFounderApproval: waitingFounder,
    taskPassportsReady: validPassports,
    codexDraftsReady: snapshot.codexSubmitReadiness.drafts,
    permitDecisions: snapshot.codexLicenses,
    resultTribunalOutcomes: snapshot.tribunalReports,
    memoryLessons: snapshot.memoryLessons,
    alkonBridge: {
      universeName: "Alkon",
      arabicName: "الكون",
      orbitCommand: {
        incomingIdeas: snapshot.sampleFounderIdeas.length,
        classifiedEvents: snapshot.sampleEvents.length,
        blockedEvents: blockedEvents.length,
        waitingReview: waitingReview.length,
      },
      constructionUniverse: {
        validPassports: validPassports.length,
        manualDrafts: snapshot.codexSubmitReadiness.drafts.length,
        permittedLicenses: permittedLicenses.length,
        webAppExecution: false,
      },
      resultTribunal: {
        reports: snapshot.tribunalReports.length,
        latestDecision: snapshot.tribunalReports[0]?.decision ?? "needs_fix",
      },
      memoryUniverse: {
        lessons: snapshot.memoryLessons.length,
        secretsStored: false,
        privateSensitiveDataStored: false,
      },
      publicVisible: false,
      nextAction:
        "Keep Alkon as the private command universe that reviews ideas, events, passports, drafts, tribunal outcomes, and lessons without executing actions.",
    },
    nextSafeAction: snapshot.nextSafeActions[0],
    whatNotToAutomate: snapshot.blockedSystems,
    productTruth: snapshot.truth,
    publicPrivateBoundaryStatus:
      "normal users do not receive Founder Command, governance, Codex draft, secrets authority, or Product Memory internals",
  };
}
