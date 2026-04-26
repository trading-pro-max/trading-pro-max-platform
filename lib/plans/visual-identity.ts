import type { AssistantTierKey } from "@/lib/assistant/tiers";
import type { PlanRealmId } from "@/lib/plans/realms";

export type PlanVisualKey = "guest" | "demo_free" | "pro" | "vip" | "enterprise";
export type PublicPlanVisualLabel = "Free" | "Pro" | "VIP" | "Institutional";

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
  realmId?: PlanRealmId | "public_orientation";
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
  earthPerspective: string;
  shapeLanguage: string;
  functionalDepth: string;
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
    realmId: "public_orientation",
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
    earthPerspective: "Public orientation before plan access.",
    shapeLanguage: "Minimal product mark and calm public trust surface.",
    functionalDepth: "Entry, trust, and limited learning preview only.",
    surfaceLanguage:
      "Minimal brand, safety, and Academy preview cues without plan pressure.",
    assistantIdentity: "Orientation only",
    comparisonSummary:
      "Public entry, brand trust, limited Academy preview, and product truth orientation.",
    lockedState: "Workstation depth, Assistant depth, journal, and plan layers require access.",
    upgradeState: "No checkout or billing path is active.",
    comingLaterState: "Guest remains an orientation layer only.",
    truthRules: [
      "No plan pressure.",
      "No paid activation claim.",
      "No restricted controls visibility.",
    ],
  },
  demo_free: {
    key: "demo_free",
    realmId: "free_earth",
    label: "Free",
    shortLabel: "Free",
    availability: "active",
    ...classes("demo_free"),
    accent: {
      primary: token("Graphite blue", "--tpm-plan-demo-primary", "#60a5fa", "#2563eb"),
      secondary: token("Learning cyan", "--tpm-plan-demo-secondary", "#2dd4bf", "#0f766e"),
      metallic: token("Cool graphite", "--tpm-plan-demo-metallic", "#94a3b8", "#475569"),
    },
    tone: "Familiar premium trading identity",
    earthPerspective: "Earth-native starting workspace for paper-safe use.",
    shapeLanguage: "Simple complete globe, realistic continents, light moon orbit, and low motion.",
    functionalDepth: "Web workspace, paper execution, Basic Assistant, Basic Journal/Coach, Academy, Why Blocked, and support readiness.",
    surfaceLanguage:
      "Chart-first paper terminal with basic Assistant, Why Blocked, Academy, and subtle Swiss precision cues.",
    assistantIdentity: "Basic Assistant",
    comparisonSummary:
      "Familiar workstation, paper ticket, watchlist, blocked/fallback explanations, feedback help, and settings or diagnostics guidance.",
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
    realmId: "pro_orbit",
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
    earthPerspective: "Orbital professional layer above the active Free workspace.",
    shapeLanguage: "Emerald/silver precision grid, technical orbit, and workstation-safe motion.",
    functionalDepth: "Professional workspace, stronger Assistant, Journal/Coach depth, Decision Replay, alerts, and workspace memory planned/locked.",
    surfaceLanguage:
      "Professional workspace direction for stronger Assistant, journal depth, decision replay, workspace memory, alerts, and workflows.",
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
    realmId: "vip_lunar",
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
    earthPerspective: "Lunar/deep orbit premium layer that remains planned/locked.",
    shapeLanguage: "Gold continent edges, gold orbit, platinum depth, and premium moon orbit.",
    functionalDepth: "Advanced Assistant, advanced Coach, premium reports, strategy review, VIP rooms, and priority support planned/locked.",
    surfaceLanguage:
      "Black, gold, and platinum cues for the elite premium workspace layer, advanced Assistant, advanced coaching, and premium reports without visual noise.",
    assistantIdentity: "Advanced Assistant",
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
    realmId: "institutional_station",
    label: "Institutional",
    shortLabel: "Inst",
    availability: "coming_later",
    ...classes("enterprise"),
    accent: {
      primary: token("Command navy", "--tpm-plan-enterprise-primary", "#38bdf8", "#0369a1"),
      secondary: token("Audit cyan", "--tpm-plan-enterprise-secondary", "#67e8f9", "#0891b2"),
      metallic: token("Institutional platinum", "--tpm-plan-enterprise-metallic", "#dbeafe", "#64748b"),
    },
    tone: "Organization-grade control identity",
    earthPerspective: "Station/control perspective for future institutional teams.",
    shapeLanguage: "Navy/platinum/cyan formal grid, controlled orbit, and restrained official structure.",
    functionalDepth: "Team/admin, audit, compliance readiness, formal reports, and runbooks future only.",
    surfaceLanguage:
      "Navy, platinum, and cyan direction for team, admin, audit, compliance, and runbook surfaces.",
    assistantIdentity: "Institutional Assistant later",
    comparisonSummary:
      "Future team/admin summaries, compliance and audit assistant, risk overview, team workspace, and runbook guidance.",
    lockedState:
      "Institutional is future planned unless an institutional entitlement path exists.",
    upgradeState: "No institutional sales or billing path is active.",
    comingLaterState: "Clearly marked future planned only.",
    truthRules: [
      "No institutional product shipped claim.",
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

export const PUBLIC_PLAN_VISUAL_LABELS: PublicPlanVisualLabel[] = [
  "Free",
  "Pro",
  "VIP",
  "Institutional",
];

export const PLAN_VISUAL_DNA_SUMMARY = {
  Free: "familiar, paper-safe, clean, and premium",
  Pro: "professional, intelligent, focused, graphite, emerald, and silver",
  VIP: "elite, deep, premium, black, gold, and platinum",
  Institutional: "formal, controlled, team-ready, navy, platinum, and cyan",
  Founder: "internal command identity only, never a public plan",
} as const;

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
