export type PlanetStatus = "operating" | "ready" | "planned" | "blocked" | "degraded";

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

export type MinistryStatus =
  | "ready"
  | "operating"
  | "degraded"
  | "blocked"
  | "planned";

export type FounderApprovalState =
  | "pending_guardian_review"
  | "pending_legal_review"
  | "ready_for_founder"
  | "approved"
  | "rejected"
  | "blocked"
  | "requires_revision"
  | "archived";

export type ProductTruthSnapshot = {
  liveExecution: "blocked";
  realMoneyRouting: "blocked";
  brokerFeedActivation: "not_faked";
  billing: "inactive";
  publicLaunch: "not_claimed";
  socialPublishing: "inactive";
  secrets: "not_exposed";
};

export type SafetyBoundaryState = {
  liveExecution: "blocked";
  realMoneyRouting: "blocked";
  brokerFeedActivation: "blocked";
  billingActivation: "blocked";
  publicLaunchClaim: "blocked";
  socialPublishing: "blocked";
  secretExposure: "blocked";
  criticalOverride: "blocked_without_remediation";
  founderApproval: "required_for_high_risk";
  auditTrail: "required_for_sensitive_actions";
};

export type PlanetState = {
  id: string;
  continentId: string;
  name: string;
  purpose: string;
  readiness: PlanetReadinessState;
  riskLevel: PlanetRiskLevel;
  automationLevel: PlanetAutomationLevel;
  active: string[];
  planned: string[];
  blocked: string[];
  reportDestination: "Founder Command Room";
};

export type PlanetMinistry = {
  id: string;
  name: string;
  leaderTitle: string;
  purpose: string;
  status: MinistryStatus;
  riskLevel: PlanetRiskLevel;
  automationLevel: PlanetAutomationLevel;
  controlledModules: string[];
  activeWork: string[];
  blockers: string[];
  reportDestination: "Founder Command Room";
  productTruth: string[];
};

export type PlanetCityModule = {
  id: string;
  continentId: string;
  stateId: string;
  name: string;
  purpose: string;
  readiness: PlanetReadinessState;
  citizenClasses: PlanetCitizenClass[];
  active: string[];
  planned: string[];
  blocked: string[];
  truthRules: string[];
};

export type PlanetProfession = {
  id: string;
  title: string;
  purpose: string;
  permissions: string[];
  boundaries: string[];
  reportsTo: string;
};

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
  ministries: string[];
  cityModules: string[];
  active: string[];
  planned: string[];
  blocked: string[];
  reportDestination: "Founder Command Room";
  truthRules: string[];
};

export type MinistryReport = {
  ministryId: string;
  ministryName: string;
  leaderTitle: string;
  status: MinistryStatus;
  confidence: "high" | "medium" | "low";
  riskLevel: PlanetRiskLevel;
  automationLevel: PlanetAutomationLevel;
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
  productTruth: ProductTruthSnapshot;
  reportDestination: "Founder Command Room";
  lastUpdated: string;
  reportCadence: "daily" | "weekly" | "event_driven" | "manual";
};

export type FounderBriefing = {
  checkedAt: string;
  planetStatus: PlanetStatus;
  topRisks: string[];
  operatingMinistries: string[];
  operatingNormally: string[];
  blockedMinistries: string[];
  blockedOrDegraded: string[];
  approvalsNeeded: string[];
  guardianAlerts: string[];
  legalWarnings: string[];
  mediaQueueReadiness: string[];
  engineeringTasks: string[];
  productGaps: string[];
  proVipReadiness: string[];
  pendingApprovals: string[];
  recommendedDecisions: string[];
  nextSafeActions: string[];
  whatNotToDoToday: string[];
};

export type PlanetStateSummary = {
  checkedAt: string;
  model: "tpm_planet_earth_os";
  status: PlanetStatus;
  founderCommand: {
    privateOwnerOnly: true;
    publicRouteExposed: false;
    desktopAppShipped: false;
    mobileAppShipped: false;
    reportDestination: "Founder Command Room";
  };
  continents: PlanetContinent[];
  states: PlanetState[];
  ministries: MinistryReport[];
  ministryCatalog: PlanetMinistry[];
  cityModules: PlanetCityModule[];
  citizenClasses: Array<{
    key: PlanetCitizenClass;
    label: string;
    state: "active_paper" | "planned" | "future";
    truth: string;
  }>;
  professions: PlanetProfession[];
  founderBriefing: FounderBriefing;
  safetyBoundaries: SafetyBoundaryState;
  truth: ProductTruthSnapshot;
};
