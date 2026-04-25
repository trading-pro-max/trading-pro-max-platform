import type { AssistantTierKey } from "@/lib/assistant/tiers";

export type PlanVisualKey = "guest" | "demo_free" | "pro" | "vip" | "enterprise";

export type PlanVisualAvailability =
  | "active"
  | "locked"
  | "coming_later";

export type PlanVisualToken = {
  name: string;
  cssVariable: string;
  darkValue: string;
  lightValue: string;
};

export type PlanVisualIdentity = {
  key: PlanVisualKey;
  label: string;
  shortLabel: string;
  availability: PlanVisualAvailability;
  className: string;
  badgeClassName: string;
  chipClassName: string;
  assistantClassName: string;
  comparisonClassName: string;
  accent: {
    primary: PlanVisualToken;
    secondary: PlanVisualToken;
    metallic: PlanVisualToken;
  };
  tone: string;
  surfaceLanguage: string;
  assistantIdentity: string;
  comparisonSummary: string;
  lockedState: string;
  upgradeState: string;
  comingLaterState: string;
  truthRules: string[];
};

function token(
  name: string,
  cssVariable: string,
  darkValue: string,
  lightValue: string
): PlanVisualToken {
  return { name, cssVariable, darkValue, lightValue };
}

function classes(key: PlanVisualKey) {
  return {
    className: `tpm-plan-${key.replace("_", "-")}`,
    badgeClassName: `tpm-plan-badge tpm-plan-${key.replace("_", "-")}`,
    chipClassName: `tpm-plan-chip tpm-plan-${key.replace("_", "-")}`,
    assistantClassName: `tpm-plan-assistant tpm-plan-${key.replace("_", "-")}`,
    comparisonClassName: `tpm-plan-card tpm-plan-${key.replace("_", "-")}`,
  };
}

