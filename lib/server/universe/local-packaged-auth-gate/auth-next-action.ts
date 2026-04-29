import "server-only";

import type { LocalAuthNextAction } from "./types";

export function getLocalAuthNextAction(): LocalAuthNextAction {
  return {
    next: "Ahmad decision required",
    reason:
      "The local auth gate is defined, but Ahmad must choose the private local access method before implementation or packaging preparation.",
    blockedUntil: [
      "Ahmad chooses PIN, passphrase, OS device-lock integration, or another local method.",
      "A real packaged-app lock implementation is built and validated.",
      "Session timeout behavior is implemented and validated.",
      "No secrets are stored in Git or the app bundle.",
      "External auth providers remain disconnected unless Ahmad approves.",
    ],
  };
}
