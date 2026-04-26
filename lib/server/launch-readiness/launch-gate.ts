import "server-only";

import type {
  BetaReadinessSnapshot,
  BillingReadinessSnapshot,
  LaunchBudgetSnapshot,
  LaunchGateSnapshot,
  LaunchInfrastructureSnapshot,
  LegalReadinessSnapshot,
  ReadinessTruth,
  SupportReadinessSnapshot,
  WaitlistReadinessSnapshot,
} from "./types";

export const launchReadinessTruth: ReadinessTruth = {
  launchActive: false,
  productionActive: false,
  billingActive: false,
  brokerFeedActive: false,
  liveExecutionActive: false,
  realMoneyActive: false,
  socialPublishingActive: false,
  externalAccountsCreated: false,
  emailSendingActive: false,
  paymentCredentialsStored: false,
  productionSecretsTouched: false,
  fakeUsersRevenueMetrics: false,
};

export function getLaunchGateSnapshot(input: {
  checkedAt?: string;
  budget: LaunchBudgetSnapshot;
  infrastructure: LaunchInfrastructureSnapshot;
  waitlist: WaitlistReadinessSnapshot;
  legal: LegalReadinessSnapshot;
  support: SupportReadinessSnapshot;
  billing: BillingReadinessSnapshot;
  beta: BetaReadinessSnapshot;
}): LaunchGateSnapshot {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const gates: LaunchGateSnapshot["gates"] = [
    {
      key: "budget_cap",
      label: "250 CHF/month budget cap",
      status: input.budget.capRespected ? "ready" : "blocked",
      required: true,
      evidence: `${input.budget.initialOperatingTargetChf}/${input.budget.monthlyCapChf} CHF planned.`,
    },
    {
      key: "staging",
      label: "Staging readiness",
      status: input.infrastructure.status,
      required: true,
      evidence: "Staging is planned but not provisioned.",
    },
    {
      key: "waitlist",
      label: "Waitlist readiness",
      status: input.waitlist.status,
      required: true,
      evidence: "Waitlist is planned; provider and privacy notice are required before capture.",
    },
    {
      key: "legal",
      label: "Legal readiness",
      status: input.legal.status,
      required: true,
      evidence: "Policy drafts exist; qualified legal review remains required.",
    },
    {
      key: "support",
      label: "Support readiness",
      status: input.support.status,
      required: true,
      evidence: "Support surfaces are defined; no ticket backend or email sending is active.",
    },
    {
      key: "billing",
      label: "Billing readiness",
      status: input.billing.status,
      required: true,
      evidence: "Checkout, subscriptions, invoices, and payment credentials are inactive.",
    },
    {
      key: "beta",
      label: "Private beta readiness",
      status: input.beta.status,
      required: true,
      evidence: "Future paper-only beta still needs local pass, review, support, legal, and Founder decision.",
    },
    {
      key: "founder_final_decision",
      label: "Founder final decision",
      status: "not_ready",
      required: true,
      evidence: "Ahmad must make the final explicit launch decision later.",
    },
  ];
  const blockers = gates
    .filter((gate) => gate.required && gate.status !== "ready")
    .map((gate) => gate.key);

  return {
    checkedAt,
    status: blockers.length > 0 ? "not_ready" : "ready_for_soft_launch",
    canLaunch: false,
    canEnterWaitlist: false,
    canEnterPrivateBeta: false,
    canEnterSoftLaunch: false,
    founderFinalDecisionRequired: true,
    gates,
    blockers,
    nextSafeAction:
      "Keep readiness local, finish legal/support/staging review, and do not activate external systems.",
    truth: launchReadinessTruth,
  };
}
