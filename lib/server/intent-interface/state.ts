import {
  getAssistantIntentActions,
  getBlockedIntentActions,
  getCoreButtonActions,
  getContextButtonActions,
} from "./action-classifier";
import { getButtonPolicySummary } from "./button-policy";
import { getPrivateIntentRegistry, getPublicIntentRegistry } from "./intent-registry";
import type {
  IntentInterfaceDiagnosticsProbe,
  IntentInterfaceReadinessSnapshot,
} from "./types";

export function getIntentInterfaceReadinessSnapshot(
  checkedAt = new Date().toISOString()
): IntentInterfaceReadinessSnapshot {
  const policy = getButtonPolicySummary();
  const publicIntents = getPublicIntentRegistry();
  const privateIntents = getPrivateIntentRegistry();

  return {
    checkedAt,
    mode: "human_intent_operating_system",
    status: "ready_with_notes",
    coreButtonsKept: getCoreButtonActions().map((action) => action.actionId),
    contextualButtons: getContextButtonActions()
      .filter((action) => policy.contextualButtons.includes(action.actionId))
      .map((action) => action.actionId),
    assistantIntents: getAssistantIntentActions().map((action) => action.actionId),
    blockedIntents: getBlockedIntentActions().map((action) => action.actionId),
    publicIntentCount: publicIntents.length,
    privateIntentCount: privateIntents.length,
    privateIntentsPubliclyAvailable: false,
    duplicateControlPolicy: "remove_duplicate",
    productTruthPreserved: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedBillingInactive: true,
      publicLaunchInactive: true,
      noFakePlanActivation: true,
      alkonHiddenPublicly: true,
    },
    publicCopy:
      "Tell TPM Assistant what you want to do. Essential actions stay as buttons; secondary requests become safe explanations, settings, or alternatives.",
    diagnosticsSummary: {
      label: "Intent interface readiness",
      copy:
        "Assistant-first intent routing is ready with core buttons, contextual paper actions, blocked unsafe intents, and no public private-command exposure.",
    },
  };
}

export function getIntentInterfaceDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): IntentInterfaceDiagnosticsProbe {
  const snapshot = getIntentInterfaceReadinessSnapshot(checkedAt);

  return {
    key: "intent_driven_interface",
    label: "Intent-driven interface",
    status: "ready",
    summary: "Assistant-first intent interface ready",
    detail:
      `${snapshot.coreButtonsKept.length} core buttons remain, ${snapshot.contextualButtons.length} contextual buttons stay task-local, ${snapshot.assistantIntents.length} secondary intents route through TPM Assistant, and ${snapshot.blockedIntents.length} unsafe intents are blocked.`,
    checkedAt,
  };
}
