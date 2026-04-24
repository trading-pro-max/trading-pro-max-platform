export type AssistantTierKey = "demo_paper" | "pro" | "vip" | "enterprise";

export type AssistantTierAvailability =
  | "active"
  | "locked"
  | "planned_later";

export type AssistantCapabilityState =
  | "available"
  | "locked"
  | "coming_later";

export type AssistantPlanKey =
  | "evaluation"
  | "pro"
  | "vip"
  | "enterprise"
  | "team_review"
  | "enterprise_guarded";

export type AssistantCapability = {
  key: string;
  label: string;
  state: AssistantCapabilityState;
};

export type AssistantTierContract = {
  tier: AssistantTierKey;
  label: string;
  planLabel: string;
  availability: AssistantTierAvailability;
  currentAccess: boolean;
  summary: string;
  capabilities: AssistantCapability[];
  restrictions: string[];
  unavailableReason: string | null;
  upgradeState: "none" | "not_enabled" | "future_planned";
};

export type AssistantTierSnapshot = {
  current: AssistantTierContract;
  tiers: AssistantTierContract[];
  planMapping: Record<AssistantPlanKey, AssistantTierKey>;
  truth: {
    billing: "inactive";
    paidAccess: "not_enabled";
    vipActivation: "not_active";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerActivation: "blocked";
    feedActivation: "blocked";
    guaranteeClaims: "none";
    winRateClaims: "none";
    manipulativeEngagement: "blocked";
  };
};

function capability(
  key: string,
  label: string,
  state: AssistantCapabilityState
): AssistantCapability {
  return { key, label, state };
}

export const ASSISTANT_PLAN_TIER_MAP: Record<AssistantPlanKey, AssistantTierKey> = {
  evaluation: "demo_paper",
  pro: "pro",
  vip: "vip",
  enterprise: "enterprise",
  team_review: "pro",
  enterprise_guarded: "enterprise",
};

