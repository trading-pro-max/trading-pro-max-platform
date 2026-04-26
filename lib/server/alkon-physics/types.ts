import "server-only";

export type CosmicEnergy =
  | "founder_vision"
  | "founder_feedback"
  | "user_public_gap"
  | "product_truth_conflict"
  | "validation_failure"
  | "visual_rejection"
  | "security_alert"
  | "memory_lesson"
  | "local_day_signal"
  | "codex_result";

export type GravityPriority =
  | "P0_critical_gravity"
  | "P1_high_gravity"
  | "P2_standard_gravity"
  | "P3_future_gravity"
  | "blocked_gravity"
  | "black_hole_forbidden";

export type OrbitPath =
  | "public_ui_orbit"
  | "visual_identity_orbit"
  | "chart_workspace_orbit"
  | "assistant_orbit"
  | "journal_coach_orbit"
  | "plans_realms_orbit"
  | "apps_support_orbit"
  | "security_orbit"
  | "secrets_orbit"
  | "codex_construction_orbit"
  | "media_world_interface_orbit"
  | "memory_orbit"
  | "local_day_orbit"
  | "launch_forbidden_orbit";

export type CosmicStatus =
  | "detected"
  | "energized"
  | "gravity_assigned"
  | "orbit_assigned"
  | "planet_assigned"
  | "satellite_monitoring"
  | "station_assigned"
  | "worker_assigned"
  | "passport_required"
  | "passport_ready"
  | "permit_required"
  | "codex_ready"
  | "validation_required"
  | "tribunal_pending"
  | "memory_pending"
  | "reported"
  | "closed"
  | "blocked"
  | "black_holed";

export type CosmicEventType =
  | "logo_rejected"
  | "chart_annoying"
  | "public_ui_crowded"
  | "internal_term_leaked"
  | "secret_risk"
  | "billing_requested"
  | "live_execution_requested"
  | "codex_task_needed"
  | "local_day_report_needed"
  | "support_missing"
  | "world_interface_request"
  | "generic_founder_idea";

export type CosmicRiskLevel = "low" | "medium" | "high" | "critical";

export type PlanetSystemOwnerId =
  | "earth_public_world"
  | "moon_cycle_system"
  | "orbit_command"
  | "solar_command"
  | "visual_identity_planet"
  | "trading_workspace_planet"
  | "assistant_planet"
  | "journal_coach_planet"
  | "plans_realm_planet"
  | "apps_support_planet"
  | "academy_community_planet"
  | "world_interface_planet"
  | "media_planet"
  | "treasury_readiness_planet"
  | "defense_universe"
  | "secrets_authority"
  | "construction_universe"
  | "memory_universe"
  | "diagnostics_satellite_network"
  | "alkon_founder_command";

export type SatelliteMonitorId =
  | "public_ui_satellite"
  | "logo_satellite"
  | "chart_satellite"
  | "workstation_satellite"
  | "assistant_satellite"
  | "product_truth_satellite"
  | "public_boundary_satellite"
  | "security_satellite"
  | "secrets_satellite"
  | "validation_satellite"
  | "screenshot_satellite"
  | "memory_satellite"
  | "world_interface_satellite"
  | "local_day_satellite";

export type OperatingStationId =
  | "design_station"
  | "chart_station"
  | "public_ux_station"
  | "assistant_station"
  | "plan_realm_station"
  | "support_station"
  | "world_interface_station"
  | "security_station"
  | "secrets_station"
  | "codex_station"
  | "tribunal_station"
  | "memory_station"
  | "diagnostics_station"
  | "founder_review_station";

export type CosmicWorkerId =
  | "logo_identity_worker"
  | "chart_comfort_worker"
  | "public_copy_worker"
  | "public_navigation_worker"
  | "apps_platforms_worker"
  | "support_readiness_worker"
  | "markets_worker"
  | "academy_worker"
  | "community_worker"
  | "tpm_assistant_worker"
  | "journal_coach_worker"
  | "plan_realm_worker"
  | "security_gate_worker"
  | "secrets_safety_worker"
  | "codex_passport_worker"
  | "codex_prompt_worker"
  | "result_tribunal_worker"
  | "memory_lesson_worker"
  | "diagnostics_worker"
  | "alkon_report_worker";

