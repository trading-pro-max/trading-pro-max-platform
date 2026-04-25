import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getProductTruthSnapshot } from "@/lib/server/product";
import { getProductMemorySummarySnapshot } from "@/lib/server/product-memory";
import { getVisualAcceptanceSnapshot } from "@/lib/server/visual-acceptance";
import type {
  DesignAuthority,
  DesignMinistrySnapshot,
  MinistryPlanIdentity,
  PlatformExperienceRule,
} from "./types";

const forbiddenActivationScope = [
  "launch activation",
  "production activation",
  "live execution",
  "real-money routing",
  "broker/feed activation",
  "billing activation",
  "public Founder Command exposure",
  "fake paid plan activation",
];

const authorities: DesignAuthority[] = [
  {
    key: "design_system",
    label: "Design System Authority",
    mandate:
      "Owns Trading Pro Max layout rhythm, typography, reusable visual tokens, Earth Mark usage, and platform-wide polish.",
    owns: ["brand tokens", "component rhythm", "Earth Mark usage", "dark/light consistency"],
    requiredPartners: ["Product Truth", "Quality", "Brand / Rights"],
    forbiddenActions: forbiddenActivationScope,
  },
  {
    key: "plan_style",
    label: "Plan Style Authority",
    mandate:
      "Keeps Free, Pro, VIP, and Institutional identities distinct without pretending paid access is active.",
    owns: ["plan palettes", "plan surface tone", "locked/planned plan visual truth"],
    requiredPartners: ["Plan Entitlements", "Legal", "Guardian", "Quality"],
    forbiddenActions: ["Founder Command as a user plan", "Enterprise public label", ...forbiddenActivationScope],
  },
  {
    key: "platform_experience",
    label: "Platform Experience Authority",
    mandate:
      "Keeps public web, workstation, future desktop, future mobile, and command surfaces feeling like one product.",
    owns: ["public entry", "Trading Workspace", "settings", "diagnostics", "future app shells"],
    requiredPartners: ["Product Reality", "Visual Acceptance", "Product Memory"],
    forbiddenActions: ["childish UI", "chart clutter", "platform-specific fake shipping claims"],
  },
  {
    key: "motion_state",
    label: "Motion & State Authority",
    mandate:
      "Owns state visuals, reduced-motion safety, blocked/fallback/readiness treatments, and calm identity motion.",
    owns: ["state color semantics", "motion law", "reduced-motion rules", "blocked visual language"],
    requiredPartners: ["Product Truth", "Guardian", "Legal", "Accessibility"],
    forbiddenActions: ["casino motion", "rapid spin", "profit-signaling visuals", ...forbiddenActivationScope],
  },
  {
    key: "visual_quality",
    label: "Visual Quality Authority",
    mandate:
      "Runs visual acceptance expectations and protects chart dominance, spacing discipline, public language, and screenshot evidence.",
    owns: ["visual acceptance", "screenshot proof", "chart dominance", "terminology leakage checks"],
    requiredPartners: ["Quality", "Founder Command", "Product Memory", "Codex Construction"],
    forbiddenActions: ["fake 10/10", "skip Ahmad visual acceptance", "weaken chart/workstation"],
  },
];

const planIdentities: MinistryPlanIdentity[] = [
  {
    key: "free",
    publicLabel: "Free",
    audience: "public",
    palette: "graphite / blue / cyan",
    feel: "familiar, paper-safe, clean, premium",
    state: "active_paper_safe",
    mustFeelLike: ["recognizable trading platform", "simple first journey", "paper-safe learning"],
    mustNotImply: ["paid access", "live execution", "real-money routing"],
  },
  {
    key: "pro",
    publicLabel: "Pro",
    audience: "public",
    palette: "graphite / emerald / silver",
    feel: "professional, intelligent, focused",
    state: "planned_locked",
    mustFeelLike: ["work-focused", "deeper Assistant readiness", "professional workflow direction"],
    mustNotImply: ["active Pro entitlement", "billing active", "better trading outcomes"],
  },
  {
    key: "vip",
    publicLabel: "VIP",
    audience: "public",
    palette: "black / gold / platinum",
    feel: "elite, deep, premium, differentiated",
    state: "planned_locked",
    mustFeelLike: ["premium advanced layer", "calm depth", "high-value future guidance"],
    mustNotImply: ["active VIP access", "guaranteed signals", "win-rate claims"],
  },
  {
    key: "institutional",
    publicLabel: "Institutional",
    audience: "public",
    palette: "navy / platinum / cyan",
    feel: "formal, controlled, team-ready, future",
    state: "future_planned",
    mustFeelLike: ["team-ready later", "controlled", "formal"],
    mustNotImply: ["Enterprise label", "active team/admin access", "compliance certification"],
  },
  {
    key: "founder_command",
    publicLabel: "Founder Command",
    audience: "founder_internal",
    palette: "graphite / gold / subtle Swiss red",
    feel: "private, sovereign, command-style, internal only",
    state: "internal_private",
    mustFeelLike: ["private command center", "dense but controlled", "owner-only"],
    mustNotImply: ["user plan feature", "public navigation", "approval execution active"],
  },
];