export const ASSISTANT_TIER_CONTRACTS: AssistantTierContract[] = [
  {
    tier: "demo_paper",
    label: "Demo / Paper Assistant",
    planLabel: "Demo / Paper",
    availability: "active",
    currentAccess: true,
    summary:
      "Active for the current evaluation account. Guides onboarding, paper/live/blocked/fallback truth, feedback, settings, and diagnostics.",
    capabilities: [
      capability("onboarding_help", "Onboarding help", "available"),
      capability("blocked_state_explanation", "Paper/live/blocked/fallback explanation", "available"),
      capability("basic_platform_guidance", "Basic platform guidance", "available"),
      capability("basic_market_context", "Basic market context explanation", "available"),
      capability("feedback_drafting", "Feedback drafting", "available"),
      capability("settings_diagnostics_guidance", "Settings and diagnostics guidance", "available"),
      capability("advanced_coaching", "Advanced coaching", "locked"),
      capability("strategy_review", "Strategy review", "locked"),
      capability("performance_deep_dive", "Personalized performance deep-dive", "locked"),
    ],
    restrictions: [
      "No advanced coaching.",
      "No premium insights.",
      "No strategy review.",
      "No personalized performance deep-dive.",
    ],
    unavailableReason: null,
    upgradeState: "none",
  },
  {
    tier: "pro",
    label: "Pro Assistant",
    planLabel: "Pro",
    availability: "locked",
    currentAccess: false,
    summary:
      "Planned Pro tier. Adds richer market context, multi-timeframe summaries, session guidance, workflows, journal suggestions, preflight explanations, and performance context.",
    capabilities: [
      capability("demo_capabilities", "Everything in Demo / Paper", "locked"),
      capability("richer_market_context", "Richer market context", "locked"),
      capability("multi_timeframe_summaries", "Multi-timeframe summaries", "locked"),
      capability("session_guidance", "Session guidance", "locked"),
      capability("workspace_suggestions", "Workspace suggestions", "locked"),
      capability("alert_workflow_guidance", "Alert and workflow guidance", "locked"),
      capability("journal_suggestions", "Journal suggestions", "locked"),
      capability("execution_preflight_explanation", "Execution preflight explanation", "locked"),
      capability("performance_context", "Performance context summaries", "locked"),
      capability("vip_strategy_review", "VIP-only deep strategy review", "locked"),
    ],
    restrictions: [
      "No VIP-only deep strategy review.",
      "No priority support claim unless support exists.",
      "No Pro active claim without entitlement support.",
    ],
    unavailableReason:
      "Pro entitlement and billing activation are not implemented; this tier is a truthful locked plan concept.",
    upgradeState: "not_enabled",
  },
  {
    tier: "vip",
    label: "VIP Assistant",
    planLabel: "VIP",
    availability: "locked",
    currentAccess: false,
    summary:
      "Planned VIP tier. Adds advanced AI/IQ Brain guidance, deeper performance review, strategy review, advanced journaling, memory, premium reports, and VIP diagnostics summaries only when explicitly configured.",
    capabilities: [
      capability("pro_capabilities", "Everything in Pro", "locked"),
      capability("advanced_ai_iq_brain", "Advanced AI/IQ Brain guidance", "locked"),
      capability("deeper_performance_review", "Deeper performance review", "locked"),
      capability("strategy_review_assistant", "Strategy review assistant", "locked"),
      capability("advanced_journaling", "Advanced journaling insights", "locked"),
      capability("personalized_workflow_memory", "Personalized workflow memory", "locked"),
      capability("premium_reports", "Premium reports", "locked"),
      capability("vip_diagnostics", "VIP readiness and diagnostics summaries", "locked"),
      capability("early_access", "Early-access assistant capabilities", "coming_later"),
    ],
    restrictions: [
      "No guaranteed signals.",
      "No win-rate claims.",
      "No live execution.",
      "No real-money activation.",
      "No broker/feed activation.",
      "No fake premium capability if entitlement is not active.",
    ],
    unavailableReason:
      "VIP entitlement is not active; billing, checkout, and premium capability activation remain inactive.",
    upgradeState: "not_enabled",
  },
  {
    tier: "enterprise",
    label: "Enterprise Assistant",
    planLabel: "Enterprise later",
    availability: "planned_later",
    currentAccess: false,
    summary:
      "Future enterprise-only concept for team/admin summaries, compliance and audit assistance, risk overview, team workspace support, and runbook guidance.",
    capabilities: [
      capability("team_admin_summaries", "Team and admin summaries", "coming_later"),
      capability("compliance_audit_assistant", "Compliance and audit assistant", "coming_later"),
      capability("risk_overview", "Risk overview", "coming_later"),
      capability("team_workspace_support", "Team workspace support", "coming_later"),
      capability("enterprise_runbooks", "Enterprise runbook guidance", "coming_later"),
    ],
    restrictions: [
      "Future planned only unless enterprise entitlement exists.",
      "No enterprise availability claim.",
      "No legal compliance certification.",
    ],
    unavailableReason:
      "Enterprise assistant is future planned only and has no active entitlement path.",
    upgradeState: "future_planned",
  },
];

export function getAssistantTierContract(tier: AssistantTierKey): AssistantTierContract {
  return (
    ASSISTANT_TIER_CONTRACTS.find((contract) => contract.tier === tier) ??
    ASSISTANT_TIER_CONTRACTS[0]
  );
}

export function getAssistantTierForPlan(plan: AssistantPlanKey | string): AssistantTierContract {
  const mappedTier =
    ASSISTANT_PLAN_TIER_MAP[plan as AssistantPlanKey] ?? "demo_paper";
  const contract = getAssistantTierContract(mappedTier);

  if (contract.tier === "demo_paper") return contract;

  return {
    ...contract,
    availability: contract.tier === "enterprise" ? "planned_later" : "locked",
    currentAccess: false,
  };
}

export function getAssistantTierSnapshot(
  plan: AssistantPlanKey | string = "evaluation"
): AssistantTierSnapshot {
  return {
    current: getAssistantTierForPlan(plan),
    tiers: ASSISTANT_TIER_CONTRACTS,
    planMapping: ASSISTANT_PLAN_TIER_MAP,
    truth: {
      billing: "inactive",
      paidAccess: "not_enabled",
      vipActivation: "not_active",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked",
      feedActivation: "blocked",
      guaranteeClaims: "none",
      winRateClaims: "none",
      manipulativeEngagement: "blocked",
    },
  };
}
