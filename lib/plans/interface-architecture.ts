import type { PlanId } from "@/lib/plans/types";
import type { PlanRealmId } from "@/lib/plans/realms";
import type { PlanVisualKey } from "@/lib/plans/visual-identity";

export type PlanInterfaceLayerId =
  | "demo_free"
  | "pro"
  | "vip"
  | "enterprise"
  | "founder_king";

export type PlanInterfaceLayerStatus =
  | "active"
  | "planned_locked"
  | "future"
  | "owner_only";

export type PlanInterfaceLayer = {
  id: PlanInterfaceLayerId;
  realmId: PlanRealmId;
  label: string;
  status: PlanInterfaceLayerStatus;
  visualIdentity: PlanVisualKey;
  headline: string;
  experience: string;
  earthPerspective: string;
  assistantBehavior: string;
  journalCoachDepth: string;
  workspaceBehavior: string;
  reportsCommunityAppsSupport: string;
  surfaceDepth: string;
  primarySurfaces: string[];
  hiddenFromThisLayer: string[];
  safeCopy: string;
  mustNotClaim: string[];
};

export type PlanInterfaceArchitectureSnapshot = {
  checkedAt: string;
  mode: "plan_based_interface_architecture";
  currentUserLayer: PlanId;
  layers: PlanInterfaceLayer[];
  truth: {
    billing: "inactive";
    proActivation: "planned_not_active";
    vipActivation: "planned_not_active";
    institutionalActivation: "future_planned";
    founderCommandUserPlan: false;
    publicLaunch: "inactive";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
  };
};

