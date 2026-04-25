import "server-only";

import { getFounderCommandAppSnapshot } from "./command-app";

export function getFounderKingCommandAppShellSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getFounderCommandAppSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_king_command_app_shell_foundation",
    ownerOnly: snapshot.access.ownerOnly,
    publicRouteExposed: snapshot.access.publicRouteExposed,
    readOnlyDefault: snapshot.access.readOnlyDefault,
    desktopApp: snapshot.desktopApp,
    mobileApp: snapshot.mobileApp,
    moduleSummary: snapshot.moduleSummary,
    approvalExecutionActive: snapshot.approvalCenter.executionActive,
    safety: snapshot.safety,
    blockers: snapshot.blockers,
  };
}
