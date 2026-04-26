import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";
import {
  getFounderPersonalRealityProfiles,
  getPublicPersonalRealityProfiles,
  getPublicPersonalRealitySettings,
} from "./registry";
import type { PersonalRealityReadinessSnapshot } from "./types";

export function getPersonalRealityReadinessSnapshot(
  checkedAt = new Date().toISOString()
): PersonalRealityReadinessSnapshot {
  const publicProfiles = getPublicPersonalRealityProfiles();
  const publicSettings = getPublicPersonalRealitySettings();

  return {
    checkedAt,
    mode: "personal_reality_readiness",
    status: "ready_with_notes",
    publicProfiles,
    publicSettings,
    internalProfilesHidden:
      getFounderPersonalRealityProfiles().length - publicProfiles.length,
    freeControls: publicSettings
      .filter((setting) => setting.availability === "active")
      .map((setting) => setting.name),
    plannedControls: publicSettings
      .filter((setting) => setting.availability === "planned")
      .map((setting) => setting.name),
    futureControls: publicSettings
      .filter((setting) => setting.availability === "future")
      .map((setting) => setting.name),
    blockedControls: publicSettings
      .filter((setting) => setting.availability === "blocked")
      .map((setting) => setting.name),
    assistantControlled: true,
    planAware: true,
    productTruthGuarded: true,
    publicPrivateBoundaryStatus: "preserved",
    diagnosticsSummary: {
      label: "Personal Reality",
      copy:
        "TPM Assistant can preview and explain allowed experience changes. Free controls are active; Pro/VIP/Institutional controls remain planned, locked, or future unless entitlement exists.",
    },
  };
}

export function getPersonalRealityDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getPersonalRealityReadinessSnapshot(checkedAt);

  return {
    key: "personal_reality",
    label: "Personal Reality readiness",
    status: "ready",
    summary: "Assistant-controlled plan-aware experience controls ready",
    detail:
      `${snapshot.freeControls.length} active Free controls, ${snapshot.plannedControls.length} planned Pro/VIP controls, and ${snapshot.futureControls.length} future Institutional controls are modeled. Product Truth and public/private boundaries are preserved.`,
    checkedAt,
  };
}
