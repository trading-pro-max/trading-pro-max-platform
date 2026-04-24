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

export type PlanetHierarchyNodeKind =
  | "founder_king"
  | "command_room"
  | "constitution"
  | "council"
  | "presidency"
  | "continent"
  | "state"
  | "governor"
  | "government"
  | "ministry"
  | "authority"
  | "city_module"
  | "profession"
  | "citizen_class"
  | "resource";

export type PlanetHierarchyNode = {
  id: string;
  kind: PlanetHierarchyNodeKind;
  name: string;
  parentId: string | null;
  level: number;
  purpose: string;
  reportDestination: string;
  visibility: "founder_private" | "internal" | "plan_scoped" | "public_safe";
  readiness: PlanetReadinessState;
  riskLevel: PlanetRiskLevel;
  automationLevel: PlanetAutomationLevel;
  truthRules: string[];
};

export type PlanetGovernor = {
  id: string;
  title: string;
  governs: string;
  scope: "planet" | "continent" | "state" | "ministry";
  permissions: string[];
  limits: string[];
  reportsTo: string;
};

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
  continent?: string;
  state?: string;
  authorities?: string[];
  professions?: string[];
  nextActions?: string[];
  whatMustNotBeFaked?: string[];
};

export type PlanetEarthMinistry = {
  id: string;
  officialName: string;
  continent: string;
  state: string;
  leaderTitle: string;
  purpose: string;
  responsibilities: string[];
  authorities: string[];
  cityModules: string[];
  professions: string[];
  citizenFacingValue: string;
  founderCommandSignals: string[];
  legalBoundaries: string[];
  guardianBoundaries: string[];
  automationLevel: PlanetAutomationLevel;
  riskLevel: PlanetRiskLevel;
  readiness: PlanetReadinessState;
  blockers: string[];
  nextActions: string[];
  whatMustNotBeFaked: string[];
};

export type PlanetAuthority = {
  id: string;
  name: string;
  parentMinistry: string;
  purpose: string;
  powers: string[];
  limits: string[];
  escalationRoute: string[];
  founderApprovalRequired: boolean;
};

export type PlanetCity = {
  id: string;
  name: string;
  continent: string;
  state: string;
  ministryOwner: string;
  userVisibility: "public" | "plan_scoped" | "internal" | "founder_private";
  planAccess: Array<PlanetCitizenClass | "guest" | "beta" | "staff" | "founder">;
  readiness: PlanetReadinessState;
  safetyTruthRules: string[];
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
  ministry?: string;
  workerKind?: "human" | "module" | "agent" | "future";
  automationLevel?: PlanetAutomationLevel;
};

export type PlanetCitizenClassModel = {
  id: string;
  label: string;
  visibility: string[];
  hidden: string[];
  planAccess: string;
  companionLevel: string;
  communityAccess: string;
  academyAccess: string;
  journalCoachAccess: string;
  tradingAccess: string;
  blockedCapabilities: string[];
  upgradePath: string;
  productTruthLanguage: string;
};

export type PlanetResourceCategory =
  | "hidden_internal"
  | "visible"
  | "living"
  | "strategic";

export type PlanetResource = {
  id: string;
  name: string;
  category: PlanetResourceCategory;
  purpose: string;
  protection: string[];
  visibility: "internal" | "public_safe" | "plan_scoped" | "founder_private";
  mustNotDo: string[];
};

export type ConstitutionRule = {
  id: string;
  title: string;
  category: "truth" | "safety" | "legal" | "security" | "launch" | "automation";
  rule: string;
  enforcement: "allow" | "review_required" | "founder_approval_required" | "blocked";
  owner: string;
};

export type CouncilDecision = {
  id: string;
  council: "constitutional" | "legislative" | "executive";
  purpose: string;
  canDo: string[];
  cannotDo: string[];
  escalationRoute: string[];
};

export type MinistryMessageState =
  | "draft"
  | "sent"
  | "in_review"
  | "waiting_for_response"
  | "approved"
  | "rejected"
  | "blocked"
  | "escalated"
  | "resolved"
  | "archived";

export type MinistryMessageType =
  | "status_update"
  | "request"
  | "review_required"
  | "approval_needed"
  | "warning"
  | "incident"
  | "handoff"
  | "blocker"
  | "escalation"
  | "resolution";

export type MinistryMessage = {
  messageId: string;
  sourceMinistry: string;
  targetMinistry: string;
  coordinationCenter: "Founder Presidency / Central Coordination System";
  type: MinistryMessageType;
  priority: "low" | "medium" | "high" | "critical";
  riskLevel: PlanetRiskLevel;
  automationLevel: PlanetAutomationLevel;
  summary: string;
  requestedAction: string;
  guardianReviewRequired: boolean;
  legalReviewRequired: boolean;
  treasuryReviewRequired: boolean;
  engineeringReviewRequired: boolean;
  founderApprovalRequired: boolean;
  status: MinistryMessageState;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

export type MinistryWorkflow = {
  id: string;
  name: string;
  path: string[];
  currentTruth: "architecture_only" | "readiness_only" | "blocked_until_future_stage";
  blockedCapabilities: string[];
  requiredReviews: string[];
  founderApprovalRequired: boolean;
};

export type PresidencyCoordinationDecision = {
  id: string;
  title: string;
  decision: "route_to_review" | "request_revision" | "escalate_to_founder" | "block";
  reason: string;
  nextStep: string;
};

export type GovernanceReport = {
  reportId: string;
  sourceNode: string;
  destinationNode: string;
  hierarchyPath: string[];
  status: MinistryStatus;
  riskLevel: PlanetRiskLevel;
  blockers: string[];
  resources: string[];
  approvalsNeeded: string[];
  legalFlags: string[];
  guardianFlags: string[];
  engineeringFlags: string[];
  citizenImpact: string;
  nextActions: string[];
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
