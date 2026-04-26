import "server-only";

import type { LaunchBudgetSnapshot } from "./types";

const lineItems: LaunchBudgetSnapshot["lineItems"] = [
  {
    key: "hosting_vps",
    label: "Hosting / VPS",
    suggestedRangeChf: [20, 60],
    plannedMonthlyChf: 40,
    readiness: "planned",
    note: "Future VPS or managed hosting choice; no purchase or provisioning now.",
  },
  {
    key: "database",
    label: "Database",
    suggestedRangeChf: [0, 60],
    plannedMonthlyChf: 35,
    readiness: "planned",
    note: "Future managed database or low-cost Postgres option; no production database activation.",
  },
  {
    key: "backups",
    label: "Backups",
    suggestedRangeChf: [10, 30],
    plannedMonthlyChf: 20,
    readiness: "planned",
    note: "Future automated backup retention; no backup provider account created.",
  },
  {
    key: "email_provider",
    label: "Email provider",
    suggestedRangeChf: [0, 25],
    plannedMonthlyChf: 10,
    readiness: "planned",
    note: "Future transactional email/waitlist provider; sending remains inactive.",
  },
  {
    key: "monitoring_logs",
    label: "Monitoring / logs",
    suggestedRangeChf: [10, 30],
    plannedMonthlyChf: 20,
    readiness: "planned",
    note: "Future uptime/log monitoring; no external telemetry account connected.",
  },
  {
    key: "domain_dns_cdn",
    label: "Domain / DNS / CDN",
    suggestedRangeChf: [0, 20],
    plannedMonthlyChf: 10,
    readiness: "planned",
    note: "Future DNS/CDN/SSL readiness; no domain purchase or DNS change now.",
  },
  {
    key: "buffer",
    label: "Buffer",
    suggestedRangeChf: [50, 80],
    plannedMonthlyChf: 65,
    readiness: "planned",
    note: "Reserved for overages while staying under the 250 CHF/month cap.",
  },
];

export function getLaunchBudgetSnapshot(
  checkedAt = new Date().toISOString()
): LaunchBudgetSnapshot {
  const initialOperatingTargetChf = lineItems.reduce(
    (sum, item) => sum + item.plannedMonthlyChf,
    0
  );

  return {
    checkedAt,
    currency: "CHF",
    monthlyCapChf: 250,
    initialOperatingTargetChf,
    capRespected: initialOperatingTargetChf <= 250,
    founderApprovalRequiredAboveCap: true,
    noPurchase: true,
    noAccountCreation: true,
    noBillingActivation: true,
    lineItems,
  };
}
