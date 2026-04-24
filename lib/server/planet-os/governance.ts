import "server-only";

import type { ConstitutionRule, CouncilDecision, GovernanceReport } from "./types";

export const CONSTITUTION_RULES: ConstitutionRule[] = [
  ["no_guaranteed_profit", "No guaranteed profit", "truth", "No surface may promise profit or certainty.", "blocked", "Constitutional Council"],
  ["no_win_rate_claims", "No win-rate claims", "truth", "Win-rate or sure-signal wording is blocked unless a future legal/compliance process explicitly permits audited language.", "blocked", "Constitutional Council"],
  ["no_fake_launch", "No fake launch", "launch", "Public launch must never be claimed before actual launch readiness and Founder approval.", "blocked", "Executive Council"],
  ["no_fake_live_trading", "No fake live trading", "safety", "Live trading and real-money routing remain blocked until explicit configured gates exist.", "blocked", "Guardian Authority"],
  ["no_fake_broker_feed", "No fake broker/feed", "truth", "Broker/feed activation cannot be implied while unconfigured or fallback-bound.", "blocked", "Markets Governor"],
  ["no_fake_billing", "No fake billing", "truth", "Billing, checkout, paid access, and VIP activation remain inactive unless real entitlement infrastructure exists.", "blocked", "Treasury Governor"],
  ["no_fake_islamic_certification", "No fake Islamic/Sharia certification", "legal", "Islamic account status must not claim certification without real certification.", "blocked", "Legal Governor"],
  ["no_competitor_copying", "No competitor copying", "legal", "Brand, content, UI, and media must not copy competitor identity.", "blocked", "Rights & Brand Authority"],
  ["no_secrets_in_git", "No secrets in Git", "security", "Production secrets, broker credentials, social tokens, or private keys must not be committed.", "blocked", "Cybersecurity & Privacy Ministry"],
  ["safe_automation_only", "Safe automation only", "automation", "Low-risk drafts and explanations may be automated; sensitive actions require review.", "review_required", "Legislative Council"],
  ["high_risk_founder_approval", "High risk requires Founder approval", "automation", "High-risk public, money, media, launch, or integration actions require Founder approval.", "founder_approval_required", "Founder Command Room"],
  ["public_launch_last", "Public launch is last", "launch", "Launch remains the last stage after product, legal, ops, security, and Founder approval.", "blocked", "Executive Council"],
].map(([id, title, category, rule, enforcement, owner]) => ({
  id,
  title,
  category: category as ConstitutionRule["category"],
  rule,
  enforcement: enforcement as ConstitutionRule["enforcement"],
  owner,
}));

export const PLANET_COUNCILS: CouncilDecision[] = [
  {
    id: "constitutional_council",
    council: "constitutional",
    purpose: "Protects the constitution, blocks fake claims, and stops unsafe decisions.",
    canDo: ["block constitutional violations", "require remediation", "escalate critical risk"],
    cannotDo: ["launch", "bill", "activate broker/feed", "override Guardian/Legal blocks"],
    escalationRoute: ["Founder Presidency", "Founder Command Room"],
  },
  {
    id: "legislative_council",
    council: "legislative",
    purpose: "Creates internal laws for plans, community, media, assistant, Islamic status, and safety.",
    canDo: ["draft policy", "define review rules", "propose safe operating law"],
    cannotDo: ["claim external compliance", "publish policy as legal advice"],
    escalationRoute: ["Constitutional Council", "Founder Presidency"],
  },
  {
    id: "executive_council",
    council: "executive",
    purpose: "Turns approved laws into coordinated implementation and ministry execution.",
    canDo: ["coordinate ministries", "track blockers", "request implementation reports"],
    cannotDo: ["skip validation", "execute high-risk actions without approvals"],
    escalationRoute: ["Founder Presidency", "Founder Command Room"],
  },
];

export function getPlanetGovernanceSnapshot(checkedAt = new Date().toISOString()) {
  const reportChain = [
    "City / Module",
    "Ministry",
    "State Governor",
    "Continent Governor",
    "Founder Presidency / Central Coordination System",
    "Founder Command Room",
  ];

  const reports: GovernanceReport[] = [
    {
      reportId: "governance-report-command-readiness",
      sourceNode: "Founder Presidency / Central Coordination System",
      destinationNode: "Founder Command Room",
      hierarchyPath: reportChain,
      status: "ready",
      riskLevel: "critical",
      blockers: ["owner-only desktop/mobile app not shipped", "approval execution remains planned"],
      resources: ["product truth", "ministry reports", "constitution"],
      approvalsNeeded: ["future owner device authentication", "future audit-backed approval execution"],
      legalFlags: ["no public command claim"],
      guardianFlags: ["private owner-only access required"],
      engineeringFlags: ["no public route exposure"],
      citizenImpact: "Citizens do not see private command controls.",
      nextActions: ["keep Founder Command read-only and hidden from public navigation"],
    },
  ];

  return {
    checkedAt,
    mode: "planet_governance",
    councils: PLANET_COUNCILS,
    constitutionRules: CONSTITUTION_RULES,
    reportChain,
    reports,
    summary: {
      councils: PLANET_COUNCILS.length,
      constitutionRules: CONSTITUTION_RULES.length,
      publicLaunchAllowed: false,
      criticalOverrideAllowedWithoutRemediation: false,
      secretsAllowedInGit: false,
    },
  };
}
