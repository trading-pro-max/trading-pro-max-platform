import "server-only";

import type { DesktopPackagingReadiness } from "./types";

export function getDesktopShellReadiness(): DesktopPackagingReadiness {
  return {
    id: "desktop_shell_readiness",
    label: "Shell readiness",
    state: "ready_with_notes",
    status: "/desktop/kawn is available as the private desktop command home.",
    checks: [
      "/desktop/kawn exists.",
      "Desktop shell status exists.",
      "Founder desktop card exists.",
      "Desktop route is private command home.",
      "Control surfaces are available.",
    ],
    evidence: [
      "app/desktop/kawn/page.tsx",
      "app/desktop/kawn/_components/AlKawnDesktopShellStatus.tsx",
      "app/founder/universe/_components/UniverseCommandCenter.tsx",
      "lib/server/universe/control-surfaces",
      "npm run desktop:check",
    ],
    risk: "Native packaging is not complete; the current shell is still a private Next route.",
    nextAction: "Keep /desktop/kawn as the private home while native packaging remains gated.",
  };
}
