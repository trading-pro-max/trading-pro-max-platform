import "server-only";

import { getInfinityControlledActivation } from "@/lib/server/universe/infinity";
import { getOperatorBlockedActions } from "./operator-blocked-actions";
import { getOperatorNextAction } from "./operator-next-action";
import { getOperatorPermissions } from "./operator-permissions";
import { getOperatorReadiness } from "./operator-readiness";
import { getOperatorWorkQueue } from "./operator-work-queue";
import type { AlKawnOperatorPreparation } from "./types";

export function getAlKawnOperatorPreparation(): AlKawnOperatorPreparation {
  const infinity = getInfinityControlledActivation();
  const status =
    infinity.status === "closed_controlled_internal_active"
      ? "closed_ready_for_operator_activation"
      : "blocked_prerequisite_missing";

  return {
    id: "al_kawn_operator_preparation",
    title: "Operator Mode preparation",
    status,
    summary:
      "Operator Mode prepares الكون to work for Ahmad internally through Daily Work Loop and Infinity, while Product Truth, legal stops, money stops, security blocks, and privacy boundaries remain enforced.",
    requiredWording: [
      "Operator Mode preparation",
      "Operator Mode prepares الكون to work for Ahmad internally.",
      "Operator Mode is not fully active yet.",
      "Infinity feeds Operator preparation.",
      "Legal and Money gates stop execution for Ahmad.",
      "Product Truth overrides operator actions.",
    ],
    readiness: getOperatorReadiness(),
    permissions: getOperatorPermissions(),
    workQueue: getOperatorWorkQueue(),
    blockedActions: getOperatorBlockedActions(),
    reportingToAhmad: [
      "Operator reports what it did internally.",
      "Operator reports what it needs from Ahmad.",
      "Operator reports Legal and Money stops.",
      "Operator reports Product Truth blocks.",
      "Operator keeps one next action visible.",
    ],
    nextAction: getOperatorNextAction(),
  };
}
