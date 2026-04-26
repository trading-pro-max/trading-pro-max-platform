import type { PlanId } from "@/lib/plans/types";
import type { PlanRealm, PlanRealmId, RealmFeature } from "./types";

function realmFeature(
  key: string,
  label: string,
  state: RealmFeature["state"],
  explanation: string
): RealmFeature {
  return { key, label, state, explanation };
}

const privateFounderFeature = realmFeature(
  "alkon_private_universe",
  "Alkon Universe",
  "hidden",
  "Private Founder-only command universe. It is never a public plan, navigation item, entitlement, or upgrade."
);

export const PLAN_REALMS: Record<PlanRealmId, PlanRealm> = {
  free_earth: {
    realmId: "free_earth",
    publicPlanName: "Free",
    realmName: "Free Earth",
    visibility: "public_user",
    activationState: "active",
    visualIdentity: {
      plan: "free",
      palette: "clean graphite, blue, cyan, and realistic Earth tones",
      shapeLanguage: "simple complete globe, familiar workspace, light moon orbit",
      motion: "low",
    },
    earthPerspective:
      "Earth-native perspective: the user starts on the web workspace with a calm, familiar, paper-safe environment.",
    allowedFeatures: [
      realmFeature("web_workspace", "Web workspace", "active", "The browser workspace is active and chart-first."),
      realmFeature("paper_execution", "Paper execution", "active", "Paper ticket flow is active without live routing or real money."),
      realmFeature("basic_assistant", "Basic Pro Max Assistant", "active", "Explains platform state, blocked states, paper mode, settings, diagnostics, and safe learning."),
      realmFeature("basic_journal_coach", "Basic Journal/Coach", "active", "Session readiness, decision notes, and learning reflection are active."),
      realmFeature("basic_academy", "Basic Academy", "active", "Getting started, paper trading basics, chart basics, and Why Blocked are available."),
      realmFeature("basic_support_readiness", "Support readiness", "active", "Help, problem reporting, and security contact language are readiness-only."),
    ],
    lockedFeatures: [
      realmFeature("advanced_reports", "Advanced reports", "locked", "Advanced and premium reports are not part of Free."),
      realmFeature("vip_rooms", "VIP rooms", "locked", "VIP rooms are planned only and not active in Free."),
      realmFeature("premium_assistant", "Advanced Assistant", "locked", "Advanced Assistant depth requires future entitlement support."),
    ],
    plannedFeatures: [
      realmFeature("desktop_mobile_apps", "Desktop and mobile apps", "planned", "Web is current; desktop and mobile packaging remain planned."),
      realmFeature("community_foundation", "Community foundation", "planned", "Learning and feedback spaces are planned without fake members or rooms."),
    ],
    hiddenFeatures: [privateFounderFeature],
    assistantBehavior:
      "Simple, paper-safe daily guidance. It explains what is active, what is blocked, and how to use Journal/Coach without advice or execution.",
    journalCoachDepth:
      "Basic reflection, paper-mode lesson prompts, decision notes, and non-advisory post-session learning.",
    workspaceBehavior:
      "Chart-first web workspace with active paper ticket, watchlist, blocked-state explanations, and low-motion identity.",
    academyDepth: "Basic product learning and Why Blocked education.",
    communityDepth: "Readiness only; no fake active rooms, members, signals, or copy trading.",
    reportsDepth: "Local/session readiness only; no premium reports.",
    appsPlatformsAccess: "Web current; desktop, mobile, and tablet remain planned or future.",
    supportAccess: "Basic readiness language only; no fake ticket backend.",
    safetyBoundaries: [
      "live execution blocked",
      "real money blocked",
      "broker/feed inactive",
      "billing inactive",
      "social publishing inactive",
      "no premium activation claim",
    ],
    upgradeExplanation:
      "Free is complete for paper-safe use. Pro, VIP, and Institutional remain planned or future until entitlement and billing gates exist.",
    productTruthRequirements: [
      "Free must feel complete, not cheap.",
      "No premium gold dominance.",
      "No Founder/private systems in public Free UI.",
      "No live, money, broker/feed, billing, launch, or social activation.",
    ],
  },
  pro_orbit: {
    realmId: "pro_orbit",
    publicPlanName: "Pro",
    realmName: "Pro Orbit",
    visibility: "public_user",
    activationState: "planned",
    visualIdentity: {
      plan: "pro",
      palette: "professional graphite, emerald, and silver",
      shapeLanguage: "technical orbit, precision grid, workstation-safe motion",
      motion: "low",
    },
    earthPerspective:
      "Orbital perspective: professional tools rise above the Free workspace, but remain planned or entitlement-gated.",
    allowedFeatures: [],
    lockedFeatures: [
      realmFeature("professional_workspace", "Professional workspace tools", "locked", "Requires entitlement support before activation."),
      realmFeature("pro_assistant", "Stronger Pro Max Assistant", "locked", "Planned professional guidance is not active without entitlement."),
      realmFeature("journal_depth", "Deeper Journal/Coach", "locked", "Structured session review is planned and locked."),
      realmFeature("decision_replay", "Decision Replay", "locked", "Replay is planned and does not claim alternate outcomes."),
    ],
    plannedFeatures: [
      realmFeature("workflow_alerts", "Alerts and workflows", "planned", "Delivery and workflow memory are planned without live routing."),
      realmFeature("workspace_memory", "Workspace memory", "planned", "Account-safe persistence is planned."),
      realmFeature("pro_community", "Pro community", "planned", "No active community or paid access exists."),
    ],
    hiddenFeatures: [privateFounderFeature],
    assistantBehavior:
      "Explains professional tools as planned or locked unless a future entitlement exists. It must not imply Pro activation.",
    journalCoachDepth:
      "Deeper session structure, Decision Replay, and behavior review are planned/locked.",
    workspaceBehavior:
      "Professional workspace depth is prepared as a planned layer; Free remains the active workspace.",
    academyDepth: "Pro learning paths planned.",
    communityDepth: "Pro community planned only.",
    reportsDepth: "Pro reports planned; no paid reporting access.",
    appsPlatformsAccess: "Uses Web current path; advanced app behavior remains planned.",
    supportAccess: "Standard support concept only; no paid support activation.",
    safetyBoundaries: [
      "no Pro active claim",
      "no checkout",
      "no better-outcome promise",
      "live execution blocked",
      "billing inactive",
    ],
    upgradeExplanation:
      "Pro is a professional planned layer until real entitlement and billing gates are built and reviewed.",
    productTruthRequirements: [
      "Show planned/locked state clearly.",
      "Do not fake Pro activation.",
      "Do not imply live execution, broker/feed, billing, or performance advantage.",
    ],
  },
  vip_lunar: {
    realmId: "vip_lunar",
    publicPlanName: "VIP",
    realmName: "VIP Lunar",
    visibility: "public_user",
    activationState: "planned",
    visualIdentity: {
      plan: "vip",
      palette: "premium black, gold, and platinum",
      shapeLanguage: "lunar/deep orbit, gold edge accents, premium depth",
      motion: "low",
    },
    earthPerspective:
      "Lunar/deep orbit perspective: a premium advanced layer that remains planned or entitlement-gated.",
    allowedFeatures: [],
    lockedFeatures: [
      realmFeature("advanced_assistant", "Advanced Pro Max Assistant", "locked", "VIP Assistant is not active without entitlement and safety gates."),
      realmFeature("advanced_coach", "Advanced Coach", "locked", "Premium coaching remains planned/locked."),
      realmFeature("premium_reports", "Premium reports", "locked", "Premium reports are planned only."),
      realmFeature("strategy_review", "Strategy review", "locked", "Strategy review is not active and cannot promise outcomes."),
    ],
    plannedFeatures: [
      realmFeature("vip_rooms", "VIP Rooms", "planned", "VIP rooms are planned without signals, copy trading, or fake members."),
      realmFeature("priority_support", "Priority support", "planned", "Priority support is planned; no active premium support claim."),
    ],
    hiddenFeatures: [privateFounderFeature],
    assistantBehavior:
      "Explains advanced and premium tools as planned/locked, with no performance promises, signal guarantees, or fake VIP activation.",
    journalCoachDepth:
      "Advanced coaching, premium review, and report-grade reflection are planned/locked.",
    workspaceBehavior:
      "Elite advanced layer is previewed as planned depth; active workspace remains paper-safe Free.",
    academyDepth: "VIP strategy review concepts planned.",
    communityDepth: "VIP rooms planned only; no active room or signal claim.",
    reportsDepth: "Premium reports planned only.",
    appsPlatformsAccess: "No premium app activation; Web remains current.",
    supportAccess: "Priority support planned only.",
    safetyBoundaries: [
      "no signal certainty claims",
      "no performance-rate claims",
      "no performance promises",
      "no VIP active claim",
      "billing inactive",
    ],
    upgradeExplanation:
      "VIP cannot activate until entitlement, billing, safety, support, and review gates exist.",
    productTruthRequirements: [
      "Premium identity may use gold, but must not imply active premium capability.",
      "No signal rooms, copy trading, performance promises, or fake VIP activation.",
    ],
  },
  institutional_station: {
    realmId: "institutional_station",
    publicPlanName: "Institutional",
    realmName: "Institutional Station",
    visibility: "public_user",
    activationState: "future",
    visualIdentity: {
      plan: "institutional",
      palette: "formal navy, platinum, and cyan",
      shapeLanguage: "station/control grid, restrained orbit, official structure",
      motion: "low",
    },
    earthPerspective:
      "Station perspective: future team, admin, audit, and compliance readiness without activation.",
    allowedFeatures: [],
    lockedFeatures: [
      realmFeature("team_admin", "Team/admin access", "locked", "No team admin access is active."),
      realmFeature("audit_reports", "Audit reports", "locked", "Audit reporting is future only."),
      realmFeature("compliance_readiness", "Compliance readiness", "locked", "Readiness can be modeled, but no certification is claimed."),
    ],
    plannedFeatures: [
      realmFeature("institutional_assistant", "Institutional Assistant", "future", "Future team/admin assistant concept only."),
      realmFeature("formal_reports", "Formal reports", "future", "Future formal reporting only."),
    ],
    hiddenFeatures: [privateFounderFeature],
    assistantBehavior:
      "Explains Institutional as future team readiness only. It must not claim team/admin access, compliance certification, or activation.",
    journalCoachDepth: "Team review and runbook guidance are future only.",
    workspaceBehavior:
      "Future institutional station layer only; no public activation or team workspace access.",
    academyDepth: "Team learning future.",
    communityDepth: "Institutional rooms future only.",
    reportsDepth: "Formal team, audit, and compliance reports future only.",
    appsPlatformsAccess: "Future institutional app behavior only.",
    supportAccess: "Custom support future only.",
    safetyBoundaries: [
      "no team/admin access claim",
      "no compliance certification claim",
      "no Institutional activation",
      "billing inactive",
      "public launch inactive",
    ],
    upgradeExplanation:
      "Institutional is future-only and unavailable for activation in this local laptop scope.",
    productTruthRequirements: [
      "Future state must be explicit.",
      "No fake team access, legal status, certification, billing, or institutional activation.",
    ],
  },
  alkon_universe: {
    realmId: "alkon_universe",
    publicPlanName: "Alkon",
    realmName: "Alkon Universe",
    visibility: "private_founder",
    activationState: "internal_only",
    visualIdentity: {
      plan: "founder",
      palette: "private command black, gold, graphite, and red micro-accent",
      shapeLanguage: "private universe command globe, strongest orbit system",
      motion: "command",
    },
    earthPerspective:
      "Private founder universe perspective: full internal command world, owner-only and never a public plan.",
    allowedFeatures: [
      realmFeature("private_command_status", "Private command status", "active", "Read-only internal readiness reporting."),
      realmFeature("public_realm_readiness", "Public realm readiness", "active", "Private summary of Free, Pro, VIP, and Institutional gaps."),
      realmFeature("next_safe_actions", "Next safe actions", "active", "Founder-only safe action suggestions without automatic execution."),
    ],
    lockedFeatures: [
      realmFeature("approval_execution", "Approval execution", "blocked", "Approval execution remains inactive until owner auth, audit, and safety gates exist."),
    ],
    plannedFeatures: [
      realmFeature("owner_device_trust", "Owner device trust", "planned", "Private device trust and step-up confirmation are planned."),
    ],
    hiddenFeatures: [],
    assistantBehavior:
      "Private Founder-only companion may summarize realm gaps and next safe actions. It is never exposed in public Assistant.",
    journalCoachDepth:
      "Internal management briefing and safe summaries only; no public user plan access.",
    workspaceBehavior:
      "Private command world. Read-only by default; no live execution, billing, broker/feed, launch, or social publishing authority.",
    academyDepth: "All public learning readiness can be summarized privately.",
    communityDepth: "All community/VIP readiness can be summarized privately without activating rooms.",
    reportsDepth: "Full internal readiness reports, status-only secrets, and safety review summaries.",
    appsPlatformsAccess: "Private command app concepts planned; no public or native app shipped.",
    supportAccess: "Founder-only operational review.",
    safetyBoundaries: [
      "private founder only",
      "not a public plan",
      "no public navigation",
      "read-only by default",
      "secrets hidden",
      "approval execution inactive",
    ],
    upgradeExplanation:
      "Alkon is not purchasable, not user-facing, and never unlockable through Free, Pro, VIP, or Institutional plans.",
    productTruthRequirements: [
      "Never expose Alkon or private internal command language to normal users.",
      "No uncontrolled automation.",
      "No production secrets, live execution, billing, broker/feed, real money, public launch, or social publishing.",
    ],
  },
};

