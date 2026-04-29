import "server-only";

import type { AuthSecretSafety } from "./types";

export function getAuthSecretSafety(): AuthSecretSafety {
  return {
    id: "auth_secret_safety",
    label: "Auth secret safety",
    state: "ready_with_notes",
    status: "No auth secrets may be stored in Git or the app bundle.",
    checks: [
      "No secrets in Git.",
      "No secrets in app bundle.",
      "No auth secret hardcoded.",
      "No API keys in desktop shell.",
      "No external account token stored by default.",
    ],
    evidence: [
      "Absolute Founder Boundary.",
      "Private Desktop Packaging Gate secret safety.",
      "Universe Operating Kernel Product Truth guards.",
    ],
    risk: "Secret safety is a rule and gate; no packaged auth secret store is implemented now.",
    nextAction: "Keep auth secrets out of source and bundle; approve a secure local storage design later.",
    secretsInGit: "blocked",
    secretsInBundle: "blocked",
    hardcodedAuthSecret: "blocked",
    desktopApiKeys: "blocked",
  };
}
