import type { AssistantTierKey } from "@/lib/assistant/tiers";
import type { PlanRealmId } from "@/lib/plans/realms/types";
import type { PlanVisualKey } from "@/lib/plans/visual-identity";

export type PlanId = "demo_free" | "pro" | "vip" | "enterprise";

export type CitizenClassId =
  | "guest"
  | "demo_free"
  | "pro"
  | "vip"
  | "enterprise"
  | "staff_operator"
  | "founder_king";

export type EntitlementTruthState =
  | "active"
  | "locked"
  | "coming_later"
  | "hidden"
  | "blocked";

export type PlanFeatureGroup =
  | "workspace"
  | "paper_execution"
  | "assistant"
  | "journal"
  | "coach"
  | "alerts"
  | "workspace_memory"
  | "decision_replay"
  | "performance_dashboard"
  | "community"
  | "vip_private_rooms"
  | "academy"
  | "reports"
  | "desktop_mobile"
  | "apps_platforms"
  | "support"
  | "strategy_review"
  | "team_admin"
  | "audit_compliance"
  | "media_content_tools"
  | "founder_command";

export type PlanFeatureState = {
  group: PlanFeatureGroup;
  label: string;
  state: EntitlementTruthState;
  explanation: string;
};

export type PlanEntitlementContract = {
  planId: PlanId;
  planName: string;
  realmId: PlanRealmId;
  realmName: string;
  visualIdentity: PlanVisualKey;
  companionLevel: AssistantTierKey;
  truthState: "paper_active" | "planned_locked" | "future_planned";
  earthPerspective: string;
  assistantBehavior: string;
  journalCoachDepth: string;
  workspaceBehavior: string;
  reportsDepth: string;
  appsPlatformsAccess: string;
  supportAccess: string;
  allowedFeatures: PlanFeatureState[];
  lockedFeatures: PlanFeatureState[];
  comingLaterFeatures: PlanFeatureState[];
  hiddenFeatures: PlanFeatureState[];
  upgradeExplanation: string;
  safetyRules: string[];
};

export type PlanPlanetLayerState = "active" | "planned" | "future" | "owner_only";

export type PlanPlanetAccessLayer = {
  citizenClass: CitizenClassId;
  label: string;
  realmId?: PlanRealmId;
  realmName?: string;
  state: PlanPlanetLayerState;
  planId: PlanId | "none" | "owner_only";
  visibleContinents: string[];
  visibleStates: string[];
  visibleCities: string[];
  companionLevel: string;
  journalCoachLevel: string;
  academyLevel: string;
  communityAccess: string;
  mediaContentAccess: string;
  visualIdentity: PlanVisualKey | "guest";
  activeLayer: string;
  earthPerspective: string;
  workspaceBehavior: string;
  lockedFeatures: string[];
  plannedFeatures: string[];
  hiddenFeatures: string[];
  upgradeExplanation: string;
  safetyBoundaries: string[];
  mustNotShow: string[];
};

export type PlanEntitlementSnapshot = {
  checkedAt: string;
  mode: "plan_entitlement_engine";
  currentPlan: PlanId;
  plans: PlanEntitlementContract[];
  citizenAccess: {
    currentClass: CitizenClassId;
    layers: PlanPlanetAccessLayer[];
    currentLayer: PlanPlanetAccessLayer;
    founderCommandUserVisible: false;
    performanceFeeUserVisible: false;
  };
  truth: {
    billing: "inactive";
    paidAccess: "not_enabled";
    vipActivation: "not_active";
    enterpriseActivation: "future_planned";
    institutionalActivation: "future_planned";
    founderCommandAccess: "owner_only_never_user_plan";
    ownerCommandAccess: "owner_only_never_user_plan";
    performanceFee: "hidden_inactive";
  };
};