export const PUBLIC_PLAN_REALM_IDS: PlanRealmId[] = [
  "free_earth",
  "pro_orbit",
  "vip_lunar",
  "institutional_station",
];

export function getPlanRealm(realmId: PlanRealmId): PlanRealm {
  return PLAN_REALMS[realmId];
}

export function getPublicPlanRealms(): PlanRealm[] {
  return PUBLIC_PLAN_REALM_IDS.map((realmId) => PLAN_REALMS[realmId]);
}

export function getPrivateFounderRealm(): PlanRealm {
  return PLAN_REALMS.alkon_universe;
}

export function getPlanRealmForPlanId(planId: PlanId | "guest" | "founder_king"): PlanRealm {
  if (planId === "pro") return PLAN_REALMS.pro_orbit;
  if (planId === "vip") return PLAN_REALMS.vip_lunar;
  if (planId === "enterprise") return PLAN_REALMS.institutional_station;
  if (planId === "founder_king") return PLAN_REALMS.alkon_universe;
  return PLAN_REALMS.free_earth;
}

export function getPlanRealmByPublicName(publicPlanName: PlanRealm["publicPlanName"]): PlanRealm {
  return (
    Object.values(PLAN_REALMS).find((realm) => realm.publicPlanName === publicPlanName) ??
    PLAN_REALMS.free_earth
  );
}
