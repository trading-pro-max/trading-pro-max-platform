export type PlanetReadinessState =
  | "active"
  | "foundation_ready"
  | "planned"
  | "blocked"
  | "degraded"
  | "inactive";

export type PlanetAutomationLevel =
  | "auto"
  | "review"
  | "founder_approval"
  | "blocked";

export type PlanetRiskLevel = "low" | "medium" | "high" | "critical";

export type PlanetCitizenClass = "free_demo" | "pro" | "vip" | "enterprise";

export type PlanetContinent = {
  id: string;
  name: string;
  purpose: string;
  ownerRole: string;
  readiness: PlanetReadinessState;
  automationLevel: PlanetAutomationLevel;
  riskLevel: PlanetRiskLevel;
  citizenClasses: PlanetCitizenClass[];
  states: string[];
  truthRules: string[];
};

export type PlanetStateSummary = {
  checkedAt: string;
  model: "tpm_planet_earth_os";
  founderCommand: {
    privateOwnerOnly: true;
    publicRouteExposed: false;
    desktopAppShipped: false;
    mobileAppShipped: false;
  };
  continents: PlanetContinent[];
  truth: {
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerFeedActivation: "not_faked";
    billing: "inactive";
    publicLaunch: "not_claimed";
    socialPublishing: "inactive";
    secrets: "not_exposed";
  };
};

export type MinistryStatus =
  | "ready"
  | "operating"
  | "degraded"
  | "blocked"
  | "planned";

export type MinistryReport = {
  ministryId: string;
  ministryName: string;
  leaderTitle: string;
  status: MinistryStatus;
  confidence: "high" | "medium" | "low";
  riskLevel: PlanetRiskLevel;
  summary: string;
  keyMetrics: string[];
  activeWork: string[];
  blockers: string[];
  incidents: string[];
  pendingApprovals: string[];
  guardianFlags: string[];
  legalFlags: string[];
  engineeringFlags: string[];
  citizenImpact: string;
  revenueImpactLater: string;
  nextActions: string[];
  founderDecisionNeeded: boolean;
  lastUpdated: string;
  reportCadence: "daily" | "weekly" | "event_driven" | "manual";
};

export type FounderApprovalState =
  | "pending_guardian_review"
  | "pending_legal_review"
  | "ready_for_founder"
  | "approved"
  | "rejected"
  | "blocked"
  | "requires_revision"
  | "archived";

export type FounderBriefing = {
  checkedAt: string;
  planetStatus: MinistryStatus;
  topRisks: string[];
  operatingNormally: string[];
  blockedOrDegraded: string[];
  guardianAlerts: string[];
  legalWarnings: string[];
  pendingApprovals: string[];
  recommendedDecisions: string[];
  whatNotToDoToday: string[];
};