export const PLAN_INTERFACE_LAYERS: PlanInterfaceLayer[] = [
  {
    id: "demo_free",
    realmId: "free_earth",
    label: "Free",
    status: "active",
    visualIdentity: "demo_free",
    headline: "Familiar premium paper platform",
    experience:
      "A clean chart-first trading terminal with paper execution, basic Assistant guidance, Why Blocked explanations, basic Academy, and subtle Swiss precision signals.",
    earthPerspective: "Earth-native public workspace.",
    assistantBehavior: "Basic platform, blocked-state, Journal/Coach, settings, diagnostics, and learning guidance.",
    journalCoachDepth: "Basic reflection, paper-mode lesson, decision note, and post-session learning.",
    workspaceBehavior: "Active web workspace with active paper execution.",
    reportsCommunityAppsSupport:
      "No premium reports; community planned; Web current; desktop/mobile planned; support readiness active.",
    surfaceDepth: "Moderate TPM advantage without exposing restricted operational detail.",
    primarySurfaces: [
      "chart-first workstation",
      "paper execution ticket",
      "watchlist",
      "basic Assistant",
      "basic Journal/Coach prompts",
      "settings and diagnostics truth",
    ],
    hiddenFromThisLayer: [
      "private controls",
      "internal governance detail",
      "advanced Assistant",
      "advanced reports",
      "private rooms",
      "billing or paid activation",
    ],
    safeCopy:
      "Free is active for paper-safe evaluation. It should feel familiar, premium, and simple.",
    mustNotClaim: [
      "live execution",
      "real money",
      "paid access",
      "Pro or VIP activation",
      "restricted control access",
    ],
  },
  {
    id: "pro",
    realmId: "pro_orbit",
    label: "Pro",
    status: "planned_locked",
    visualIdentity: "pro",
    headline: "Professional intelligent workspace",
    experience:
      "A planned daily-trader layer for stronger Assistant support, deeper Journal/Coach, decision replay, workspace memory, alerts, and workflow guidance.",
    earthPerspective: "Professional orbit over the Free workspace.",
    assistantBehavior: "Professional guidance is planned/locked unless entitlement exists.",
    journalCoachDepth: "Deeper session structure and Decision Replay planned/locked.",
    workspaceBehavior: "Professional workspace tools planned/locked.",
    reportsCommunityAppsSupport:
      "Pro reports, Pro community, workflow alerts, and app depth planned only.",
    surfaceDepth: "Deeper than Free, but only active when real entitlement and safety support exists.",
    primarySurfaces: [
      "Pro Assistant planned",
      "journal depth planned",
      "decision replay planned",
      "workspace memory planned",
      "alerts and workflows planned",
      "Pro community planned",
    ],
    hiddenFromThisLayer: ["private controls", "advanced Assistant", "billing controls", "revenue research"],
    safeCopy:
      "Pro is planned and locked. It can be described as roadmap value, not as active paid access.",
    mustNotClaim: ["Pro active", "checkout active", "premium signal", "better outcome"],
  },
  {
    id: "vip",
    realmId: "vip_lunar",
    label: "VIP",
    status: "planned_locked",
    visualIdentity: "vip",
    headline: "Elite premium workspace layer",
    experience:
      "A planned premium layer for advanced Assistant, advanced coaching, advanced journal analytics, strategy review, premium reports, and private rooms.",
    earthPerspective: "Lunar/deep orbit premium layer.",
    assistantBehavior: "Advanced/premium guidance planned/locked; no signal or profit promise.",
    journalCoachDepth: "Advanced coaching, premium review, and report depth planned/locked.",
    workspaceBehavior: "Elite advanced layer previewed only as planned depth.",
    reportsCommunityAppsSupport:
      "Premium reports, VIP rooms, strategy review, and priority support planned only.",
    surfaceDepth: "Highest user-facing product depth, still separated from private controls.",
    primarySurfaces: [
      "Advanced Assistant planned",
      "advanced Coach planned",
      "advanced Journal planned",
      "strategy review planned",
      "premium reports planned",
      "VIP rooms planned",
    ],
    hiddenFromThisLayer: ["private controls", "critical control gates", "revenue controls"],
    safeCopy:
      "VIP is a planned elite layer. It never implies signal certainty, performance-rate claims, or active premium access.",
    mustNotClaim: ["VIP active", "signal certainty", "performance-rate claim", "priority support active"],
  },
  {
    id: "enterprise",
    realmId: "institutional_station",
    label: "Institutional",
    status: "future",
    visualIdentity: "enterprise",
    headline: "Future institutional team layer",
    experience:
      "A future organization layer for teams, admin, audit, compliance readiness, runbooks, and custom support.",
    earthPerspective: "Formal station/control perspective.",
    assistantBehavior: "Future team/institutional readiness explanation only.",
    journalCoachDepth: "Team review future only.",
    workspaceBehavior: "No team/admin workspace access is active.",
    reportsCommunityAppsSupport:
      "Formal reports, team spaces, app behavior, and custom support future only.",
    surfaceDepth: "Future institutional architecture only; not a public activation path.",
    primarySurfaces: [
      "team admin future",
      "audit future",
      "compliance overview future",
      "runbook support future",
      "Institutional Assistant future",
    ],
    hiddenFromThisLayer: ["private controls", "approval controls", "restricted control data"],
    safeCopy:
      "Institutional remains future planned and unavailable for activation in this build.",
    mustNotClaim: ["Institutional available", "compliance certified", "team admin active"],
  },
  {
    id: "founder_king",
    realmId: "alkon_universe",
    label: "Restricted Controls",
    status: "owner_only",
    visualIdentity: "vip",
    headline: "Restricted controls",
    experience:
      "The private controls layer for readiness, risks, revenue controls, media review, approvals, and next safe actions.",
    earthPerspective: "Private Alkon Universe view.",
    assistantBehavior: "Founder-only private companion; never public Assistant.",
    journalCoachDepth: "Internal management briefing only.",
    workspaceBehavior: "Owner-only read-only command world.",
    reportsCommunityAppsSupport:
      "Full internal reports and readiness summaries remain private and non-executing.",
    surfaceDepth: "Private controls architecture, read-only by default, never a user-plan feature.",
    primarySurfaces: [
      "protected command room",
      "protected app shell",
      "restricted readiness reports",
      "approval center",
      "revenue and media readiness",
      "safety and review summaries",
    ],
    hiddenFromThisLayer: ["public route", "public navigation", "normal user entitlement"],
    safeCopy:
      "Private controls remain separate from Free, Pro, VIP, and Institutional user plans.",
    mustNotClaim: ["public access", "plan unlock", "critical block override"],
  },
];

export function getPlanInterfaceLayer(
  id: PlanInterfaceLayerId
): PlanInterfaceLayer {
  return PLAN_INTERFACE_LAYERS.find((layer) => layer.id === id) ?? PLAN_INTERFACE_LAYERS[0];
}

export function getPlanInterfaceLayerForPlan(planId: PlanId): PlanInterfaceLayer {
  return getPlanInterfaceLayer(planId);
}

export function getUserFacingPlanInterfaceLayers(): PlanInterfaceLayer[] {
  return PLAN_INTERFACE_LAYERS.filter((layer) => layer.id !== "founder_king");
}

export function getPlanInterfaceArchitectureSnapshot(
  checkedAt = new Date().toISOString()
): PlanInterfaceArchitectureSnapshot {
  return {
    checkedAt,
    mode: "plan_based_interface_architecture",
    currentUserLayer: "demo_free",
    layers: PLAN_INTERFACE_LAYERS,
    truth: {
      billing: "inactive",
      proActivation: "planned_not_active",
      vipActivation: "planned_not_active",
      institutionalActivation: "future_planned",
      founderCommandUserPlan: false,
      publicLaunch: "inactive",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    },
  };
}
