import "server-only";

import { getInfinityBlockedActions } from "./infinity-blocked-actions";
import { getInfinityBoundaries } from "./infinity-boundaries";
import { getInfinityCyclePlan } from "./infinity-cycle-plan";
import { getInfinityNextAction } from "./infinity-next-action";
import { getInfinityReadiness } from "./infinity-readiness";
import { getInfinitySafeAutomation } from "./infinity-safe-automation";
import type { AlKawnInfinityPreparation } from "./types";

export function getAlKawnInfinityPreparation(): AlKawnInfinityPreparation {
  return {
    id: "al_kawn_infinity_preparation",
    title: "Infinity Mode preparation",
    state: "ready_with_notes",
    summary:
      "Infinity Mode preparation defines private internal continuous readiness without fully activating autonomous live operation, public launch, money, broker, legal, or external automation.",
    requiredWording: [
      "Infinity Mode preparation",
      "Infinity Mode is private internal continuous readiness.",
      "Infinity Mode is not fully active yet.",
      "Daily Work Loop feeds Infinity preparation.",
      "Product Truth controls every cycle.",
      "Legal and Money gates stop execution for Ahmad.",
      "No uncontrolled infinite loop.",
      "No public, money, broker, legal, or external automation.",
    ],
    readiness: getInfinityReadiness(),
    cyclePlan: getInfinityCyclePlan(),
    boundaries: getInfinityBoundaries(),
    safeAutomation: getInfinitySafeAutomation(),
    blockedActions: getInfinityBlockedActions(),
    dailyLoopConnection: [
      "Daily Work Loop feeds Infinity preparation.",
      "Infinity preparation extends the daily loop without bypassing it.",
      "Infinity uses daily selected work, blockers, memory snapshot, and one next action.",
      "One next action remains enforced.",
    ],
    productTruth: [
      "Product Truth controls every cycle.",
      "Public launch blocked.",
      "Billing inactive.",
      "Payments inactive.",
      "Receiving money inactive.",
      "Real money disabled.",
      "Broker execution disabled/not connected.",
      "Legal review pending.",
      "Al-Kawn remains private to Ahmad devices.",
      "ALKON remains private/background.",
    ],
    kernelStatus:
      "Universe Operating Kernel checked; it remains the execution judge for every Infinity preparation cycle.",
    nextAction: getInfinityNextAction(),
  };
}
