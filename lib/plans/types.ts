import type { AssistantTierKey } from "@/lib/assistant/tiers";
import type { PlanVisualKey } from "@/lib/plans/visual-identity";

export type PlanId = "demo_free" | "pro" | "vip" | "enterprise";

export type EntitlementTruthState =
  | "active"
  | "locked"
  | "coming_later"
  | "hidden"
  | "blocked";

export type PlanFeatureGroup =
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
  visualIdentity: PlanVisualKey;
  companionLevel: AssistantTierKey;
  truthState: "paper_active" | "planned_locked" | "future_planned";
  allowedFeatures: PlanFeatureState[];
  lockedFeatures: PlanFeatureState[];
  comingLaterFeatures: PlanFeatureState[];
  hiddenFeatures: PlanFeatureState[];
  upgradeExplanation: string;
  safetyRules: string[];
};

export type PlanEntitlementSnapshot = {
  checkedAt: string;
  mode: "plan_entitlement_engine";
  currentPlan: PlanId;
  plans: PlanEntitlementContract[];
  truth: {
    billing: "inactive";
    paidAccess: "not_enabled";
    vipActivation: "not_active";
    enterpriseActivation: "future_planned";
    founderCommandAccess: "owner_only_never_user_plan";
    performanceFee: "hidden_inactive";
  };
};