export type CosmicEventInput = {
  source: string;
  title: string;
  description?: string;
  requestedAction?: string;
};

export type CosmicEvent = {
  eventId: string;
  type: CosmicEventType;
  source: string;
  title: string;
  description: string;
  energy: CosmicEnergy;
  gravityPriority: GravityPriority;
  orbitPath: OrbitPath;
  secondaryOrbitPaths: OrbitPath[];
  suggestedPlanetOwner: PlanetSystemOwnerId;
  suggestedMonitors: SatelliteMonitorId[];
  suggestedStation: OperatingStationId;
  suggestedWorker: CosmicWorkerId;
  riskLevel: CosmicRiskLevel;
  publicVisible: false;
  founderVisible: true;
  createdAt: string;
};

export type GravityAssignment = {
  priority: GravityPriority;
  reason: string;
  escalationTarget: string;
  allowedNextState: CosmicStatus;
  reviewRequired: boolean;
  blockedReason?: string;
};

export type OrbitDefinition = {
  orbitPath: OrbitPath;
  purpose: string;
  allowedEvents: CosmicEventType[];
  forbiddenEvents: CosmicEventType[];
  ownerPlanets: PlanetSystemOwnerId[];
  satellites: SatelliteMonitorId[];
  stations: OperatingStationId[];
  requiredReviews: string[];
  validation: string[];
  memoryUpdate: string;
};

export type PlanetSystemOwner = {
  id: PlanetSystemOwnerId;
  name: string;
  ownsSurfaces: string[];
  ownsEventTypes: CosmicEventType[];
  workers: CosmicWorkerId[];
  stations: OperatingStationId[];
  forbiddenScope: string[];
  reportsToAlkon: true;
};

export type SatelliteMonitor = {
  id: SatelliteMonitorId;
  name: string;
  monitors: string[];
  detectsSignals: string[];
  requiredEvidence: string[];
  reportingTarget: string;
  validationRule: string;
};

export type OperatingStation = {
  id: OperatingStationId;
  name: string;
  purpose: string;
  allowedOrbits: OrbitPath[];
  requiredInputs: string[];
  outputs: string[];
  forbiddenActions: string[];
};

export type CosmicWorker = {
  id: CosmicWorkerId;
  name: string;
  allowedTasks: string[];
  forbiddenTasks: string[];
  allowedFilesOrSurfaces: string[];
  forbiddenFilesOrSurfaces: string[];
  requiredReviews: string[];
  validationRequirements: string[];
  reportTarget: string;
  memoryRule: string;
};

export type CosmicDependency = {
  dependencyId: string;
  orbitPath: OrbitPath;
  title: string;
  requiredBefore: string;
  status: "ready" | "review_required" | "blocked";
};

export type CosmicHandoff = {
  handoffId: string;
  from: string;
  to: string;
  requiredPayload: string[];
  safetyGate: string;
};

export type CosmicValidation = {
  validationId: string;
  status: "required" | "blocked" | "passed";
  commands: string[];
  evidenceRequired: string[];
  publicBoundaryCheckRequired: true;
  productTruthCheckRequired: true;
  noSecretsCheckRequired: true;
};

export type CosmicTribunalResult = {
  tribunalId: string;
  status: "pending" | "blocked" | "accepted" | "needs_fix";
  decision: "accept_after_validation" | "needs_fix" | "blocked" | "black_holed";
  reasons: string[];
  founderReviewRequired: boolean;
};

export type CosmicMemoryUpdate = {
  memoryId: string;
  status: "pending" | "ready" | "blocked";
  acceptedPattern: string;
  rejectedPattern: string;
  repeatedVisualIssue: string;
  noImagesRule: string;
  publicPrivateBoundaryLesson: string;
  alkonOnlyRule: string;
  chartComfortLesson: string;
  logoCorrectionLesson: string;
  taskDistributionLesson: string;
  containsSecrets: false;
  containsPrivateSensitiveData: false;
};

