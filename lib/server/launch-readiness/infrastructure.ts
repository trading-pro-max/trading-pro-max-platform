import "server-only";

import type { LaunchInfrastructureSnapshot } from "./types";

export function getLaunchInfrastructureSnapshot(
  checkedAt = new Date().toISOString()
): LaunchInfrastructureSnapshot {
  return {
    checkedAt,
    status: "partial",
    hostingOptions: [
      "single small VPS or managed app platform under budget",
      "staging environment before production",
      "paper-only runtime configuration",
    ],
    databaseOptions: [
      "managed Postgres with low-cost tier",
      "separate staging and future production databases",
      "migration plan required before any production deployment",
    ],
    backupPlan: [
      "daily database backup target",
      "weekly restore test before soft launch",
      "retention policy documented before paid access",
    ],
    monitoringPlan: [
      "uptime check",
      "application logs",
      "error alert review",
      "budget alert review",
    ],
    dnsCdnSslPlan: [
      "DNS/CDN provider chosen later",
      "SSL/TLS required",
      "no DNS change during local readiness",
    ],
    rollbackPlan: [
      "keep previous deployment artifact",
      "database migration rollback decision before deploy",
      "manual Founder approval before traffic switch",
    ],
    noProvisioning: true,
    noExternalCalls: true,
  };
}
