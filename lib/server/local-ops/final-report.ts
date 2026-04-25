import "server-only";

import { getLocalDayOneReadinessSnapshot } from "./day-one";
import type { LocalOperationsFinalReportSnapshot } from "./types";

export function getLocalOperationsFinalReportSnapshot(
  checkedAt = new Date().toISOString()
): LocalOperationsFinalReportSnapshot {
  const dayOne = getLocalDayOneReadinessSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "local_operations_final_report",
    readinessState: dayOne.gateStatus,
    canStartLocalDayOne: dayOne.readyToStartLocalDayOne,
    ahmadHumanVisualReviewRequired: true,
    complete: [
      "Product Truth gate is present and blocks dangerous systems.",
      "Free is paper-safe and public plan language is Free / Pro / VIP / Institutional.",
      "TPM Assistant has safe daily-use intent handling and no execution authority.",
      "Founder Command remains private, owner-only, read-only, and hidden from public navigation.",
      "Local operations doctrine, day cycle, readiness law, and local reports are established.",
      "Product memory stores safe summaries only and rejects secrets/private sensitive data.",
      "Autonomous construction intelligence remains draft/readiness-only and non-autonomous.",
    ],
    partial: [
      "Journal/Coach is ready for local reflection but durable account-safe persistence is planned.",
      "Product memory is deterministic local/internal readiness, not production persistence.",
      "Git and validation readiness must be confirmed by the current validation run.",
      "Visual maturity requires Ahmad's human acceptance after screenshots.",
    ],
    planned: [
      "Pro/VIP/Institutional entitlement activation remains future or planned.",
      "Owner authentication, device trust, step-up confirmation, and approval execution remain planned for Founder Command.",
      "Production database, staging, monitoring, external integrations, billing provider, and social publishing remain future activation phases.",
    ],
    blockedByDesign: [
      "global launch",
      "production activation",
      "billing activation",
      "broker/feed activation",
      "live execution",
      "real-money routing",
      "social publishing",
      "fake users/revenue/metrics",
      "fake Swiss legal/company status",
      "fake Islamic/Sharia certification",
    ],
    excludedFromLocalOperations: [
      "public launch",
      "production deployment",
      "billing and checkout",
      "real broker/feed credentials",
      "live-money order routing",
      "social account connection",
      "paid entitlement activation",
      "real user metrics",
    ],
    mustWaitForRealActivation: [
      "billing provider setup",
      "broker/feed provider credentials",
      "real-money compliance review",
      "staging/production environment review",
      "legal counsel and jurisdiction-specific review",
      "real beta user feedback",
      "social account connection and publishing approval",
    ],
    ahmadMustReviewVisually: [
      "public entry dark and light",
      "Trading Workspace dark, light, and Arabic RTL",
      "chart focus",
      "execution ticket",
      "TPM Assistant open and closed",
      "Journal/Coach",
      "Settings",
      "Diagnostics",
      "plan surfaces",
      "Earth Mark and Swiss Precision Clock / Pulse",
    ],
    blockers: dayOne.blockers,
    nextSafeActions: [
      "Run the final validation commands and keep the Git tree clean.",
      "Capture Local Day One screenshots and record Ahmad visual acceptance notes.",
      "Start Local Operations Day 1 only as a closed local, paper-safe review.",
      "Turn any observed visual or UX issue into a scoped non-launch build task.",
    ],
    launchForbiddenReminder: dayOne.launchForbiddenReminder,
    truth: dayOne.truth,
  };
}
