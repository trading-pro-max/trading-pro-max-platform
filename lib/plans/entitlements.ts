import type {
  PlanEntitlementContract,
  PlanEntitlementSnapshot,
  PlanFeatureGroup,
  PlanFeatureState,
  PlanId,
} from "@/lib/plans/types";

function feature(
  group: PlanFeatureGroup,
  label: string,
  state: PlanFeatureState["state"],
  explanation: string
): PlanFeatureState {
  return { group, label, state, explanation };
}

const founderCommandHidden = feature(
  "founder_command",
  "Founder Command access",
  "hidden",
  "Founder Command is owner-only and is never part of Free, Pro, VIP, or Enterprise user plans."
);

export const PLAN_ENTITLEMENTS: PlanEntitlementContract[] = [
  {
    planId: "demo_free",
    planName: "Demo / Free",
    visualIdentity: "demo_free",
    companionLevel: "demo_paper",
    truthState: "paper_active",
    allowedFeatures: [
      feature("assistant", "Demo / Paper Assistant", "active", "Basic platform, blocked-state, feedback, settings, and diagnostics guidance."),
      feature("academy", "Basic Academy", "active", "Safe paper-first learning and glossary readiness."),
      feature("workspace_memory", "Local workspace preferences", "active", "Local/backend-safe preference continuity without paid entitlement."),
    ],
    lockedFeatures: [
      feature("coach", "Advanced Coach", "locked", "Requires future Pro/VIP entitlement support."),
      feature("performance_dashboard", "Performance dashboard", "locked", "No premium analytics are active in Demo."),
      feature("vip_private_rooms", "VIP private rooms", "locked", "VIP rooms are planned and not active."),
    ],
    comingLaterFeatures: [
      feature("journal", "Journal expansion", "coming_later", "Journal intelligence is planned and must avoid financial advice."),
      feature("alerts", "Alert/workflow guidance", "coming_later", "Delivery remains unconfigured until real delivery exists."),
    ],
    hiddenFeatures: [founderCommandHidden],
    upgradeExplanation: "No upgrade flow is active because billing and checkout are inactive.",
    safetyRules: ["paper-only truth visible", "no paid activation claim", "no live execution by plan"],
  },
  {
    planId: "pro",
    planName: "Pro",
    visualIdentity: "pro",
    companionLevel: "pro",
    truthState: "planned_locked",
    allowedFeatures: [],
    lockedFeatures: [
      feature("assistant", "Pro Assistant", "locked", "Requires real Pro entitlement logic; no billing is active."),
      feature("journal", "Journal suggestions", "locked", "Planned for Pro but not unlocked."),
      feature("alerts", "Alert/workflow guidance", "locked", "Delivery and entitlement remain unconfigured."),
      feature("decision_replay", "Decision replay basic", "locked", "Prepared as concept only."),
    ],
    comingLaterFeatures: [
      feature("community", "Pro community", "coming_later", "No community product is active."),
      feature("reports", "Pro reports", "coming_later", "No paid report access exists."),
    ],
    hiddenFeatures: [founderCommandHidden],
    upgradeExplanation: "Pro is a planned tier; checkout, billing, and entitlement activation are inactive.",
    safetyRules: ["no Pro active claim", "no better-outcome promise", "no live execution by plan"],
  },
  {
    planId: "vip",
    planName: "VIP",
    visualIdentity: "vip",
    companionLevel: "vip",
    truthState: "planned_locked",
    allowedFeatures: [],
    lockedFeatures: [
      feature("assistant", "VIP Brain", "locked", "VIP entitlement is not active."),
      feature("coach", "Advanced coaching", "locked", "No premium coaching access exists."),
      feature("performance_dashboard", "Deep performance review", "locked", "No personalized deep-dive is active."),
      feature("vip_private_rooms", "VIP private rooms", "locked", "Rooms are future planned with Guardian/Legal moderation required."),
    ],
    comingLaterFeatures: [
      feature("reports", "Premium reports", "coming_later", "Future planned only."),
      feature("decision_replay", "Advanced decision replay", "coming_later", "Requires entitlement, safety, and review support."),
    ],
    hiddenFeatures: [founderCommandHidden],
    upgradeExplanation: "VIP is planned only; no paid access, premium activation, or VIP results claim exists.",
    safetyRules: ["no guaranteed signals", "no win-rate claims", "no fake premium capability"],
  },
  {
    planId: "enterprise",
    planName: "Enterprise later",
    visualIdentity: "enterprise",
    companionLevel: "enterprise",
    truthState: "future_planned",
    allowedFeatures: [],
    lockedFeatures: [
      feature("desktop_mobile", "Team/device administration", "locked", "Enterprise product is not available."),
      feature("reports", "Compliance/audit reports", "locked", "No legal compliance certification is claimed."),
    ],
    comingLaterFeatures: [
      feature("assistant", "Enterprise Assistant", "coming_later", "Future team/admin assistant concept only."),
      feature("community", "Enterprise rooms", "coming_later", "No enterprise community exists."),
    ],
    hiddenFeatures: [
      founderCommandHidden,
      feature("media_content_tools", "Performance-fee tooling", "hidden", "Performance-fee research is hidden/inactive and not user-facing."),
    ],
    upgradeExplanation: "Enterprise remains future planned; no sales, checkout, or account activation path is active.",
    safetyRules: ["no Enterprise active claim", "no team/admin access without entitlement", "no compliance certification claim"],
  },
];

export function getPlanEntitlementContract(planId: PlanId | string) {
  return (
    PLAN_ENTITLEMENTS.find((plan) => plan.planId === planId) ??
    PLAN_ENTITLEMENTS[0]
  );
}

export function getPlanEntitlementSnapshot(
  currentPlan: PlanId | string = "demo_free",
  checkedAt = new Date().toISOString()
): PlanEntitlementSnapshot {
  const current = getPlanEntitlementContract(currentPlan);

  return {
    checkedAt,
    mode: "plan_entitlement_engine",
    currentPlan: current.planId,
    plans: PLAN_ENTITLEMENTS,
    truth: {
      billing: "inactive",
      paidAccess: "not_enabled",
      vipActivation: "not_active",
      enterpriseActivation: "future_planned",
      founderCommandAccess: "owner_only_never_user_plan",
      performanceFee: "hidden_inactive",
    },
  };
}