const platformExperiences: PlatformExperienceRule[] = [
  {
    key: "web_public",
    label: "Web public",
    currentState: "active",
    designRule:
      "Simple, premium, public-safe entry with small Living Earth Mark and clear Free / Pro / VIP / Institutional truth.",
    chartPriority: "not_applicable",
    motionRule: "Calm identity motion only, reduced-motion safe.",
    forbiddenScope: forbiddenActivationScope,
  },
  {
    key: "web_workstation",
    label: "Web workstation",
    currentState: "active",
    designRule:
      "Chart-first trading workspace with execution clarity, compact Assistant, and quiet plan/readiness labels.",
    chartPriority: "primary",
    motionRule: "No motion that competes with chart or execution.",
    forbiddenScope: forbiddenActivationScope,
  },
  {
    key: "desktop_future",
    label: "Desktop future",
    currentState: "future_planned",
    designRule: "Future desktop shell must preserve chart-first workspace and local safety truth.",
    chartPriority: "primary",
    motionRule: "OS-native restraint; no shipped native app claim.",
    forbiddenScope: ["native app shipped claim", ...forbiddenActivationScope],
  },
  {
    key: "mobile_future",
    label: "Mobile future",
    currentState: "future_planned",
    designRule: "Future mobile must simplify review, learning, settings, and readiness without dense trading overload.",
    chartPriority: "secondary",
    motionRule: "Minimal, battery-light, reduced-motion safe.",
    forbiddenScope: ["mobile app shipped claim", ...forbiddenActivationScope],
  },
  {
    key: "founder_command_desktop_future",
    label: "Founder Command desktop future",
    currentState: "internal_private",
    designRule: "Private command dashboard with graphite/gold density and owner-only readiness.",
    chartPriority: "not_applicable",
    motionRule: "Command motion is stronger than public UI but still precise and calm.",
    forbiddenScope: ["public route exposure", "user plan exposure", ...forbiddenActivationScope],
  },
  {
    key: "founder_command_mobile_future",
    label: "Founder Command mobile future",
    currentState: "internal_private",
    designRule: "Private urgent review cards and briefing surfaces only.",
    chartPriority: "not_applicable",
    motionRule: "Minimal command alerts; no approval execution active.",
    forbiddenScope: ["public route exposure", "approval execution", ...forbiddenActivationScope],
  },
];

export function getDesignMinistrySnapshot(
  checkedAt = new Date().toISOString()
): DesignMinistrySnapshot {
  const visualAcceptance = getVisualAcceptanceSnapshot(checkedAt);
  const productTruth = getProductTruthSnapshot(checkedAt);
  const planEntitlements = getPlanEntitlementSnapshot("demo_free", checkedAt);
  const productMemory = getProductMemorySummarySnapshot(checkedAt);

  return {
    checkedAt,
    mode: "visual_identity_platform_design_ministry",
    status: "ready",
    ministryName: "Ministry of Visual Identity, Plan Experience & Platform Design",
    authorities,
    planIdentities,
    platformExperiences,
    integrations: {
      visualAcceptance: {
        status: visualAcceptance.status,
        averageScoreEstimate: visualAcceptance.averageScoreEstimate,
        humanAcceptanceRequired: visualAcceptance.truth.humanAcceptanceRequired,
      },
      productTruth: {
        liveExecution: productTruth.summary.liveExecution,
        realMoneyRouting: productTruth.summary.realMoneyRouting,
        billing: productTruth.summary.billing,
        publicLaunch: productTruth.summary.publicLaunch,
        socialPublishing: productTruth.summary.socialPublishing,
        founderCommand: productTruth.summary.founderCommand,
      },
      planEntitlements: {
        currentPlan:
          planEntitlements.plans.find(
            (plan) => plan.planId === planEntitlements.currentPlan
          )?.planName ?? "Free",
        publicPlans: ["Free", "Pro", "VIP", "Institutional"],
        paidActivationFaked: false,
      },
      productMemory: {
        openProductGaps: productMemory.founderSummary.openProductGaps.length,
        memorySafetyStatus: productMemory.founderSummary.memorySafetyStatus,
      },
      founderCommand: {
        privateOnly: true,
        publicNavigationVisible: false,
        userPlanFeature: false,
      },
    },
    diagnostics: {
      designMinistryReadiness: "ready",
      planIdentityReadiness: "ready",
      visualGovernanceReadiness: "ready",
      publicLanguageGuarded: true,
    },
    publicLanguage: {
      allowed: [
        "Free",
        "Pro",
        "VIP",
        "Institutional",
        "TPM Assistant",
        "Trading Workspace",
        "Journal",
        "Coach",
        "Academy",
        "Community",
        "Premium Reports",
        "Settings",
        "Diagnostics",
        "Readiness",
      ],
      forbiddenForNormalUsers: [
        "Founder King",
        "Kingdom",
        "ministries",
        "councils",
        "states",
        "presidency",
        "governance",
        "ruler",
      ],
    },
    truth: {
      launchActivated: false,
      productionActivated: false,
      liveExecutionActivated: false,
      realMoneyActivated: false,
      brokerFeedActivated: false,
      billingActivated: false,
      founderCommandPublic: false,
      fakePaidActivation: false,
    },
  };
}
