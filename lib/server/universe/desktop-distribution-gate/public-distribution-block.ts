import "server-only";

import type { DesktopDistributionGateCheck } from "./types";

export function getPublicDistributionBlock(): DesktopDistributionGateCheck {
  return {
    id: "public_distribution_block",
    label: "Public distribution block",
    state: "blocked",
    status: "Public desktop distribution is blocked.",
    checks: [
      "No public release channel.",
      "No public download link.",
      "No App Store release.",
      "No auto-update public channel.",
      "No upload or publish path.",
    ],
    evidence: [
      "package.json has no release/upload/publish/auto-update scripts.",
      "desktop:package:dry-run reports artifacts_created=false.",
      "Product Truth blocks public desktop distribution.",
    ],
    risk: "Public distribution would expose a private Ahmad-only command client.",
    nextAction: "Keep public desktop distribution blocked unless Ahmad creates a future explicit gate.",
  };
}
