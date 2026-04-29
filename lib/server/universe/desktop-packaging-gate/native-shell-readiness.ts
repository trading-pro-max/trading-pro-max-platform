import "server-only";

import type { DesktopPackagingReadiness } from "./types";

export function getNativeDesktopShellReadiness(): DesktopPackagingReadiness {
  return {
    id: "native_desktop_shell_readiness",
    label: "Native shell readiness",
    state: "future_gate",
    status: "Electron/Tauri native shell is not confirmed in the active architecture.",
    checks: [
      "Electron exists: no.",
      "Tauri exists: no.",
      "Native shell entry exists: no.",
      "Native default route configured: no.",
      "Native shell remains a future gate.",
    ],
    evidence: [
      "package.json has no Electron dependency.",
      "package.json has no Tauri dependency.",
      "scripts/al-kawn-desktop-shell-check.mjs reports shell_type=next_route_only.",
    ],
    risk: "Creating a native shell before the gate closes would duplicate desktop architecture.",
    nextAction: "Choose a private native shell path later only after Ahmad approves the packaging method.",
  };
}
