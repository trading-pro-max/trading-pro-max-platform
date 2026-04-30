import "server-only";

import { getAlKawnInfinityPreparation } from "./infinity-preparation";
import { getInfinityBlockedActions } from "./infinity-blocked-actions";
import { getInfinityCycleLedger } from "./infinity-cycle-ledger";
import { getInfinityCycleState } from "./infinity-cycle-state";
import { getInfinitySafeAutomation } from "./infinity-safe-automation";
import type {
  InfinityControlledActivation,
  InfinityControlledNextAction,
  InfinityCycleTriggerRule,
} from "./types";

export function getInfinityCycleTriggerRules(): InfinityCycleTriggerRule[] {
  return [
    {
      id: "manual_safe_trigger",
      label: "Manual safe trigger",
      rule: "A controlled cycle may run after Ahmad opens the private desktop flow or approves a safe internal trigger.",
      allowed: true,
    },
    {
      id: "daily_loop_trigger",
      label: "Daily Work Loop trigger",
      rule: "Daily Work Loop may feed one selected internal work item into the controlled cycle.",
      allowed: true,
    },
    {
      id: "daemon_block",
      label: "Background daemon block",
      rule: "No background daemon.",
      allowed: false,
    },
    {
      id: "uncontrolled_loop_block",
      label: "Uncontrolled loop block",
      rule: "No uncontrolled infinite loop.",
      allowed: false,
    },
    {
      id: "external_action_block",
      label: "External action block",
      rule: "No public, money, broker, legal, or external automation.",
      allowed: false,
    },
  ];
}

export function getInfinityControlledNextAction(): InfinityControlledNextAction {
  return {
    next: "Operator Mode preparation",
    reason:
      "Infinity controlled activation is closed for private internal cycles, so the next safe phase is preparing Operator Mode to work for Ahmad internally without public, money, broker, legal, or external actions.",
    blockedUntil: [
      "Operator permissions are defined.",
      "Operator blocked actions are visible.",
      "Product Truth overrides operator actions.",
      "Legal and Money gates remain Ahmad stops.",
    ],
  };
}

export function getInfinityControlledActivation(): InfinityControlledActivation {
  const preparation = getAlKawnInfinityPreparation();

  return {
    id: "infinity_controlled_activation",
    title: "Infinity Mode controlled activation",
    status:
      preparation.state === "closed_ready_for_controlled_activation"
        ? "closed_controlled_internal_active"
        : "blocked_prerequisite_missing",
    summary:
      "Infinity Mode is active only for private internal cycles. It is not public operation, not a daemon, not an uncontrolled loop, and not external automation.",
    requiredWording: [
      "Infinity Mode controlled activation",
      "Infinity Mode is active only for private internal cycles.",
      "No uncontrolled infinite loop.",
      "No background daemon.",
      "Safe internal cycles only.",
      "Legal and Money gates stop execution for Ahmad.",
    ],
    cycleState: getInfinityCycleState(),
    triggerRules: getInfinityCycleTriggerRules(),
    ledger: getInfinityCycleLedger(),
    allowed: getInfinitySafeAutomation(),
    blocked: getInfinityBlockedActions(),
    productTruth: [
      "Product Truth controls every cycle.",
      "Public launch blocked.",
      "Billing inactive.",
      "Payments inactive.",
      "Receiving money inactive.",
      "Real money disabled.",
      "Broker execution disabled/not connected.",
      "Legal review pending.",
      "No public, money, broker, legal, or external automation.",
    ],
    nextAction: getInfinityControlledNextAction(),
  };
}