export const PLAN_VISUAL_IDENTITIES: Record<PlanVisualKey, PlanVisualIdentity> = {
  guest: {
    key: "guest",
    label: "Guest",
    shortLabel: "Guest",
    availability: "active",
    ...classes("guest"),
    accent: {
      primary: token("Public trust", "--tpm-plan-guest-primary", "#94a3b8", "#334155"),
      secondary: token("Quiet blue", "--tpm-plan-guest-secondary", "#7dd3fc", "#0369a1"),
      metallic: token("Clean graphite", "--tpm-plan-guest-metallic", "#cbd5e1", "#64748b"),
    },
    tone: "Clean public trust identity",
    surfaceLanguage:
      "Minimal brand, safety, and Academy preview cues without plan pressure.",
    assistantIdentity: "Orientation only",
    comparisonSummary:
      "Public entry, brand trust, limited Academy preview, and product truth orientation.",
    lockedState: "Workstation depth, Companion depth, journal, and plan layers require access.",
    upgradeState: "No checkout or billing path is active.",
    comingLaterState: "Guest remains an orientation layer only.",
    truthRules: [
      "No plan pressure.",
      "No paid activation claim.",
      "No Founder Command visibility.",
    ],
  },
  demo_free: {
    key: "demo_free",
    label: "Demo / Free",
    shortLabel: "Demo",
    availability: "active",
    ...classes("demo_free"),
    accent: {
      primary: token("Graphite blue", "--tpm-plan-demo-primary", "#60a5fa", "#2563eb"),
      secondary: token("Learning cyan", "--tpm-plan-demo-secondary", "#2dd4bf", "#0f766e"),
      metallic: token("Cool graphite", "--tpm-plan-demo-metallic", "#94a3b8", "#475569"),
    },
    tone: "Safe learning identity",
    surfaceLanguage:
      "Simplified paper-first surfaces with blue guidance cues and compact blocked truth.",
    assistantIdentity: "Basic Companion",
    comparisonSummary:
      "Onboarding, paper/live/blocked/fallback explanations, feedback help, and settings or diagnostics guidance.",
    lockedState:
      "Advanced coaching, premium insights, strategy review, and performance deep-dives stay locked.",
    upgradeState: "No upgrade action is active because billing remains inactive.",
    comingLaterState: "Future plan paths are visual readiness only.",
    truthRules: [
      "Paper-only truth stays visible.",
      "No paid access is implied.",
      "No live execution or real-money trading is unlocked.",
    ],
  },
  pro: {
    key: "pro",
    label: "Pro",
    shortLabel: "Pro",
    availability: "locked",
    ...classes("pro"),
    accent: {
      primary: token("Professional emerald", "--tpm-plan-pro-primary", "#34d399", "#047857"),
      secondary: token("Silver signal", "--tpm-plan-pro-secondary", "#cbd5e1", "#64748b"),
      metallic: token("Graphite silver", "--tpm-plan-pro-metallic", "#e2e8f0", "#475569"),
    },
    tone: "Professional daily trader identity",
    surfaceLanguage:
      "Sharper workstation preparation for alerts, journal, workspace memory, and preflight context.",
    assistantIdentity: "Pro Assistant",
    comparisonSummary:
      "Richer market context, multi-timeframe summaries, session guidance, journal suggestions, and workflow guidance.",
    lockedState:
      "Pro visuals remain locked until entitlement logic supports active Pro access.",
    upgradeState: "Upgrade state is not enabled because checkout and billing are inactive.",
    comingLaterState: "Pro surfaces are prepared, not activated.",
    truthRules: [
      "No Pro active claim without entitlement.",
      "No better-outcome promise.",
      "No live execution by plan alone.",
    ],
  },
  vip: {
    key: "vip",
    label: "VIP",
    shortLabel: "VIP",
    availability: "locked",
    ...classes("vip"),
    accent: {
      primary: token("Premium gold", "--tpm-plan-vip-primary", "#f4d37a", "#b7791f"),
      secondary: token("Platinum", "--tpm-plan-vip-secondary", "#e5e7eb", "#71717a"),
      metallic: token("Black gold", "--tpm-plan-vip-metallic", "#d8a83c", "#8a5f14"),
    },
    tone: "Elite premium identity",
    surfaceLanguage:
      "Black, gold, and platinum cues for VIP Brain, advanced coaching, and premium reports without visual noise.",
    assistantIdentity: "VIP Brain",
    comparisonSummary:
      "Advanced AI/IQ guidance, deeper performance review, strategy review assistant, journal insights, and VIP diagnostics summaries.",
    lockedState:
      "VIP is not active unless entitlement exists; no premium capability is exposed by styling.",
    upgradeState: "VIP upgrade cannot be activated because billing and checkout remain inactive.",
    comingLaterState: "Early access is only shown where explicitly configured.",
    truthRules: [
      "No guaranteed signals.",
      "No win-rate claims.",
      "No fake premium capability without entitlement.",
    ],
  },
  enterprise: {
    key: "enterprise",
    label: "Enterprise",
    shortLabel: "Ent",
    availability: "coming_later",
    ...classes("enterprise"),
    accent: {
      primary: token("Command navy", "--tpm-plan-enterprise-primary", "#38bdf8", "#0369a1"),
      secondary: token("Audit cyan", "--tpm-plan-enterprise-secondary", "#67e8f9", "#0891b2"),
      metallic: token("Enterprise platinum", "--tpm-plan-enterprise-metallic", "#dbeafe", "#64748b"),
    },
    tone: "Organization-grade control identity",
    surfaceLanguage:
      "Navy, platinum, and cyan direction for team, admin, audit, compliance, and runbook surfaces.",
    assistantIdentity: "Enterprise Assistant later",
    comparisonSummary:
      "Future team/admin summaries, compliance and audit assistant, risk overview, team workspace, and runbook guidance.",
    lockedState:
      "Enterprise is future planned unless an enterprise entitlement path exists.",
    upgradeState: "No enterprise sales or billing path is active.",
    comingLaterState: "Clearly marked future planned only.",
    truthRules: [
      "No enterprise product shipped claim.",
      "No legal or compliance certification claim.",
      "No team/admin access without entitlement.",
    ],
  },
};

export const PLAN_VISUAL_IDENTITY_ORDER: PlanVisualKey[] = [
  "guest",
  "demo_free",
  "pro",
  "vip",
  "enterprise",
];

export function getPlanVisualIdentity(key: PlanVisualKey): PlanVisualIdentity {
  return PLAN_VISUAL_IDENTITIES[key];
}

export function getPlanVisualIdentities(): PlanVisualIdentity[] {
  return PLAN_VISUAL_IDENTITY_ORDER.map((key) => PLAN_VISUAL_IDENTITIES[key]);
}

export function getPlanVisualIdentityForAssistantTier(
  tier: AssistantTierKey
): PlanVisualIdentity {
  if (tier === "demo_paper") return PLAN_VISUAL_IDENTITIES.demo_free;
  return PLAN_VISUAL_IDENTITIES[tier];
}
