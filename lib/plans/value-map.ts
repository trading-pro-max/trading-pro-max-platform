import type { PlanId } from "@/lib/plans/types";

export type PlanValueMapEntry = {
  planId: PlanId | "guest" | "founder_king";
  userPromise: string;
  visibleIdentity: string;
  activeCapabilities: string[];
  plannedCapabilities: string[];
  lockedCapabilities: string[];
  companionLevel: string;
  journalCoachLevel: string;
  contentCommunityAccess: string;
  supportLevel: string;
  reportingLevel: string;
  upgradeTrigger: string;
  mustNotClaim: string[];
};

export type PlanValueMapSnapshot = {
  checkedAt: string;
  mode: "plan_value_map";
  plans: PlanValueMapEntry[];
  truth: {
    billing: "inactive";
    paidActivation: "not_enabled";
    vipActivation: "not_active";
    enterpriseAvailability: "future_planned";
    performanceFee: "hidden_inactive";
    communityRooms: "planned_not_active";
    partnerships: "inactive_planned";
  };
};

export const PLAN_VALUE_MAP: PlanValueMapEntry[] = [
  {
    planId: "guest",
    userPromise: "Understand the public product trust layer without plan pressure.",
    visibleIdentity: "Clean minimal public trust identity.",
    activeCapabilities: ["Public entry", "Brand trust", "Limited Academy preview"],
    plannedCapabilities: ["More public-safe education"],
    lockedCapabilities: ["Workstation depth", "Assistant depth", "Journal/Coach"],
    companionLevel: "Orientation only",
    journalCoachLevel: "Not available",
    contentCommunityAccess: "Public-safe content only.",
    supportLevel: "No support claim.",
    reportingLevel: "No user reporting.",
    upgradeTrigger: "No billing or checkout is active.",
    mustNotClaim: ["paid access", "owner command access", "live execution"],
  },
  {
    planId: "demo_free",
    userPromise: "Trade in a familiar premium paper-safe terminal with moderate TPM advantages.",
    visibleIdentity: "Graphite/blue familiar paper trading identity.",
    activeCapabilities: ["Chart-first paper workstation", "Basic Assistant", "Basic Why Blocked", "Basic Academy", "Diagnostics and feedback"],
    plannedCapabilities: ["Deeper Academy paths", "Decision replay foundation", "Community basic"],
    lockedCapabilities: ["Pro alerts", "VIP Brain", "Advanced reports", "Private rooms"],
    companionLevel: "Free Assistant",
    journalCoachLevel: "Basic paper prompts active",
    contentCommunityAccess: "Basic community concept only; no live community claim.",
    supportLevel: "Feedback readiness",
    reportingLevel: "Local/session readiness",
    upgradeTrigger: "No upgrade flow is active because billing is inactive.",
    mustNotClaim: ["live execution", "paid access", "guaranteed outcome"],
  },
  {
    planId: "pro",
    userPromise: "Use an intelligent professional workspace after entitlement support exists.",
    visibleIdentity: "Graphite/emerald/silver professional identity.",
    activeCapabilities: [],
    plannedCapabilities: ["Pro Assistant", "Journal/Coach depth", "Alerts/workflows", "Workspace memory", "Decision replay basic", "Pro community"],
    lockedCapabilities: ["VIP Brain", "Advanced performance review", "Private rooms"],
    companionLevel: "Pro Assistant planned",
    journalCoachLevel: "Structured session review planned",
    contentCommunityAccess: "Pro rooms planned only.",
    supportLevel: "Standard support concept only.",
    reportingLevel: "Session summaries planned.",
    upgradeTrigger: "Entitlement and billing must exist before Pro is active.",
    mustNotClaim: ["Pro active", "checkout active", "premium signal"],
  },
  {
    planId: "vip",
    userPromise: "Enter the elite premium workspace layer after VIP entitlement, safety, and support gates exist.",
    visibleIdentity: "Black/gold/platinum elite identity without noise.",
    activeCapabilities: [],
    plannedCapabilities: ["VIP Brain", "Advanced Assistant", "Advanced coaching", "Deep journal analytics", "Strategy review", "Premium reports", "VIP private rooms"],
    lockedCapabilities: ["Guaranteed signals", "Win-rate claims", "Copy trading"],
    companionLevel: "VIP Brain planned",
    journalCoachLevel: "Advanced review planned",
    contentCommunityAccess: "VIP rooms planned with safety and legal review.",
    supportLevel: "Priority support concept only.",
    reportingLevel: "Premium reports planned.",
    upgradeTrigger: "VIP requires entitlement, billing, safety, and Founder approval gates.",
    mustNotClaim: ["VIP active", "guaranteed returns", "win-rate", "priority support active"],
  },
  {
    planId: "enterprise",
    userPromise: "Support institutional teams later with audit and compliance-ready workflows.",
    visibleIdentity: "Navy/platinum/cyan future institutional identity.",
    activeCapabilities: [],
    plannedCapabilities: ["Team/admin summaries", "Compliance assistant", "Audit overview", "Runbook support"],
    lockedCapabilities: ["Institutional access", "Team billing", "Compliance certification"],
    companionLevel: "Institutional Assistant future",
    journalCoachLevel: "Team runbook guidance future",
    contentCommunityAccess: "Institutional rooms future only.",
    supportLevel: "Custom support future only.",
    reportingLevel: "Team/audit reports future.",
    upgradeTrigger: "Institutional is future-planned and not for public/user activation now.",
    mustNotClaim: ["Institutional available", "compliance certified", "team admin active"],
  },
  {
    planId: "founder_king",
    userPromise: "Private owner command of the internal TPM operating system.",
    visibleIdentity: "Private command identity, not a user plan.",
    activeCapabilities: ["Read-only owner command readiness", "Internal reports", "Readiness summaries"],
    plannedCapabilities: ["Owner device auth", "Desktop/mobile command app", "Audited approvals"],
    lockedCapabilities: ["Approval execution", "production controls"],
    companionLevel: "Owner assistant readiness",
    journalCoachLevel: "Internal management briefing",
    contentCommunityAccess: "All queues summarized privately when built.",
    supportLevel: "Owner-only operational control.",
    reportingLevel: "Full internal readiness reports.",
    upgradeTrigger: "Not purchasable and never part of user plans.",
    mustNotClaim: ["public access", "plan unlock", "critical block override"],
  },
];

export function getPlanValueMapSnapshot(
  checkedAt = new Date().toISOString()
): PlanValueMapSnapshot {
  return {
    checkedAt,
    mode: "plan_value_map",
    plans: PLAN_VALUE_MAP,
    truth: {
      billing: "inactive",
      paidActivation: "not_enabled",
      vipActivation: "not_active",
      enterpriseAvailability: "future_planned",
      performanceFee: "hidden_inactive",
      communityRooms: "planned_not_active",
      partnerships: "inactive_planned",
    },
  };
}
