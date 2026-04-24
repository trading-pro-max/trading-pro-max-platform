import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getProductTruthSnapshot } from "@/lib/server/product/truth";
import { getPlanetBlueprintSnapshot } from "@/lib/server/planet-os/blueprint";
import type { MinistryReport, PlanetRiskLevel } from "@/lib/server/planet-os/types";
import { getFounderCommandReportingSnapshot } from "./reporting";
import type {
  FounderApprovalItem,
  FounderCommandSnapshot,
  FounderGuardianAlert,
  FounderLegalReview,
  FounderMediaApproval,
  FounderTreasuryControl,
} from "./types";

export type FounderCommandAccessSummary = {
  privateOwnerOnly: true;
  publicRouteExposed: false;
  publicNavigationVisible: false;
  normalUserVisible: false;
  userPlanFeature: false;
  ownerAuthState: FounderCommandSnapshot["access"]["state"];
  readOnly: true;
  exposureDecision: string;
};

export type FounderCommandOverview = {
  planetStatus: "operating" | "ready" | "planned" | "blocked" | "degraded";
  activeContinents: number;
  plannedOrFoundationContinents: number;
  ministryCount: number;
  blockedOrPlannedSystems: string[];
  highestRisks: string[];
  productTruthSummary: string[];
  whatNotToDoNow: string[];
  nextSafeActions: string[];
};

export type FounderMinistryCommandCard = {
  ministryId: string;
  ministryName: string;
  leaderTitle: string;
  status: MinistryReport["status"];
  riskLevel: MinistryReport["riskLevel"];
  automationLevel: MinistryReport["automationLevel"];
  blockerCount: number;
  founderDecisionNeeded: boolean;
  compactNextAction: string;
  productTruth: string[];
};

export type FounderCommandRoomApprovalQueue = {
  readOnly: true;
  states: FounderApprovalItem["lifecycle"][];
  categories: string[];
  items: FounderApprovalItem[];
  blockedActions: string[];
};

export type FounderCommandGuardianLegalPanel = {
  guardian: FounderGuardianAlert[];
  legal: FounderLegalReview[];
  safetyBoundaries: string[];
  safeLanguage: string[];
  certificationTruth: string[];
};

export type FounderCommandTreasuryPanel = {
  controls: FounderTreasuryControl[];
  planTruth: ReturnType<typeof getPlanEntitlementSnapshot>["truth"];
  plans: ReturnType<typeof getPlanEntitlementSnapshot>["plans"];
  currentPerformanceFee: "0%";
  futurePerformanceFeeResearchRange: "5%-10%";
  ownerOnlyActivationLater: true;
  visibleToPublicUsers: false;
};

export type FounderCommandMediaVideoPanel = {
  media: FounderMediaApproval[];
  socialAccountsConnected: false;
  externalPublishingActive: false;
  aiVideoPublishingActive: false;
  requiredReviews: string[];
};

export type FounderCommandRoomFoundationSnapshot = {
  checkedAt: string;
  mode: "founder_command_room_foundation";
  access: FounderCommandAccessSummary;
  visualStyle: {
    palette: "graphite_gold_swiss_red";
    tone: "private_precise_command";
    publicSurface: false;
  };
  overview: FounderCommandOverview;
  ministries: FounderMinistryCommandCard[];
  briefing: ReturnType<typeof getFounderCommandReportingSnapshot>["briefing"];
  approvalQueue: FounderCommandRoomApprovalQueue;
  guardianLegal: FounderCommandGuardianLegalPanel;
  treasury: FounderCommandTreasuryPanel;
  mediaVideo: FounderCommandMediaVideoPanel;
  productTruth: ReturnType<typeof getProductTruthSnapshot>;
  security: {
    secretsExposed: false;
    privateUserDataExposed: false;
    fakeUsers: "blocked";
    fakeRevenue: "blocked";
    fakeMetrics: "blocked";
    dangerousActionsRemainBlocked: true;
  };
};

const approvalStates: FounderApprovalItem["lifecycle"][] = [
  "draft",
  "pending_guardian_review",
  "pending_legal_review",
  "ready_for_founder",
  "approved",
  "rejected",
  "blocked",
  "requires_revision",
  "archived",
];

const approvalCategories = [
  "media posts",
  "AI video scripts",
  "Pro/VIP claims",
  "Islamic account wording",
  "launch wording",
  "billing wording",
  "broker/feed wording",
  "public announcements",
  "sensitive assistant capabilities",
  "high-risk community moderation",
  "emergency actions",
  "production/secret actions",
];

function riskWeight(risk: PlanetRiskLevel) {
  return { low: 1, medium: 2, high: 3, critical: 4 }[risk];
}