export type CosmicFounderReport = {
  reportId: string;
  eventId: string;
  gravity: GravityPriority;
  orbit: OrbitPath;
  planetOwner: PlanetSystemOwnerId;
  worker: CosmicWorkerId;
  status: CosmicStatus;
  blockedReason: string | null;
  nextAction: string;
  validationRequired: boolean;
  founderReviewRequired: boolean;
  memoryLesson: string;
  publicExposure: false;
};

export type CosmicSubtask = {
  subtaskId: string;
  title: string;
  ownerWorker: CosmicWorkerId;
  status: CosmicStatus;
  validationRequired: boolean;
};

export type CosmicTaskPassport = {
  passportId: string;
  status: "ready" | "required" | "blocked";
  allowedScope: string[];
  forbiddenScope: string[];
  validationRequired: string[];
  publicLanguageRule: string;
};

export type CosmicCodexLicense = {
  licenseId: string;
  status: "draft_ready" | "blocked" | "review_required";
  permitted: boolean;
  reason: string;
  noWebAppExecution: true;
  noSecretsAllowed: true;
};

export type CosmicTask = {
  taskId: string;
  status: CosmicStatus;
  event: CosmicEvent;
  gravity: GravityAssignment;
  orbit: OrbitDefinition;
  planetOwner: PlanetSystemOwner;
  satelliteMonitors: SatelliteMonitor[];
  station: OperatingStation;
  worker: CosmicWorker;
  subtasks: CosmicSubtask[];
  dependencies: CosmicDependency[];
  handoffs: CosmicHandoff[];
  taskPassport: CosmicTaskPassport;
  codexLicense: CosmicCodexLicense;
  validation: CosmicValidation;
  tribunal: CosmicTribunalResult;
  memoryUpdate: CosmicMemoryUpdate;
  founderReport: CosmicFounderReport;
  nextActions: string[];
  blockedReason: string | null;
};

export type RiskZoneDecision = {
  zone: "clear_path" | "risk_belt" | "black_hole_zone";
  status: "allowed" | "review_required" | "blocked";
  reason: string;
  safeAlternative: string;
  incidentReportRequired: boolean;
};

export type LifecycleValidation = {
  allowed: boolean;
  from: CosmicStatus;
  to: CosmicStatus;
  reason: string;
};

export type AlkonCosmicPhysicsSnapshot = {
  snapshotId: "alkon_cosmic_operating_physics";
  name: "Alkon Cosmic Operating Physics";
  arabicName: "ط§ظ„ظƒظˆظ†";
  visibility: "private_founder_only";
  publicExposure: false;
  publicApiRoutesExposed: false;
  founderReadinessRoute: "/api/founder/alkon-physics/readiness";
  cosmicDoctrineStatus: "ready";
  eventClassifierStatus: "ready";
  gravitySystemStatus: "ready";
  orbitRouterStatus: "ready";
  planetOwnersStatus: "ready";
  satelliteNetworkStatus: "ready";
  stationNetworkStatus: "ready";
  workerRegistryStatus: "ready";
  riskBeltStatus: "ready";
  blackHoleZoneStatus: "ready";
  taskGraphStatus: "ready";
  lifecycleStatus: "ready";
  memoryReportingStatus: "ready";
  registrySummary: {
    orbitPaths: number;
    planetOwners: number;
    satellites: number;
    stations: number;
    workers: number;
    riskRules: number;
    blackHoleRules: number;
  };
  requiredCoreLaw: string[];
  lifecycleChain: CosmicStatus[];
  blockedLifecycleRules: string[];
  handoffChain: CosmicHandoff[];
  sampleEvents: CosmicEvent[];
  sampleTaskGraphs: CosmicTask[];
  nextSafeActions: string[];
  whatNotToAutomate: string[];
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    productionSecretsUntouched: true;
    socialPublishingInactive: true;
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noPublicAlkonExposure: true;
    noImagesOrRasterAssets: true;
    overall: "preserved";
  };
  createdAt: string;
};
