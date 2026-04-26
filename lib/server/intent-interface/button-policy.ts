import {
  getAssistantIntentActions,
  getBlockedIntentActions,
  getContextButtonActions,
  getCoreButtonActions,
  getIntentActionCatalog,
} from "./action-classifier";
import type {
  ButtonPolicyResult,
  ContextAction,
  IntentActionDefinition,
  IntentActionId,
} from "./types";

const duplicateControlActions = new Set<IntentActionId>([
  "explain_billing_inactive",
  "explain_live_inactive",
  "explain_paper_safe",
]);

const essentialContextButtons = new Set<ContextAction>([
  "buy_paper",
  "sell_paper",
  "ai_wait",
  "why_blocked",
  "save_journal_note",
  "open_coach",
  "reset_chart",
  "open_assistant",
  "switch_timeframe",
  "change_symbol",
]);

export function decideButtonPolicy(
  action: IntentActionDefinition
): ButtonPolicyResult {
  if (duplicateControlActions.has(action.actionId)) {
    return {
      actionId: action.actionId,
      decision: "assistant_intent_only",
      reason:
        "Repeated truth explanations belong in Pro Max Assistant and compact Diagnostics rather than duplicate buttons.",
      buttonAllowed: false,
      assistantPreferred: true,
    };
  }

  if (action.type === "core_action") {
    return {
      actionId: action.actionId,
      decision: "keep_as_button",
      reason:
        "Core navigation and sign-in are faster as visible buttons than typed intent.",
      buttonAllowed: true,
      assistantPreferred: false,
    };
  }

  if (action.type === "context_action") {
    const actionId = action.actionId as ContextAction;

    return {
      actionId: action.actionId,
      decision: essentialContextButtons.has(actionId)
        ? "contextual_button_only"
        : "assistant_intent_only",
      reason: essentialContextButtons.has(actionId)
        ? "The action is immediate in its context and must stay close to the task."
        : "The action is secondary and should be requested through Pro Max Assistant.",
      buttonAllowed: essentialContextButtons.has(actionId),
      assistantPreferred: !essentialContextButtons.has(actionId),
    };
  }

  if (action.type === "assistant_intent") {
    return {
      actionId: action.actionId,
      decision: "assistant_intent_only",
      reason:
        "This is a secondary or explanatory user intent that Pro Max Assistant should translate.",
      buttonAllowed: false,
      assistantPreferred: true,
    };
  }

  return {
    actionId: action.actionId,
    decision: "blocked",
    reason:
      "The request is blocked by Product Truth, safety, privacy, or public/private boundaries.",
    buttonAllowed: false,
    assistantPreferred: true,
  };
}

export function getButtonPolicyResults() {
  return getIntentActionCatalog().map(decideButtonPolicy);
}

export function getButtonPolicySummary() {
  const policies = getButtonPolicyResults();

  return {
    coreButtons: getCoreButtonActions().map((action) => action.actionId),
    contextualButtons: getContextButtonActions()
      .filter((action) => decideButtonPolicy(action).buttonAllowed)
      .map((action) => action.actionId),
    assistantIntents: getAssistantIntentActions().map((action) => action.actionId),
    blockedIntents: getBlockedIntentActions().map((action) => action.actionId),
    duplicateControlsRemoved: policies
      .filter((policy) => policy.decision === "assistant_intent_only")
      .map((policy) => policy.actionId)
      .filter((actionId) => duplicateControlActions.has(actionId)),
    policy:
      "Buttons stay for immediate essential actions. Pro Max Assistant owns secondary explanation, comfort, plan, support, and Personal Reality intents.",
  };
}
