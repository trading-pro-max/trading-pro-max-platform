import type {
  AlkonActionPreparation,
  AlkonGravityDecision,
  AlkonLawDecision,
  AlkonRouteDecision,
  AlkonSignal,
} from "./types";

export function prepareAlkonAction(
  signal: AlkonSignal,
  law: AlkonLawDecision,
  gravity: AlkonGravityDecision,
  route: AlkonRouteDecision
): AlkonActionPreparation {
  const blocked =
    law.outcome === "black_hole" ||
    law.outcome === "blocked" ||
    gravity.priority === "black_hole" ||
    gravity.priority === "blocked";
  const needsTask =
    !blocked &&
    ["P0_critical", "P1_high"].includes(gravity.priority) &&
    gravity.allowedNextAction !== "report_only";
  const needsCodexDraft =
    needsTask &&
    ["Codex Construction", "Shell / Navigation", "Trading Workspace", "Visual Identity"].includes(
      route.ownerSystem
    );

  return {
    signalId: signal.signalId,
    actionType: blocked ? "block" : gravity.allowedNextAction,
    taskPassportNeeded: needsTask,
    codexDraftNeeded: needsCodexDraft,
    validationNeeded: !blocked,
    founderReviewNeeded:
      law.outcome === "founder_approval_required" ||
      gravity.priority === "P0_critical" ||
      needsCodexDraft,
    legalGuardianReviewNeeded:
      law.requiredReviews.some((review) => /legal|guardian/i.test(review)) ||
      law.outcome === "quarantined",
    blockedReason: blocked ? law.blockedReason ?? gravity.explanation : null,
    nextSafeAction: blocked
      ? law.safeAlternative
      : needsTask
        ? `Prepare a Task Passport for ${route.ownerSystem} with validation and Result Tribunal review.`
        : `Report ${signal.title} to ${route.reportTarget} and update memory if repeated.`,
    webAppMayExecute: false,
    directCodexCallAllowed: false,
    externalCallAllowed: false,
    secretsAllowed: false,
  };
}

export function prepareAlkonActions(
  signals: AlkonSignal[],
  laws: AlkonLawDecision[],
  gravities: AlkonGravityDecision[],
  routes: AlkonRouteDecision[]
) {
  return signals.map((signal) => {
    const law = laws.find((item) => item.signalId === signal.signalId);
    const gravity = gravities.find((item) => item.signalId === signal.signalId);
    const route = routes.find((item) => item.signalId === signal.signalId);

    if (!law || !gravity || !route) {
      throw new Error(`Missing action context for signal ${signal.signalId}.`);
    }

    return prepareAlkonAction(signal, law, gravity, route);
  });
}
