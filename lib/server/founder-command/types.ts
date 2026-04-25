export type FounderRiskLevel = "low" | "medium" | "high" | "critical";

export type FounderActionState =
  | "read_only"
  | "review_required"
  | "founder_approval_required"
  | "blocked";

export type FounderCommandPlatform = "desktop" | "mobile";

export type FounderCommandDeviceTarget =
  | "windows"
  | "macos"
  | "linux"
  | "android"
  | "ios";

export type FounderCommandAccessState =
  | "owner_only_planned"
  | "owner_authenticated"
  | "blocked_unavailable";

export type FounderCommandReadinessState =
  | "active_contract"
  | "planned"
  | "inactive"
  | "blocked"
  | "degraded";

export type FounderApprovalLifecycle =
  | "draft"
  | "pending_guardian_review"
  | "pending_legal_review"
  | "pending_treasury_review"
  | "pending_engineering_review"
  | "reviewed_by_guardian"
  | "reviewed_by_legal"
  | "ready_for_founder"
  | "approved"
  | "rejected"
  | "blocked"
  | "requires_revision"
  | "archived";

export type FounderCommandModuleKey =
  | "planet_overview"
  | "continents_states_map"
  | "ministry_reports"
  | "presidency_coordination"
  | "councils_constitution"
  | "guardian_command"
  | "legal_counsel_command"
  | "media_command"
  | "ai_video_studio_command"
  | "companion_brain_command"
  | "treasury_command"
  | "plan_citizen_classes_command"
  | "community_vip_rooms_command"
  | "academy_journal_coach_command"
  | "engineering_command"
  | "ops_tower_command"
  | "quality_visual_acceptance_command"
  | "rights_brand_command"
  | "islamic_review_command"
  | "founder_approval_queue";

export interface FounderCommandModule {
  key: FounderCommandModuleKey;
  label: string;
  purpose: string;
  dataSource: string;
  platforms: FounderCommandPlatform[];
  readiness: FounderCommandReadinessState;
  riskLevel: FounderRiskLevel;
  actionState: FounderActionState;
  allowedNow: string[];
  plannedLater: string[];
  truth: string;
  blockedActions: string[];
  mustNotFake: string[];
  mobileFriendly: boolean;
}

export interface FounderApprovalItem {
  id: string;
  title: string;
  module: FounderCommandModuleKey;
  lifecycle: FounderApprovalLifecycle;
  riskLevel: FounderRiskLevel;
  actionState: FounderActionState;
  requiredReviews: string[];
  safeNextStep: string;
}

export interface FounderTreasuryControl {
  id: string;
  label: string;
  readiness: FounderCommandReadinessState;
  riskLevel: FounderRiskLevel;
  actionState: FounderActionState;
  currentTruth: string;
  activationRequirements: string[];
}

export interface FounderMediaApproval {
  id: string;
  channel: string;
  contentType: "post" | "campaign" | "ai_video_script" | "announcement";
  lifecycle: FounderApprovalLifecycle;
  riskLevel: FounderRiskLevel;
  currentTruth: string;
}

export interface FounderGuardianAlert {
  id: string;
  category: string;
  riskLevel: FounderRiskLevel;
  actionState: FounderActionState;
  currentTruth: string;
}

export interface FounderLegalReview {
  id: string;
  category: string;
  lifecycle: FounderApprovalLifecycle;
  riskLevel: FounderRiskLevel;
  blockedClaimPatterns: string[];
  safeLanguage: string[];
}

export interface FounderOpsSignal {
  id: string;
  label: string;
  readiness: FounderCommandReadinessState;
  riskLevel: FounderRiskLevel;
  currentTruth: string;
  safeNextStep: string;
}

export interface FounderCommandSnapshot {
  checkedAt: string;
  mode: "founder_command_app_foundation";
  access: {
    state: FounderCommandAccessState;
    publicRouteExposed: false;
    normalUserVisible: false;
    ownerOnly: true;
    readOnlyDefault: true;
  };
  deviceTargets: FounderCommandDeviceTarget[];
  truth: {
    nativeDesktopShipped: false;
    nativeMobileShipped: false;
    liveExecutionEnabled: false;
    realMoneyRoutingEnabled: false;
    brokerActivationFaked: false;
    feedActivationFaked: false;
    billingActivated: false;
    publicLaunchClaimed: false;
    socialAccountsConnected: false;
    secretsExposed: false;
  };
  modules: FounderCommandModule[];
  approvalQueue: FounderApprovalItem[];
  treasury: FounderTreasuryControl[];
  media: FounderMediaApproval[];
  guardian: FounderGuardianAlert[];
  legal: FounderLegalReview[];
  ops: FounderOpsSignal[];
  blockers: string[];
}

export interface FounderOwnerAccessPolicy {
  audience: "founder_king_only";
  ownerOnly: true;
  publicRouteExposed: false;
  publicNavigationVisible: false;
  userPlanAccess: false;
  readOnlyDefault: true;
  ownerDeviceTrust: "planned";
  stepUpConfirmation: "planned";
  auditBackedActions: "planned";
  secretsVisible: false;
}

export interface FounderCommandDeviceBlueprint {
  platform: FounderCommandPlatform;
  purpose: string;
  targetDevices: FounderCommandDeviceTarget[];
  primaryScreens: string[];
  currentState: "foundation_only";
  routeExposed: false;
  nativeAppShipped: false;
  actionExecutionActive: false;
}

export interface FounderCommandSafetySummary {
  approvalExecutionActive: false;
  billingActivationActive: false;
  brokerFeedActivationActive: false;
  liveExecutionActive: false;
  realMoneyRoutingActive: false;
  socialPublishingActive: false;
  publicLaunchActive: false;
  fakeUsersIncluded: false;
  fakeRevenueIncluded: false;
  fakeMetricsIncluded: false;
  secretsExposed: false;
  privateUserDataExposed: false;
}
