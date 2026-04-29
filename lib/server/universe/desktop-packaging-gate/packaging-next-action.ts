import "server-only";

import type { DesktopPackagingNextAction } from "./types";

export function getDesktopPackagingNextAction(): DesktopPackagingNextAction {
  return {
    next: "Ahmad decision required",
    reason:
      "The local auth gate is defined, but Ahmad must choose PIN, passphrase, device-lock integration, or another local method before private packaging preparation.",
    blockedUntil: [
      "Ahmad chooses the local packaged-app auth method.",
      "Local packaged-app auth readiness closes.",
      "Ahmad approves signing method.",
      "Ahmad approves private distribution method.",
      "Secret safety plan remains enforced.",
      "Product Truth stays visible and blocking public distribution.",
    ],
  };
}
