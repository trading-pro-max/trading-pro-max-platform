import "server-only";

import type { DesktopSecretSafety } from "./types";

export function getDesktopSecretSafety(): DesktopSecretSafety {
  return {
    id: "desktop_secret_safety",
    label: "Secret safety",
    state: "ready_with_notes",
    status: "No secrets may be stored in Git or the desktop bundle.",
    checks: [
      "No secrets in Git.",
      "No secrets in app bundle.",
      "No API keys in desktop shell.",
      "No external account auto-connect.",
      "Secrets-in-app remains blocked.",
    ],
    evidence: [
      "Absolute Founder Boundary.",
      "Universe Operating Kernel guards.",
      "Desktop shell security rules.",
    ],
    risk: "Secret safety remains a rule and gate; no packaged bundle is being produced in this mission.",
    nextAction: "Keep secrets external to code and bundle; require Ahmad approval for any future secure storage plan.",
    secretsInGit: "blocked",
    secretsInBundle: "blocked",
    externalAccountAutoConnect: "blocked",
  };
}
