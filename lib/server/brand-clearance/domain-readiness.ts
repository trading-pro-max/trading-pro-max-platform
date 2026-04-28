import type { DomainReadinessStatus } from "./types";

export const domainReadinessStatuses: DomainReadinessStatus[] = [
  "unknown",
  "needs_check",
  "available_claimed_by_ahmad",
  "unavailable",
  "parked",
  "conflict_risk",
  "review_required",
];

export function getDomainReadinessStatus(): DomainReadinessStatus {
  return "needs_check";
}

export function isDomainPurchaseAllowed(status: DomainReadinessStatus) {
  return status === "available_claimed_by_ahmad";
}
