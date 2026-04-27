import type {
  ActivationGate,
  AlkonOneNextAction,
  AlkonOperatingModeOptions,
  ZeroTruthAudit,
} from "./types";
import { getAlkonActivationGates } from "./activation-gates";
import { getZeroTruthAudit } from "./zero-truth-audit";

function action(input: AlkonOneNextAction): AlkonOneNextAction {
  return input;
}

function founderRequest(
  needed: boolean,
  requestedDecision: string,
  acceptableAnswers: string[],
  sensitiveAction = false
) {
  return {
    requestId: needed ? "ahmad_decision_required" : "no_founder_decision_now",
    needed,
    requestedDecision,
    acceptableAnswers,
    sensitiveAction,
    finalAuthority: "Ahmad" as const,
  };
}

export function getAlkonOneNextAction(
  checkedAt = new Date().toISOString(),
  options: AlkonOperatingModeOptions = {},
  audit: ZeroTruthAudit = getZeroTruthAudit(checkedAt, options),
  gates: ActivationGate[] = getAlkonActivationGates(checkedAt, options, audit)
): AlkonOneNextAction {
  const blockingGate = gates.find(
    (item) => item.blocksActivation && item.outcome === "blocked"
  );

  if (blockingGate || audit.blockers.length > 0) {
    return action({
      actionId: "fix_p0_truth_security_build_or_public_leak",
      oneNextAction:
        blockingGate?.nextAction ??
        "Fix the P0 truth, security, build, Git, or public leak blocker.",
      whyThisNow:
        "Alkon cannot activate while Product Truth, public/private boundary, validation, Git, or security evidence is blocked.",
      delayedActions: [
        "Ahmad visual acceptance",
        "Final Universal Closure",
        "Local Day One",
        "future worlds",
      ],
      blockedActions: [
        "public launch",
        "billing",
        "broker/feed",
        "live execution",
        "real money",
        "public Alkon exposure",
      ],
      founderDecisionNeeded: false,
      founderDecisionRequest: founderRequest(
        false,
        "No Founder choice is requested until the P0 blocker is fixed.",
        ["fix_blocker"]
      ),
    });
  }

  if (options.currentVisualCommandRunning) {
    return action({
      actionId: "wait_for_wake_report",
      oneNextAction: "Wait for the current visual/workspace command Wake Report.",
      whyThisNow:
        "Alkon should not choose a new direction while evidence from the active command is incomplete.",
      delayedActions: ["visual acceptance", "Final Universal Closure", "Local Day One"],
      blockedActions: ["new depth work", "future worlds", "launch work"],
      founderDecisionNeeded: false,
      founderDecisionRequest: founderRequest(
        false,
        "Wait for evidence before asking Ahmad for a decision.",
        ["wait"]
      ),
    });
  }

  const visualState = options.visualAcceptance ?? "pending";

  if (visualState === "pending") {
    return action({
      actionId: "ask_ahmad_visual_review",
      oneNextAction:
        "Ask Ahmad to visually accept or reject the latest Pro Max public and Trading Workspace baseline.",
      whyThisNow:
        "Product Truth and private boundary are preserved, but Local Day One cannot start without Ahmad visual acceptance.",
      delayedActions: ["Final Universal Closure", "Local Day One", "future worlds"],
      blockedActions: [
        "billing",
        "broker/feed",
        "live execution",
        "real money",
        "public launch",
        "public Alkon exposure",
      ],
      founderDecisionNeeded: true,
      founderDecisionRequest: founderRequest(
        true,
        "Accept the visual baseline, reject it with focused notes, or request one narrow correction.",
        ["accept", "reject_with_notes", "focused_correction"],
        true
      ),
    });
  }

  if (visualState === "rejected") {
    return action({
      actionId: "create_focused_visual_correction",
      oneNextAction:
        "Create one focused visual correction command based on Ahmad's rejection notes.",
      whyThisNow:
        "A rejected visual gate should be corrected narrowly before closure or Local Day One.",
      delayedActions: ["Final Universal Closure", "Local Day One", "future worlds"],
      blockedActions: [
        "broad new worlds",
        "billing",
        "broker/feed",
        "live execution",
        "real money",
        "public launch",
      ],
      founderDecisionNeeded: true,
      founderDecisionRequest: founderRequest(
        true,
        "Provide the focused visual rejection notes to correct.",
        ["provide_notes", "pause"],
        true
      ),
    });
  }

  if (!options.finalUniversalClosurePassed) {
    return action({
      actionId: "final_universal_closure",
      oneNextAction: "Run Final Universal Closure with Product Truth preserved.",
      whyThisNow:
        "Ahmad visual acceptance is available and no P0/P1 blocker is present; closure is the next gated step before Local Day One.",
      delayedActions: ["Local Day One", "future worlds", "launch work"],
      blockedActions: [
        "billing",
        "broker/feed",
        "live execution",
        "real money",
        "public launch",
      ],
      founderDecisionNeeded: false,
      founderDecisionRequest: founderRequest(
        false,
        "No new Founder decision is needed if visual acceptance is already recorded.",
        ["run_closure"]
      ),
    });
  }

  if (!options.localDayOneStarted) {
    return action({
      actionId: "start_local_day_one",
      oneNextAction: "Start closed Local Day One review.",
      whyThisNow:
        "Final Universal Closure has passed; Local Day One is the next safe closed-local review step.",
      delayedActions: ["public launch", "billing", "broker/feed", "production"],
      blockedActions: ["live execution", "real money", "public launch"],
      founderDecisionNeeded: true,
      founderDecisionRequest: founderRequest(
        true,
        "Confirm closed Local Day One start.",
        ["start_local_day_one", "delay"],
        true
      ),
    });
  }

  return action({
    actionId: "continue_daily_operating_loop",
    oneNextAction: "Continue the Alkon Daily Operating Loop.",
    whyThisNow:
      "Local Day One is already active; Alkon should keep reading reality, detecting drift, and returning one next safe action.",
    delayedActions: ["future worlds until Station 1 closes"],
    blockedActions: ["billing", "broker/feed", "live execution", "real money"],
    founderDecisionNeeded: false,
    founderDecisionRequest: founderRequest(
      false,
      "Continue operating loop.",
      ["continue_loop"]
    ),
  });
}
