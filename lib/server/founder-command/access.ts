import "server-only";

import type {
  FounderLocalCommandAccessSnapshot,
  FounderLocalCommandAccessState,
} from "./types";

const accessStates: FounderLocalCommandAccessState[] = [
  "not_configured",
  "local_owner_ready",
  "owner_auth_required",
  "device_trust_planned",
  "step_up_required_later",
  "approval_execution_disabled",
  "blocked_public_access",
];

export function getFounderLocalCommandAccessSnapshot(
  checkedAt = new Date().toISOString()
): FounderLocalCommandAccessSnapshot {
  return {
    checkedAt,
    mode: "founder_local_command_access",
    currentState: "owner_auth_required",
    states: accessStates,
    ownerOnly: true,
    localOnly: true,
    publicRouteExposed: false,
    publicNavigationVisible: false,
    userPlanAccess: false,
    freeProVipInstitutionalAccess: false,
    readOnlyDefault: true,
    routeExposure: "disabled_until_guarded",
    deviceTrust: "planned",
    stepUpConfirmation: "planned",
    approvalExecution: "disabled",
    secretsVisible: false,
  };
}