function summarizeMinistry(report: MinistryReport): FounderMinistryCommandCard {
  return {
    ministryId: report.ministryId,
    ministryName: report.ministryName,
    leaderTitle: report.leaderTitle,
    status: report.status,
    riskLevel: report.riskLevel,
    automationLevel: report.automationLevel,
    blockerCount: report.blockers.length,
    founderDecisionNeeded: report.founderDecisionNeeded,
    compactNextAction:
      report.nextActions[0] ?? "Keep current readiness truth visible.",
    productTruth: [
      `live=${report.productTruth.liveExecution}`,
      `money=${report.productTruth.realMoneyRouting}`,
      `billing=${report.productTruth.billing}`,
      `launch=${report.productTruth.publicLaunch}`,
    ],
  };
}

export function getFounderCommandRoomFoundationSnapshot(
  checkedAt = new Date().toISOString()
): FounderCommandRoomFoundationSnapshot {
  const reporting = getFounderCommandReportingSnapshot(checkedAt);
  const blueprint = getPlanetBlueprintSnapshot(checkedAt);
  const productTruth = getProductTruthSnapshot(checkedAt);
  const planEntitlements = getPlanEntitlementSnapshot("demo_free", checkedAt);
  const readiness = reporting.commandReadiness;

  const activeContinents = blueprint.continents.filter(
    (continent) => continent.readiness === "active"
  ).length;
  const plannedOrFoundationContinents = blueprint.continents.filter(
    (continent) =>
      continent.readiness === "planned" ||
      continent.readiness === "foundation_ready"
  ).length;
  const blockedOrPlannedSystems = Array.from(
    new Set(
      blueprint.continents.flatMap((continent) => [
        ...continent.blocked,
        ...continent.planned.slice(0, 1),
      ])
    )
  ).slice(0, 10);
  const highestRisks = reporting.ministries
    .filter((report) => riskWeight(report.riskLevel) >= 3)
    .map((report) => `${report.ministryName}: ${report.riskLevel}`)
    .slice(0, 8);

  return {
    checkedAt,
    mode: "founder_command_room_foundation",
    access: {
      privateOwnerOnly: true,
      publicRouteExposed: false,
      publicNavigationVisible: false,
      normalUserVisible: false,
      userPlanFeature: false,
      ownerAuthState: readiness.access.state,
      readOnly: true,
      exposureDecision:
        "No public route is exposed until private owner authentication, device trust, and audit gates exist.",
    },
    visualStyle: {
      palette: "graphite_gold_swiss_red",
      tone: "private_precise_command",
      publicSurface: false,
    },
    overview: {
      planetStatus: reporting.briefing.planetStatus,
      activeContinents,
      plannedOrFoundationContinents,
      ministryCount: reporting.ministries.length,
      blockedOrPlannedSystems,
      highestRisks,
      productTruthSummary: productTruth.items
        .filter((item) =>
          ["blocked", "inactive", "not_configured", "planned", "not_certified"].includes(
            item.state
          )
        )
        .slice(0, 8)
        .map((item) => `${item.label}: ${item.state}`),
      whatNotToDoNow: reporting.briefing.whatNotToDoToday,
      nextSafeActions: reporting.briefing.nextSafeActions,
    },
    ministries: reporting.ministries.map(summarizeMinistry),
    briefing: reporting.briefing,
    approvalQueue: {
      readOnly: true,
      states: approvalStates,
      categories: approvalCategories,
      items: readiness.approvalQueue,
      blockedActions: [
        "approval execution",
        "external publishing",
        "billing activation",
        "broker/feed activation",
        "public launch claim",
        "live execution",
        "real-money routing",
      ],
    },
    guardianLegal: {
      guardian: readiness.guardian,
      legal: readiness.legal,
      safetyBoundaries: [
        "low risk may be automated later",
        "medium risk requires review",
        "high risk requires Founder approval",
        "critical risk stays blocked without remediation",
      ],
      safeLanguage: readiness.legal.flatMap((review) => review.safeLanguage),
      certificationTruth: [
        "Legal Counsel is guidance only.",
        "Islamic/Sharia certification is not claimed.",
        "Founder approval cannot make false claims true.",
      ],
    },
    treasury: {
      controls: readiness.treasury,
      planTruth: planEntitlements.truth,
      plans: planEntitlements.plans,
      currentPerformanceFee: "0%",
      futurePerformanceFeeResearchRange: "5%-10%",
      ownerOnlyActivationLater: true,
      visibleToPublicUsers: false,
    },
    mediaVideo: {
      media: readiness.media,
      socialAccountsConnected: false,
      externalPublishingActive: false,
      aiVideoPublishingActive: false,
      requiredReviews: ["Guardian", "Legal", "Founder"],
    },
    productTruth,
    security: {
      secretsExposed: false,
      privateUserDataExposed: false,
      fakeUsers: "blocked",
      fakeRevenue: "blocked",
      fakeMetrics: "blocked",
      dangerousActionsRemainBlocked: true,
    },
  };
}
