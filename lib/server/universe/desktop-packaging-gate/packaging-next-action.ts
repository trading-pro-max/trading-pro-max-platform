import "server-only";

import type { DesktopPackagingNextAction } from "./types";

export function getDesktopPackagingNextAction(): DesktopPackagingNextAction {
  return {
    next: "Local Packaged Auth Gate",
    reason:
      "The private route and control surfaces exist, but native packaging should wait until packaged-app local authentication is defined.",
    blockedUntil: [
      "Local packaged-app auth readiness closes.",
      "Ahmad approves signing method.",
      "Ahmad approves private distribution method.",
      "Secret safety plan remains enforced.",
      "Product Truth stays visible and blocking public distribution.",
    ],
  };
}
