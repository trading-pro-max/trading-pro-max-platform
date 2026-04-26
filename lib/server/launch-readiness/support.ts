import "server-only";

import type { SupportReadinessSnapshot } from "./types";

export function getSupportReadinessSnapshot(
  checkedAt = new Date().toISOString()
): SupportReadinessSnapshot {
  return {
    checkedAt,
    status: "partial",
    surfaces: [
      "Help Center",
      "Contact Support",
      "Security Contact",
      "Partnership Contact",
      "Report a Problem",
      "Response policy",
      "Escalation policy",
    ],
    noEmailSending: true,
    fakeTicketBackendAllowed: false,
    escalationPolicyRequired: true,
    securityContactReadiness: "planned",
  };
}
