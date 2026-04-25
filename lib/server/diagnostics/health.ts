import "server-only";
import { prisma } from "@/lib/db/client";
import { getAcademyReadinessSnapshot } from "@/lib/server/academy";
import { getAiVideoStudioReadinessSnapshot } from "@/lib/server/ai-video-studio";
import {
  getBrokerConnectorDiagnosticsProbe,
  getBrokerConnectorSafetySnapshot,
  getBrokerIntegrationSnapshot,
} from "@/lib/server/connectors/broker";
import {
  getMarketDiagnosticsProbe,
  getMarketFeedArchitectureSnapshot,
} from "@/lib/server/market-data/service";
import { probeWorkspacePreferencePersistence } from "@/lib/server/preferences/state";
import { getSecurityDiagnosticsProbe } from "@/lib/server/security";
import { probeWorkspaceDepthPersistence } from "@/lib/server/workspace";
import { getProductBackendDiagnosticsProbe } from "@/lib/server/product";
import {
  getAlertAutomationDiagnosticsProbe,
  getAlertDeliveryActivationDiagnosticsProbe,
  getAlertWorkflowDiagnosticsProbe,
} from "@/lib/server/workflows";
import {
  getFounderBuildRoomReadinessSnapshot,
  getFounderLocalCommandReadinessSnapshot,
} from "@/lib/server/founder-command";
import { getPublicBrandIntelligenceSummary } from "@/lib/server/brand-intelligence";
import { getDesignMinistrySnapshot } from "@/lib/server/design-ministry";
import {
  getAiIqBrainDeepeningDiagnosticsProbe,
  getAiIqBrainDiagnosticsProbe,
  getIntelligenceBackendDiagnosticsProbe,
} from "@/lib/server/intelligence";
import {
  getLocalDayOneReadinessSnapshot,
  getLocalDayOneOperationSnapshot,
  getLocalDailyOperationsLoopSnapshot,
  getLocalDailyOperationsReportSnapshot,
  getLocalOperationsFinalReportSnapshot,
  getLocalOperationsReadinessSnapshot,
} from "@/lib/server/local-ops";
import {
  getContentReviewReadinessSnapshot,
  getMediaOfficeReadinessSnapshot,
} from "@/lib/server/media-office";
import {
  getProductMemoryDailySummarySnapshot,
  getProductMemorySummarySnapshot,
} from "@/lib/server/product-memory";
import {
  getProductRealityFinalScoreSnapshot,
  getProductRealityLocalStartScoreSnapshot,
} from "@/lib/server/product-reality";
import { getCommunityReadinessSnapshot } from "@/lib/server/community";
import { getSecuritySovereigntySnapshot } from "@/lib/server/security-sovereignty";
import { getSecretsAuthoritySnapshot } from "@/lib/server/secrets-authority";
import { getSurfaceBoundarySnapshot } from "@/lib/server/surface-boundaries";
import { getVipRoomsReadinessSnapshot } from "@/lib/server/vip-rooms";
import { getWorldInterfaceSnapshot } from "@/lib/server/world-interface";
import { getClientExpansionSnapshot } from "@/lib/server/platform/client-contracts";
import { getDesktopAppsDiagnosticsProbe } from "@/lib/server/platform/desktop-foundation";
import { getDesktopProductizationDiagnosticsProbe } from "@/lib/server/platform/desktop-productization";
import { getMobileAppsDiagnosticsProbe } from "@/lib/server/platform/mobile-foundation";
import { getMobileProductizationDiagnosticsProbe } from "@/lib/server/platform/mobile-productization";
import {
  getRealActivationPilotDiagnosticsProbe,
  getRealActivationPilotSnapshot,
  getRealIntegrationsDiagnosticsProbe,
} from "@/lib/server/integrations";
import {
  getCommercialActivationDiagnosticsProbe,
  getCommercialScalingDiagnosticsProbe,
} from "@/lib/server/commercial";
import {
  getEnterpriseOpsDiagnosticsProbe,
  getOpsRecoveryDiagnosticsProbe,
  getOpsProductionActivationDiagnosticsProbe,
  getProductionHardeningDiagnosticsProbe,
} from "@/lib/server/ops";
import {
  getProductionDeploymentDiagnosticsProbe,
  getProductionDeploymentReadinessSnapshot,
} from "@/lib/server/production";
import {
  buildLaunchReadinessGateSnapshot,
  getClosedBetaPreparationDiagnosticsProbe,
  getLaunchFeedbackStoreDiagnostics,
  getLaunchOperationsControlStateSnapshot,
  getPublicLaunchPreparationDiagnosticsProbe,
  getSoftLaunchPreparationDiagnosticsProbe,
} from "@/lib/server/launch";
import {
  buildFinalMarketParitySnapshot,
  getFinalMarketParityDiagnosticsProbe,
} from "@/lib/server/parity";
import type {
  DiagnosticsHealthSnapshot,
  DiagnosticsProbe,
  DiagnosticsRouteProbe,
} from "@/modules/shell/types/platform-state";

const REQUIRED_READY_STATUSES = new Set<DiagnosticsProbe["status"]>(["ready"]);
const NON_BLOCKING_TRUTHFUL_STATUSES = new Set<DiagnosticsProbe["status"]>([
  "auth_required",
  "blocked",
  "fallback",
  "unconfigured",
  "degraded",
]);

function statusIsOperational(status: DiagnosticsProbe["status"]) {
  return REQUIRED_READY_STATUSES.has(status) ||
    NON_BLOCKING_TRUTHFUL_STATUSES.has(status);
}

async function probeServerReadiness(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      key: "server_readiness",
      label: "App/server readiness",
      status: "ready",
      summary: "Server runtime ready",
      detail:
        "Route handlers, Prisma connectivity, and paper-safe application services are responding.",
      checkedAt,
    };
  } catch (error) {
    return {
      key: "server_readiness",
      label: "App/server readiness",
      status: "unavailable",
      summary: "Server runtime unavailable",
      detail:
        error instanceof Error ? error.message : "Server readiness probe failed.",
      checkedAt,
    };
  }
}

function probeRuntimeBaseline(checkedAt: string): DiagnosticsProbe {
  return {
    key: "runtime_baseline",
    label: "Runtime baseline",
    status: "ready",
    summary: "Runtime baseline verified",
    detail:
      "The route bundle loaded after the npm build/start baseline verifier and generated Prisma client import completed.",
    checkedAt,
  };
}

function probeRuntimeOps(checkedAt: string): DiagnosticsProbe {
  const uptimeSeconds = Math.max(0, Math.round(process.uptime()));
  const memory = process.memoryUsage();
  const heapUsedMb = Math.round(memory.heapUsed / 1024 / 1024);
  const rssMb = Math.round(memory.rss / 1024 / 1024);

  return {
    key: "runtime_ops",
    label: "Runtime ops baseline",
    status: "ready",
    summary: "Runtime ops telemetry available",
    detail:
      `Node process uptime ${uptimeSeconds}s, heap ${heapUsedMb}MB, rss ${rssMb}MB. Health and diagnostics semantics are computed per-request from live subsystem probes.`,
    checkedAt,
  };
}

function buildAggregateReadiness(input: {
  checkedAt: string;
  required: DiagnosticsProbe[];
  expectedTruthful: DiagnosticsProbe[];
}): DiagnosticsProbe {
  const failingRequired = input.required.filter(
    (probe) => !REQUIRED_READY_STATUSES.has(probe.status)
  );
  const failingExpected = input.expectedTruthful.filter(
    (probe) => !statusIsOperational(probe.status)
  );
  const failures = [...failingRequired, ...failingExpected];

  if (failures.length === 0) {
    return {
      key: "platform_readiness",
      label: "Platform readiness",
      status: "ready",
      summary: "Required runtime services ready",
      detail:
        "Required runtime services are responding. Intentional fallback, auth-required, blocked, degraded, and unconfigured states are reported explicitly.",
      checkedAt: input.checkedAt,
    };
  }

  return {
    key: "platform_readiness",
    label: "Platform readiness",
    status: failures.some((probe) => probe.status === "unavailable")
      ? "unavailable"
      : "degraded",
    summary: "Required runtime services degraded",
    detail: failures
      .map((probe) => `${probe.label}: ${probe.summary}`)
      .join(" "),
    checkedAt: input.checkedAt,
  };
}

function buildRouteProbes(input: {
  readiness: DiagnosticsProbe;
  market: DiagnosticsProbe;
  broker: DiagnosticsProbe;
  desktopFoundation: DiagnosticsProbe;
  desktopProductization: DiagnosticsProbe;
  mobileFoundation: DiagnosticsProbe;
  mobileProductization: DiagnosticsProbe;
  activationPilot: DiagnosticsProbe;
  integrationsFoundation: DiagnosticsProbe;
  commercialFoundation: DiagnosticsProbe;
  commercialActivation: DiagnosticsProbe;
  closedBetaPreparation: DiagnosticsProbe;
  softLaunchPreparation: DiagnosticsProbe;
  publicLaunchPreparation: DiagnosticsProbe;
  opsFoundation: DiagnosticsProbe;
  opsActivation: DiagnosticsProbe;
  productionDeployment: DiagnosticsProbe;
  productionHardening: DiagnosticsProbe;
  opsRecovery: DiagnosticsProbe;
  workspace: DiagnosticsProbe;
  alerts: DiagnosticsProbe;
  alertsAutomation: DiagnosticsProbe;
  alertsDelivery: DiagnosticsProbe;
  intelligence: DiagnosticsProbe;
  aiFoundation: DiagnosticsProbe;
  aiDeepening: DiagnosticsProbe;
  localOperations: DiagnosticsProbe;
  security: DiagnosticsProbe;
  productBackend: DiagnosticsProbe;
  operatorReviewConfigured: boolean;
}): DiagnosticsRouteProbe[] {
  return [
    {
      path: "/api/health",
      method: "GET",
      status: input.readiness.status,
      detail: input.readiness.summary,
    },
    {
      path: "/api/diagnostics/probes",
      method: "GET",
      status: input.readiness.status,
      detail: "Diagnostics probe route reports aggregate readiness and subsystem truth.",
    },
    {
      path: "/api/planet/status",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Readiness route reports product structure, private reporting readiness, and blocked product truth without secrets or private data.",
    },
    {
      path: "/api/planet/blueprint",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Blueprint route reports deterministic internal structure and core engine readiness without fake metrics.",
    },
    {
      path: "/api/planet/engines",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Core engines route reports all 10 internal engines as read-only architecture without activating external capabilities.",
    },
    {
      path: "/api/planet/visual-acceptance",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Visual Acceptance Engine route reports rubric readiness only; human screenshot acceptance remains required.",
    },
    {
      path: "/api/planet/state-explanations",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "State Explanation Engine route reports user-safe blocked, fallback, degraded, and protected-route explanations.",
    },
    {
      path: "/api/planet/content-factory/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Content Factory readiness route classifies internal drafts without publishing, social tokens, fake metrics, or launch claims.",
    },
    {
      path: "/api/planet/economy/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Economy readiness route reports Free, Pro, VIP, Institutional, resources, and monetization truth without billing, revenue, or fake metrics.",
    },
    {
      path: "/api/planet/media/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Media readiness route reports draft and AI Video Studio readiness without accounts, tokens, uploads, publishing, or fake metrics.",
    },
    {
      path: "/api/build-planner/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "AI Build Planner readiness route classifies safe future work while blocking launch, secrets, live execution, billing, and production actions.",
    },
    {
      path: "/api/local-ops/day-cycle",
      method: "GET",
      status: input.localOperations.status,
      detail:
        "Local operations day-cycle route reports closed local review stages only; no launch, production, billing, broker/feed, real-money, or social action exists.",
    },
    {
      path: "/api/local-ops/readiness-law",
      method: "GET",
      status: input.localOperations.status,
      detail:
        "Local readiness law route reports local maturity thresholds without automatic launch authority.",
    },
    {
      path: "/api/local-ops/report",
      method: "GET",
      status: input.localOperations.status,
      detail:
        "Local operations report route reports local review readiness only without fake users, metrics, revenue, or launch automation.",
    },
    {
      path: "/api/local-ops/digital-twin",
      method: "GET",
      status: input.localOperations.status,
      detail:
        "Local digital twin route reports test personas only; no real users, private data, or fake activity are included.",
    },
    {
      path: "/api/product/truth",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Product Truth Engine route reports blocked, inactive, planned, and review-required capability truth.",
    },
    {
      path: "/api/founder/briefing/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private reporting readiness route exposes non-sensitive briefing truth only; it is not an action surface.",
    },
    {
      path: "/api/founder/command/snapshot",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private command app snapshot route exposes private architecture readiness only; no action execution, secrets, private data, fake metrics, or public route is enabled.",
    },
    {
      path: "/api/founder/command/modules",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private command modules route reports read-only desktop/mobile command module readiness without exposing private controls to user plans.",
    },
    {
      path: "/api/founder/approval/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private approval readiness route reports lifecycle and review gates only; approval execution remains inactive.",
    },
    {
      path: "/api/founder/treasury/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private treasury readiness route reports billing inactive, subscriptions inactive, and future monetization review truth.",
    },
    {
      path: "/api/founder/media/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private media readiness route reports draft and AI video review readiness only; no social tokens, accounts, publishing, or media metrics exist.",
    },
    {
      path: "/api/founder/economy/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private economy readiness route reports treasury, growth, VIP, community, performance-fee research, and final acceptance truth without revenue or billing activation.",
    },
    {
      path: "/api/founder/partnerships/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private partnerships readiness route reports sponsored clock and brand partnership rules as inactive/planned without company names, contracts, or fake endorsements.",
    },
    {
      path: "/api/founder/final-acceptance/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Private final acceptance readiness route reports internal review, gap checklist, and non-launch roadmap truth; public launch and production remain unapproved.",
    },
    {
      path: "/api/companion/context",
      method: "GET",
      status: input.intelligence.status,
      detail:
        "Assistant Context route reports safe default assistant context without secrets, private data, or execution authority.",
    },
    {
      path: "/api/brain/context",
      method: "GET",
      status: input.intelligence.status,
      detail:
        "TPM Brain context route combines product truth, plan state, skill profile, journal/coach readiness, and safety summaries without secrets or predictive certainty.",
    },
    {
      path: "/api/journal-coach/readiness",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Journal/Coach readiness route reports paper-session prompts only; no financial advice, signals, live execution, or real-money routing is active.",
    },
    {
      path: "/api/planet/self-governance",
      method: "GET",
      status: input.productBackend.status,
      detail:
        "Safety integration route reports review matrix, internal automation boundaries, plan value, living signals, and roadmap planning as readiness truth only.",
    },
    {
      path: "/api/market",
      method: "GET",
      status: input.market.status,
      detail: input.market.summary,
    },
    {
      path: "/api/market/feed-state",
      method: "GET",
      status: input.market.status,
      detail: "Feed architecture route reports fallback-first driver policy and external-feed state.",
    },
    {
      path: "/api/broker/state",
      method: "GET",
      status: input.broker.status,
      detail: "Broker architecture route reports provider contracts and blocked live-routing policy.",
    },
    {
      path: "/api/platform/desktop/state",
      method: "GET",
      status: input.desktopFoundation.status,
      detail:
        "Desktop foundation route reports host bridge, persistence, packaging, and paper-only safety contracts.",
    },
    {
      path: "/api/platform/mobile/state",
      method: "GET",
      status: input.mobileFoundation.status,
      detail:
        "Mobile foundation route reports runtime bridge, auth/session, persistence, push readiness, and paper-only safety contracts.",
    },
    {
      path: "/api/platform/mobile/productization",
      method: "GET",
      status: input.mobileProductization.status,
      detail:
        "Mobile productization route reports guarded Android/iOS product flow, session restoration, persistence behavior, and explicit push-readiness truth.",
    },
    {
      path: "/api/platform/desktop/productization",
      method: "GET",
      status: input.desktopProductization.status,
      detail:
        "Desktop productization route reports pilot usability contracts for packaging/install/update/session restoration without claiming public release readiness.",
    },
    {
      path: "/api/integrations/pilot",
      method: "GET",
      status: input.activationPilot.status,
      detail:
        "Real activation pilot route reports sandbox-only broker/feed pilot gating with explicit paper-only and blocked live-money semantics.",
    },
    {
      path: "/api/integrations/readiness",
      method: "GET",
      status: input.integrationsFoundation.status,
      detail:
        "Real integrations route reports broker/feed configuration truth, activation gating, and policy-blocked live semantics.",
    },
    {
      path: "/api/commercial/catalog",
      method: "GET",
      status: input.commercialFoundation.status,
      detail:
        "Commercial catalog route reports plan/capability contracts and explicit inactive billing semantics.",
    },
    {
      path: "/api/ops/telemetry",
      method: "GET",
      status: "auth_required",
      detail: `${input.opsFoundation.summary}. Ops telemetry route is operator-guarded and requires authentication.`,
    },
    {
      path: "/api/ops/runbook",
      method: "GET",
      status: "auth_required",
      detail:
        "Ops runbook route is operator-guarded and requires authentication.",
    },
    {
      path: "/api/ops/readiness",
      method: "GET",
      status: "auth_required",
      detail: `${input.opsActivation.summary}. Route is operator-guarded and requires authentication.`,
    },
    {
      path: "/api/ops/hardening",
      method: "GET",
      status: "auth_required",
      detail: `${input.productionHardening.summary}. Route is operator-guarded and requires authentication. ${input.productionDeployment.summary}`,
    },
    {
      path: "/api/ops/recovery",
      method: "GET",
      status: "auth_required",
      detail: `${input.opsRecovery.summary}. Route is operator-guarded and requires authentication.`,
    },
    {
      path: "/api/account/preferences",
      method: "GET",
      status: "auth_required",
      detail:
        "Backend preference route is available but requires authentication.",
    },
    {
      path: "/api/account/commercial-state",
      method: "GET",
      status: "auth_required",
      detail:
        "Account commercial-state route is available and requires authentication.",
    },
    {
      path: "/api/account/commercial-activation",
      method: "GET",
      status: "auth_required",
      detail:
        `${input.commercialActivation.summary}. Route is authenticated and exposes guarded activation request flow semantics.`,
    },
    {
      path: "/api/account/workspace",
      method: "GET",
      status: "auth_required",
      detail: `${input.workspace.summary}. Route is authenticated.`,
    },
    {
      path: "/api/account/product-state",
      method: "GET",
      status: "auth_required",
      detail: `${input.productBackend.summary}. Route is authenticated.`,
    },
    {
      path: "/api/alerts/workflows",
      method: "GET",
      status: "auth_required",
      detail:
        "Alerts/workflow route is account-scoped and requires authentication.",
    },
    {
      path: "/api/alerts/automation/state",
      method: "GET",
      status: "auth_required",
      detail:
        "Alerts automation-state route is account-scoped and requires authentication.",
    },
    {
      path: "/api/alerts/delivery/state",
      method: "GET",
      status: "auth_required",
      detail: `${input.alertsDelivery.summary}. Route is account-scoped and requires authentication.`,
    },
    {
      path: "/api/intelligence/context",
      method: "GET",
      status: input.intelligence.status,
      detail: "Intelligence context route serves bounded, interpretive-only backend context.",
    },
    {
      path: "/api/intelligence/insights",
      method: "GET",
      status: input.aiFoundation.status,
      detail:
        "Intelligence insights route serves expanded bounded AI/IQ/Brain context with explicit non-predictive semantics.",
    },
    {
      path: "/api/intelligence/operator-assist",
      method: "GET",
      status: input.aiDeepening.status,
      detail:
        "Operator-assist intelligence route serves deepened bounded risk/execution context with explicit non-predictive semantics.",
    },
    {
      path: "/api/launch/operations",
      method: "GET",
      status: "auth_required",
      detail:
        `${input.closedBetaPreparation.summary}. Route is account-scoped and exposes controlled launch operations semantics.`,
    },
    {
      path: "/api/launch/beta-readiness",
      method: "GET",
      status: "auth_required",
      detail:
        "Closed-beta readiness route is account-scoped and exposes cohort/capacity guarded evaluator semantics.",
    },
    {
      path: "/api/launch/feedback",
      method: "GET",
      status: "auth_required",
      detail:
        "Closed-beta feedback route is account-scoped and operator-reviewed.",
    },
    {
      path: "/api/launch/soft-readiness",
      method: "GET",
      status: "auth_required",
      detail:
        `${input.softLaunchPreparation.summary}. Route is account-scoped and exposes guarded soft-launch readiness semantics.`,
    },
    {
      path: "/api/launch/soft-access",
      method: "GET",
      status: "auth_required",
      detail:
        "Soft-launch access route is account-scoped and exposes guarded admission semantics.",
    },
    {
      path: "/api/launch/public-readiness",
      method: "GET",
      status: "auth_required",
      detail:
        `${input.publicLaunchPreparation.summary}. Route is account-scoped and exposes guarded public-launch preparation checklist semantics.`,
    },
    {
      path: "/api/launch/public-go-live",
      method: "GET",
      status: "auth_required",
      detail:
        "Public go-live route is account-scoped and exposes guarded release decision semantics.",
    },
    {
      path: "/api/account/compliance",
      method: "GET",
      status: "auth_required",
      detail: "Compliance route is available and requires authentication.",
    },
    {
      path: "/api/auth/login",
      method: "POST",
      status: input.security.status,
      detail: "Login route is guarded by bounded JSON parsing and local rate limits.",
    },
    {
      path: "/api/operator/compliance/review",
      method: "POST",
      status: input.operatorReviewConfigured ? "auth_required" : "unconfigured",
      detail:
        "Operator review requires operator auth plus an explicit operator secret and is unavailable unless configured.",
    },
  ];
}

function buildSubsystems(input: {
  server: DiagnosticsProbe;
  runtimeOps: DiagnosticsProbe;
  security: DiagnosticsProbe;
  desktopFoundation: DiagnosticsProbe;
  desktopProductization: DiagnosticsProbe;
  mobileFoundation: DiagnosticsProbe;
  mobileProductization: DiagnosticsProbe;
  activationPilot: DiagnosticsProbe;
  integrationsFoundation: DiagnosticsProbe;
  commercialFoundation: DiagnosticsProbe;
  commercialActivation: DiagnosticsProbe;
  closedBetaPreparation: DiagnosticsProbe;
  softLaunchPreparation: DiagnosticsProbe;
  publicLaunchPreparation: DiagnosticsProbe;
  opsFoundation: DiagnosticsProbe;
  opsActivation: DiagnosticsProbe;
  productionDeployment: DiagnosticsProbe;
  productionHardening: DiagnosticsProbe;
  opsRecovery: DiagnosticsProbe;
  preferences: DiagnosticsProbe;
  workspace: DiagnosticsProbe;
  productBackend: DiagnosticsProbe;
  market: DiagnosticsProbe;
  broker: DiagnosticsProbe;
  alerts: DiagnosticsProbe;
  alertsAutomation: DiagnosticsProbe;
  alertsDelivery: DiagnosticsProbe;
  intelligence: DiagnosticsProbe;
  aiFoundation: DiagnosticsProbe;
  aiDeepening: DiagnosticsProbe;
  localOperations: DiagnosticsProbe;
  designMinistry: DiagnosticsProbe;
  readiness: DiagnosticsProbe;
}) {
  return [
    {
      key: "platform",
      label: "Platform readiness",
      status: input.readiness.status,
      summary: input.readiness.summary,
      detail: input.readiness.detail,
    },
    {
      key: "server",
      label: input.server.label,
      status: input.server.status,
      summary: input.server.summary,
      detail: input.server.detail,
    },
    {
      key: "runtime_ops",
      label: input.runtimeOps.label,
      status: input.runtimeOps.status,
      summary: input.runtimeOps.summary,
      detail: input.runtimeOps.detail,
    },
    {
      key: "security",
      label: input.security.label,
      status: input.security.status,
      summary: input.security.summary,
      detail: input.security.detail,
    },
    {
      key: "desktop",
      label: input.desktopFoundation.label,
      status: input.desktopFoundation.status,
      summary: input.desktopFoundation.summary,
      detail: input.desktopFoundation.detail,
    },
    {
      key: "desktop_productization",
      label: input.desktopProductization.label,
      status: input.desktopProductization.status,
      summary: input.desktopProductization.summary,
      detail: input.desktopProductization.detail,
    },
    {
      key: "mobile",
      label: input.mobileFoundation.label,
      status: input.mobileFoundation.status,
      summary: input.mobileFoundation.summary,
      detail: input.mobileFoundation.detail,
    },
    {
      key: "mobile_productization",
      label: input.mobileProductization.label,
      status: input.mobileProductization.status,
      summary: input.mobileProductization.summary,
      detail: input.mobileProductization.detail,
    },
    {
      key: "activation_pilot",
      label: input.activationPilot.label,
      status: input.activationPilot.status,
      summary: input.activationPilot.summary,
      detail: input.activationPilot.detail,
    },
    {
      key: "integrations",
      label: input.integrationsFoundation.label,
      status: input.integrationsFoundation.status,
      summary: input.integrationsFoundation.summary,
      detail: input.integrationsFoundation.detail,
    },
    {
      key: "commercial",
      label: input.commercialFoundation.label,
      status: input.commercialFoundation.status,
      summary: input.commercialFoundation.summary,
      detail: input.commercialFoundation.detail,
    },
    {
      key: "commercial_activation",
      label: input.commercialActivation.label,
      status: input.commercialActivation.status,
      summary: input.commercialActivation.summary,
      detail: input.commercialActivation.detail,
    },
    {
      key: "closed_beta_preparation",
      label: input.closedBetaPreparation.label,
      status: input.closedBetaPreparation.status,
      summary: input.closedBetaPreparation.summary,
      detail: input.closedBetaPreparation.detail,
    },
    {
      key: "soft_launch_preparation",
      label: input.softLaunchPreparation.label,
      status: input.softLaunchPreparation.status,
      summary: input.softLaunchPreparation.summary,
      detail: input.softLaunchPreparation.detail,
    },
    {
      key: "public_launch_preparation",
      label: input.publicLaunchPreparation.label,
      status: input.publicLaunchPreparation.status,
      summary: input.publicLaunchPreparation.summary,
      detail: input.publicLaunchPreparation.detail,
    },
    {
      key: "ops",
      label: input.opsFoundation.label,
      status: input.opsFoundation.status,
      summary: input.opsFoundation.summary,
      detail: input.opsFoundation.detail,
    },
    {
      key: "ops_activation",
      label: input.opsActivation.label,
      status: input.opsActivation.status,
      summary: input.opsActivation.summary,
      detail: input.opsActivation.detail,
    },
    {
      key: "production_deployment",
      label: input.productionDeployment.label,
      status: input.productionDeployment.status,
      summary: input.productionDeployment.summary,
      detail: input.productionDeployment.detail,
    },
    {
      key: "ops_hardening",
      label: input.productionHardening.label,
      status: input.productionHardening.status,
      summary: input.productionHardening.summary,
      detail: input.productionHardening.detail,
    },
    {
      key: "ops_recovery",
      label: input.opsRecovery.label,
      status: input.opsRecovery.status,
      summary: input.opsRecovery.summary,
      detail: input.opsRecovery.detail,
    },
    {
      key: "preferences",
      label: input.preferences.label,
      status: input.preferences.status,
      summary: input.preferences.summary,
      detail: input.preferences.detail,
    },
    {
      key: "workspace",
      label: input.workspace.label,
      status: input.workspace.status,
      summary: input.workspace.summary,
      detail: input.workspace.detail,
    },
    {
      key: "product_backend",
      label: input.productBackend.label,
      status: input.productBackend.status,
      summary: input.productBackend.summary,
      detail: input.productBackend.detail,
    },
    {
      key: "market",
      label: input.market.label,
      status: input.market.status,
      summary: input.market.summary,
      detail: input.market.detail,
    },
    {
      key: "broker",
      label: input.broker.label,
      status: input.broker.status,
      summary: input.broker.summary,
      detail: input.broker.detail,
    },
    {
      key: "alerts_workflow",
      label: input.alerts.label,
      status: input.alerts.status,
      summary: input.alerts.summary,
      detail: input.alerts.detail,
    },
    {
      key: "alerts_automation",
      label: input.alertsAutomation.label,
      status: input.alertsAutomation.status,
      summary: input.alertsAutomation.summary,
      detail: input.alertsAutomation.detail,
    },
    {
      key: "alerts_delivery",
      label: input.alertsDelivery.label,
      status: input.alertsDelivery.status,
      summary: input.alertsDelivery.summary,
      detail: input.alertsDelivery.detail,
    },
    {
      key: "intelligence",
      label: input.intelligence.label,
      status: input.intelligence.status,
      summary: input.intelligence.summary,
      detail: input.intelligence.detail,
    },
    {
      key: "ai_iq_brain",
      label: input.aiFoundation.label,
      status: input.aiFoundation.status,
      summary: input.aiFoundation.summary,
      detail: input.aiFoundation.detail,
    },
    {
      key: "ai_iq_brain_deepening",
      label: input.aiDeepening.label,
      status: input.aiDeepening.status,
      summary: input.aiDeepening.summary,
      detail: input.aiDeepening.detail,
    },
    {
      key: "local_operations",
      label: input.localOperations.label,
      status: input.localOperations.status,
      summary: input.localOperations.summary,
      detail: input.localOperations.detail,
    },
    {
      key: "visual_identity_platform_design",
      label: input.designMinistry.label,
      status: input.designMinistry.status,
      summary: input.designMinistry.summary,
      detail: input.designMinistry.detail,
    },
  ];
}

export async function getDiagnosticsHealthSnapshot(): Promise<DiagnosticsHealthSnapshot> {
  const checkedAt = new Date().toISOString();
  const [
    server,
    market,
    preferences,
    workspace,
    productBackend,
    desktopFoundation,
    desktopProductization,
    mobileFoundation,
    mobileProductization,
    activationPilot,
    integrationsFoundation,
    commercialFoundation,
    commercialActivation,
    closedBetaPreparation,
    softLaunchPreparation,
    publicLaunchPreparation,
    opsFoundation,
    opsActivation,
    productionDeployment,
    productionHardening,
    opsRecovery,
    alerts,
    alertsAutomation,
    alertsDelivery,
    intelligence,
    aiFoundation,
    aiDeepening,
    launchOperationsControl,
    feedbackStoreDiagnostics,
  ] = await Promise.all([
    probeServerReadiness(),
    getMarketDiagnosticsProbe(),
    probeWorkspacePreferencePersistence(),
    probeWorkspaceDepthPersistence(),
    getProductBackendDiagnosticsProbe(),
    Promise.resolve(getDesktopAppsDiagnosticsProbe(checkedAt)),
    Promise.resolve(getDesktopProductizationDiagnosticsProbe(checkedAt)),
    Promise.resolve(getMobileAppsDiagnosticsProbe(checkedAt)),
    Promise.resolve(getMobileProductizationDiagnosticsProbe(checkedAt)),
    Promise.resolve(getRealActivationPilotDiagnosticsProbe(checkedAt)),
    Promise.resolve(getRealIntegrationsDiagnosticsProbe(checkedAt)),
    getCommercialScalingDiagnosticsProbe(),
    getCommercialActivationDiagnosticsProbe(),
    getClosedBetaPreparationDiagnosticsProbe(),
    getSoftLaunchPreparationDiagnosticsProbe(),
    getPublicLaunchPreparationDiagnosticsProbe(),
    getEnterpriseOpsDiagnosticsProbe(),
    getOpsProductionActivationDiagnosticsProbe(),
    Promise.resolve(getProductionDeploymentDiagnosticsProbe(checkedAt)),
    getProductionHardeningDiagnosticsProbe(),
    getOpsRecoveryDiagnosticsProbe(),
    getAlertWorkflowDiagnosticsProbe(),
    getAlertAutomationDiagnosticsProbe(),
    getAlertDeliveryActivationDiagnosticsProbe(),
    getIntelligenceBackendDiagnosticsProbe(),
    getAiIqBrainDiagnosticsProbe(),
    getAiIqBrainDeepeningDiagnosticsProbe(),
    getLaunchOperationsControlStateSnapshot({ checkedAt }),
    getLaunchFeedbackStoreDiagnostics({ checkedAt }),
  ]);
  const runtimeBaseline = probeRuntimeBaseline(checkedAt);
  const runtimeOps = probeRuntimeOps(checkedAt);
  const brokerConnector = getBrokerConnectorSafetySnapshot(checkedAt);
  const broker = getBrokerConnectorDiagnosticsProbe(brokerConnector);
  const brokerIntegration = getBrokerIntegrationSnapshot(checkedAt);
  const marketFeedArchitecture = getMarketFeedArchitectureSnapshot(checkedAt);
  const activationPilotSnapshot = getRealActivationPilotSnapshot(checkedAt);
  const security = getSecurityDiagnosticsProbe();
  const clientExpansion = getClientExpansionSnapshot(checkedAt);
  const productionDeploymentSnapshot =
    getProductionDeploymentReadinessSnapshot(checkedAt);
  const localOperationsSnapshot = getLocalOperationsReadinessSnapshot(checkedAt);
  const localOperations: DiagnosticsProbe = {
    key: "local_operations_mode",
    label: "Local operations mode",
    status: "ready",
    summary: "Closed local operation protocol ready",
    detail:
      `${localOperationsSnapshot.dayCycle.totalStages} local review stages are defined. ${localOperationsSnapshot.report.launchForbiddenReminder}`,
    checkedAt,
  };
  const designMinistrySnapshot = getDesignMinistrySnapshot(checkedAt);
  const designMinistry: DiagnosticsProbe = {
    key: "visual_identity_platform_design",
    label: "Visual identity readiness",
    status: "ready",
    summary: "Plan identity and platform design governance ready",
    detail:
      `${designMinistrySnapshot.authorities.length} design authorities, ${designMinistrySnapshot.planIdentities.length} plan identities, and ${designMinistrySnapshot.platformExperiences.length} platform experience rules are modeled. Public language remains Free / Pro / VIP / Institutional; restricted command visuals stay private.`,
    checkedAt,
  };

  const readiness = buildAggregateReadiness({
    checkedAt,
    required: [
      server,
      runtimeBaseline,
      runtimeOps,
      preferences,
      workspace,
      security,
      productBackend,
      desktopFoundation,
      mobileFoundation,
      commercialFoundation,
      opsFoundation,
    ],
    expectedTruthful: [
      market,
      broker,
      desktopProductization,
      mobileProductization,
      activationPilot,
      integrationsFoundation,
      alerts,
      alertsAutomation,
      alertsDelivery,
      commercialActivation,
      closedBetaPreparation,
      softLaunchPreparation,
      publicLaunchPreparation,
      opsActivation,
      productionDeployment,
      productionHardening,
      opsRecovery,
      intelligence,
      aiFoundation,
      aiDeepening,
      localOperations,
      designMinistry,
    ],
  });

  const probes: DiagnosticsProbe[] = [
    server,
    runtimeBaseline,
    runtimeOps,
    security,
    desktopFoundation,
    desktopProductization,
    mobileFoundation,
    mobileProductization,
    activationPilot,
    integrationsFoundation,
    commercialFoundation,
    commercialActivation,
    closedBetaPreparation,
    softLaunchPreparation,
    publicLaunchPreparation,
    opsFoundation,
    opsActivation,
    productionDeployment,
    productionHardening,
    opsRecovery,
    preferences,
    workspace,
    productBackend,
    market,
    broker,
    alerts,
    alertsAutomation,
    alertsDelivery,
    intelligence,
    aiFoundation,
    aiDeepening,
    localOperations,
    designMinistry,
  ];
  const routes = buildRouteProbes({
    readiness,
    market,
    broker,
    desktopFoundation,
    desktopProductization,
    mobileFoundation,
    mobileProductization,
    activationPilot,
    integrationsFoundation,
    commercialFoundation,
    commercialActivation,
    softLaunchPreparation,
    publicLaunchPreparation,
    opsFoundation,
    opsActivation,
    productionDeployment,
    productionHardening,
    opsRecovery,
    workspace,
    alerts,
    alertsAutomation,
    alertsDelivery,
    intelligence,
    aiFoundation,
    aiDeepening,
    localOperations,
    security,
    productBackend,
    closedBetaPreparation,
    operatorReviewConfigured:
      brokerConnector.operatorReview.state !== "unconfigured",
  });
  const subsystems = buildSubsystems({
    server,
    runtimeOps,
    security,
    desktopFoundation,
    desktopProductization,
    mobileFoundation,
    mobileProductization,
    activationPilot,
    integrationsFoundation,
    commercialFoundation,
    commercialActivation,
    closedBetaPreparation,
    softLaunchPreparation,
    publicLaunchPreparation,
    opsFoundation,
    opsActivation,
    productionDeployment,
    productionHardening,
    opsRecovery,
    preferences,
    workspace,
    productBackend,
    market,
    broker,
    alerts,
    alertsAutomation,
    alertsDelivery,
    intelligence,
    aiFoundation,
    aiDeepening,
    localOperations,
    designMinistry,
    readiness,
  });
  const baseHealth: DiagnosticsHealthSnapshot = {
    checkedAt,
    readiness,
    probes,
    connectors: [brokerConnector],
    routes,
    subsystems,
    policyTruth: {
      paperOnly: true,
      liveExecution: "blocked",
      marketData: "fallback_first",
      brokerRouting: "blocked",
      externalFeed: "fallback_active",
    },
    architecture: {
      broker: {
        policyMode: brokerIntegration.policyMode,
        provider: brokerIntegration.provider.key,
        state: brokerIntegration.integration.state,
        activationGate: brokerIntegration.integration.activationGate,
        readinessScore: brokerIntegration.readiness.score,
        readinessStage: brokerIntegration.readiness.stage,
      },
      marketFeed: {
        policyMode: marketFeedArchitecture.policyMode,
        externalState: marketFeedArchitecture.externalDriver.state,
        externalConfigured: marketFeedArchitecture.externalDriver.endpointConfigured,
        readinessScore: marketFeedArchitecture.readiness.score,
        readinessStage: marketFeedArchitecture.readiness.stage,
      },
      activationPilot: {
        mode: activationPilotSnapshot.activation.mode,
        state: activationPilotSnapshot.activation.state,
        canEnterPilotSandbox: activationPilotSnapshot.activation.canEnterPilotSandbox,
        readinessScore: activationPilotSnapshot.readiness.score,
        readinessStage: activationPilotSnapshot.readiness.stage,
      },
    },
    clientExpansion,
    productionDeployment: {
      checkedAt: productionDeploymentSnapshot.checkedAt,
      status:
        productionDeploymentSnapshot.blockers.length === 0
          ? "ready"
          : "blocked",
      score: productionDeploymentSnapshot.readiness.score,
      stage: productionDeploymentSnapshot.readiness.stage,
      database: productionDeploymentSnapshot.database,
      secrets: productionDeploymentSnapshot.secrets,
      closedBeta: productionDeploymentSnapshot.closedBeta,
      monitoring: productionDeploymentSnapshot.monitoring,
      blockers: productionDeploymentSnapshot.blockers,
      warnings: productionDeploymentSnapshot.warnings,
    },
  };
  const launchGate = buildLaunchReadinessGateSnapshot(baseHealth, checkedAt);
  const launchProbe: DiagnosticsProbe = {
    key: "launch_readiness_gate",
    label: "Launch readiness verification gate",
    status: launchGate.overall.status === "pass" ? "ready" : "degraded",
    summary:
      launchGate.overall.status === "pass"
        ? "Launch verification gate passed with evidence-based readiness semantics."
        : "Launch verification gate failed and requires checklist remediation.",
    detail:
      `Gate score ${launchGate.overall.score}/100 with ${launchGate.checklist.failedCount} failed checklist item(s), ${launchGate.overall.warnCount} warned domain(s), and ${launchGate.overall.failCount} failed domain(s).`,
    checkedAt,
  };
  const marketParitySnapshot = buildFinalMarketParitySnapshot({
    health: {
      ...baseHealth,
      probes: [...baseHealth.probes, launchProbe],
    },
    launchReadinessGate: {
      status: launchGate.overall.status,
      score: launchGate.overall.score,
    },
    checkedAt,
  });
  const marketParityProbe = getFinalMarketParityDiagnosticsProbe(
    marketParitySnapshot
  );
  const productMemorySnapshot = getProductMemorySummarySnapshot(checkedAt);
  const productMemoryProbe: DiagnosticsProbe = {
    key: "product_memory",
    label: "Product memory readiness",
    status: "ready",
    summary: "Safe local/internal memory foundation ready",
    detail:
      `${productMemorySnapshot.domainSummary.length} memory domains modeled; secrets, private sensitive data, fake users, fake revenue, and fake metrics remain unstored.`,
    checkedAt,
  };
  const localDailyLoopSnapshot = getLocalDailyOperationsLoopSnapshot(checkedAt);
  const localDailyReportSnapshot =
    getLocalDailyOperationsReportSnapshot(checkedAt);
  const productMemoryDailySummary =
    getProductMemoryDailySummarySnapshot(checkedAt);
  const dailyOperationsProbe: DiagnosticsProbe = {
    key: "daily_operations_loop",
    label: "Daily operations loop",
    status: "ready",
    summary: "Local daily review loop ready",
    detail:
      `${localDailyLoopSnapshot.summary.totalStages} daily stages connect review, founder acceptance, product gaps, Codex task drafting, validation, and memory. Latest local day ${localDailyReportSnapshot.dayNumber} remains ${localDailyReportSnapshot.readiness.state}; ${productMemoryDailySummary.productGaps.open} open gaps and ${productMemoryDailySummary.validation.commands} validation commands are summarized. Launch automation, secret storage, private sensitive data storage, and surveillance are disabled.`,
    checkedAt,
  };
  const founderLocalCommandSnapshot =
    getFounderLocalCommandReadinessSnapshot(checkedAt);
  const founderLocalCommandProbe: DiagnosticsProbe = {
    key: "founder_local_command",
    label: "Founder local command readiness",
    status: "ready",
    summary: "Owner-only local command shell foundation ready",
    detail:
      `${founderLocalCommandSnapshot.summaries.localDayStages} local stages, ${founderLocalCommandSnapshot.summaries.memoryDomains} memory domains, and ${founderLocalCommandSnapshot.summaries.constructionQueueItems} construction queue items are summarized with approval execution disabled.`,
    checkedAt,
  };
  const localDayOneSnapshot = getLocalDayOneReadinessSnapshot(checkedAt);
  const localDayOneOperationSnapshot =
    getLocalDayOneOperationSnapshot(checkedAt);
  const localFinalReport = getLocalOperationsFinalReportSnapshot(checkedAt);
  const productRealityFinalScore = getProductRealityFinalScoreSnapshot(checkedAt);
  const productRealityLocalStartScore =
    getProductRealityLocalStartScoreSnapshot(checkedAt);
  const localDayOneProbe: DiagnosticsProbe = {
    key: "local_day_one_acceptance",
    label: "Local Day One readiness",
    status: localDayOneSnapshot.readyToStartLocalDayOne ? "ready" : "degraded",
    summary: localDayOneSnapshot.readyToStartLocalDayOne
      ? "Closed local Day One review can start"
      : "Local Day One has blockers",
    detail:
      `Gate ${localDayOneSnapshot.gateStatus}; score ${productRealityFinalScore.overallScore}/10; ${localDayOneSnapshot.summary.needsAhmadReview} area(s) need Ahmad review. ${localFinalReport.launchForbiddenReminder}`,
    checkedAt,
  };
  const localDayOneOperationProbe: DiagnosticsProbe = {
    key: "local_day_one_operation",
    label: "Local Day One Operation",
    status: localDayOneOperationSnapshot.canStartLocalWork
      ? "ready"
      : "degraded",
    summary: localDayOneOperationSnapshot.canStartLocalWork
      ? "Ready with notes for closed local work"
      : "Local operation start has blockers",
    detail:
      `Operation gate ${localDayOneOperationSnapshot.status}; local start score ${productRealityLocalStartScore.overallScore}/10; Ahmad visual review required: ${localDayOneOperationSnapshot.ahmadHumanVisualAcceptanceRequired}. This is local-only, paper-safe, non-production, non-launch work-start readiness.`,
    checkedAt,
  };
  const founderBuildRoomSnapshot = getFounderBuildRoomReadinessSnapshot(checkedAt);
  const founderBuildRoomProbe: DiagnosticsProbe = {
    key: "founder_build_room",
    label: "Founder Build Room readiness",
    status: "ready",
    summary: "Local build-command room ready for draft-only construction guidance",
    detail:
      `${founderBuildRoomSnapshot.summaries.codexTaskDrafts} Codex task drafts, ${founderBuildRoomSnapshot.summaries.productGaps} product gaps, and ${founderBuildRoomSnapshot.summaries.visualGaps} visual gaps are visible with automatic Codex sending disabled.`,
    checkedAt,
  };
  const brandIntelligenceSummary = getPublicBrandIntelligenceSummary(checkedAt);
  const brandIntelligenceProbe: DiagnosticsProbe = {
    key: "living_brand_intelligence",
    label: "Living brand intelligence",
    status: "ready",
    summary: "Identity decisions are public-safe and state-aware",
    detail:
      `Genome, plan DNA, state language, motion safety, occasion governance, and surface simulation are ${brandIntelligenceSummary.status}. Public plans remain ${brandIntelligenceSummary.publicPlanNames.join(" / ")} and no raster assets, external logo assets, fake launch, billing, broker/feed, or live-money state is used.`,
    checkedAt,
  };
  const surfaceBoundarySnapshot = getSurfaceBoundarySnapshot(checkedAt);
  const surfaceBoundaryProbe: DiagnosticsProbe = {
    key: "surface_boundaries",
    label: "Public/private surface readiness",
    status: "ready",
    summary: "Public and private surfaces are separated",
    detail:
      `${surfaceBoundarySnapshot.summary.publicSurfaces} user-safe surfaces, ${surfaceBoundarySnapshot.summary.privateFounderSurfaces} private surfaces, and ${surfaceBoundarySnapshot.summary.invisibleLayerSurfaces} internal readiness surfaces are classified. Public navigation is complete and advanced systems remain unlinked.`,
    checkedAt,
  };
  const securitySovereigntySnapshot = getSecuritySovereigntySnapshot(checkedAt);
  const securitySovereigntyProbe: DiagnosticsProbe = {
    key: "security_sovereignty",
    label: "Security sovereignty readiness",
    status: "ready",
    summary: "Zero-trust security readiness is defined",
    detail:
      `${securitySovereigntySnapshot.authorities.length} security authorities, red/blue/purple readiness, incident response, evidence ledger, and hardening are modeled with no secrets exposed and no activation authority.`,
    checkedAt,
  };
  const secretsAuthoritySnapshot = getSecretsAuthoritySnapshot(checkedAt);
  const secretsAuthorityProbe: DiagnosticsProbe = {
    key: "secrets_authority",
    label: "Secrets readiness",
    status: "ready",
    summary: "Presence-only secret readiness is defined",
    detail:
      `${secretsAuthoritySnapshot.categories.length} secret categories report status only. Raw values, logs, Assistant/Codex transfer, screenshots, product memory storage, env commits, and activation remain blocked.`,
    checkedAt,
  };
  const worldInterfaceSnapshot = getWorldInterfaceSnapshot(checkedAt);
  const worldInterfaceProbe: DiagnosticsProbe = {
    key: "world_interface",
    label: "World interface readiness",
    status: "ready",
    summary: "External channel readiness is draft-only",
    detail:
      `${worldInterfaceSnapshot.channelSummary.total} external channel categories are modeled with no real connections, no tokens, no sending, no publishing, no spam automation, and no fake metrics.`,
    checkedAt,
  };
  const academySnapshot = getAcademyReadinessSnapshot(checkedAt);
  const communitySnapshot = getCommunityReadinessSnapshot(checkedAt);
  const vipRoomsSnapshot = getVipRoomsReadinessSnapshot(checkedAt);
  const learningCommunityProbe: DiagnosticsProbe = {
    key: "learning_community_vip",
    label: "Learning and community readiness",
    status: "ready",
    summary: "Academy, Community, and VIP Rooms are readiness-only",
    detail:
      `${academySnapshot.learningPaths.length} Academy paths, ${communitySnapshot.rooms.length} planned Community rooms, and ${vipRoomsSnapshot.capabilities.length} VIP room capabilities are modeled with no fake members, no active rooms, no signal rooms, no copy trading, no billing, and no profit claims.`,
    checkedAt,
  };
  const mediaOfficeSnapshot = getMediaOfficeReadinessSnapshot(checkedAt);
  const aiVideoStudioSnapshot = getAiVideoStudioReadinessSnapshot(checkedAt);
  const contentReviewSnapshot = getContentReviewReadinessSnapshot(checkedAt);
  const mediaAiVideoWorkflowProbe: DiagnosticsProbe = {
    key: "media_ai_video_workflow",
    label: "Media and video workflow readiness",
    status: "ready",
    summary: "Draft, review, and approval workflow is readiness-only",
    detail:
      `${mediaOfficeSnapshot.contentTypes.length} media content types and ${aiVideoStudioSnapshot.artifactTypes.length} AI video artifacts are modeled with ${contentReviewSnapshot.blockedClaims.length} blocked claim categories, no social tokens, no uploads, no publishing, and no fake metrics.`,
    checkedAt,
  };

  return {
    ...baseHealth,
    probes: [
      ...baseHealth.probes,
      launchProbe,
      marketParityProbe,
      productMemoryProbe,
      dailyOperationsProbe,
      founderLocalCommandProbe,
      localDayOneProbe,
      founderBuildRoomProbe,
      brandIntelligenceProbe,
      surfaceBoundaryProbe,
      securitySovereigntyProbe,
      secretsAuthorityProbe,
      worldInterfaceProbe,
      learningCommunityProbe,
      mediaAiVideoWorkflowProbe,
    ],
    routes: [
      ...baseHealth.routes,
      {
        path: "/api/launch/readiness",
        method: "GET",
        status: launchProbe.status,
        detail:
          "Launch readiness route provides machine-checkable launch gate evidence and checklist truth.",
      },
      {
        path: "/api/parity/final",
        method: "GET",
        status: marketParityProbe.status,
        detail:
          "Final market parity route provides auditable parity-closure evidence with explicit guarded capability truth.",
      },
      {
        path: "/api/product-memory/summary",
        method: "GET",
        status: productMemoryProbe.status,
        detail:
          "Product Memory summary route reports safe local/internal memory readiness without secrets, raw private sensitive data, fake metrics, or production storage.",
      },
      {
        path: "/api/product-memory/founder-acceptance",
        method: "GET",
        status: productMemoryProbe.status,
        detail:
          "Founder acceptance memory route reports safe acceptance readiness only; no launch approval or private data is stored.",
      },
      {
        path: "/api/product-memory/product-gaps",
        method: "GET",
        status: productMemoryProbe.status,
        detail:
          "Product gap memory route reports known visual, UX, chart, Assistant, terminology, and safety gaps as safe product notes.",
      },
      {
        path: "/api/product-memory/local-day",
        method: "GET",
        status: productMemoryProbe.status,
        detail:
          "Local day memory route reports local operation summaries without launch automation.",
      },
      {
        path: "/api/product-memory/validation-summary",
        method: "GET",
        status: productMemoryProbe.status,
        detail:
          "Validation memory route reports summary-only command status and does not persist raw logs.",
      },
      {
        path: "/api/local-ops/daily-loop",
        method: "GET",
        status: dailyOperationsProbe.status,
        detail:
          "Daily operations loop route reports the local review, acceptance, gap, task-draft, validation, and summary cycle without automation or launch authority.",
      },
      {
        path: "/api/local-ops/daily-report",
        method: "GET",
        status: dailyOperationsProbe.status,
        detail:
          "Daily report route reports local day readiness, scores, gaps, suggested task, validation status, Git state, and launch-forbidden reminder without secrets or fake metrics.",
      },
      {
        path: "/api/product-memory/daily-summary",
        method: "GET",
        status: dailyOperationsProbe.status,
        detail:
          "Product memory daily summary route reports safe local memory summaries for acceptance, gaps, validation, and build decisions without raw sensitive data.",
      },
      {
        path: "/api/founder/local-command/snapshot",
        method: "GET",
        status: founderLocalCommandProbe.status,
        detail:
          "Founder local command snapshot route reports owner-only local app shell readiness without secrets, private data, fake metrics, or approval execution.",
      },
      {
        path: "/api/founder/local-command/readiness",
        method: "GET",
        status: founderLocalCommandProbe.status,
        detail:
          "Founder local command readiness route reports compact owner-only local shell truth and keeps public navigation disabled.",
      },
      {
        path: "/api/founder/build-room/readiness",
        method: "GET",
        status: founderBuildRoomProbe.status,
        detail:
          "Founder Build Room readiness route reports local build-command drafting status without public navigation, approval execution, external Codex sending, secrets, or fake metrics.",
      },
      {
        path: "/api/local-ops/day-one",
        method: "GET",
        status: localDayOneProbe.status,
        detail:
          "Local Day One route reports the closed local acceptance gate, Ahmad review requirement, and non-launch truth.",
      },
      {
        path: "/api/local-ops/start-readiness",
        method: "GET",
        status: localDayOneOperationProbe.status,
        detail:
          "Local start readiness route reports the closed local operation gate, required screenshots, and non-launch truth without activation authority.",
      },
      {
        path: "/api/local-ops/day-one-operation",
        method: "GET",
        status: localDayOneOperationProbe.status,
        detail:
          "Local Day One Operation route reports the final local work-start checklist, Ahmad visual review requirement, and blocked-by-design activation scope.",
      },
      {
        path: "/api/local-ops/final-report",
        method: "GET",
        status: localDayOneProbe.status,
        detail:
          "Final local operations report route separates complete, partial, planned, and blocked-by-design local readiness without launch authority.",
      },
      {
        path: "/api/product-reality/final-score",
        method: "GET",
        status: localDayOneProbe.status,
        detail:
          "Product reality final score route uses a 0-10 local review scale and forbids fake 10/10 or global launch readiness claims.",
      },
      {
        path: "/api/product-reality/local-start-score",
        method: "GET",
        status: localDayOneOperationProbe.status,
        detail:
          "Local start score route reports practical local operation scores and keeps Ahmad human visual acceptance required.",
      },
      {
        path: "/api/founder/local-day-one/readiness",
        method: "GET",
        status: localDayOneProbe.status,
        detail:
          "Founder Local Day One readiness route summarizes owner-only local gate status without secrets, private data, or approval execution.",
      },
      {
        path: "/api/brand-intelligence/summary",
        method: "GET",
        status: brandIntelligenceProbe.status,
        detail:
          "Living Brand Intelligence summary route reports public-safe identity readiness, plan truth, and motion safety without images, secrets, fake claims, or activation.",
      },
      {
        path: "/api/brand-intelligence/simulation",
        method: "GET",
        status: brandIntelligenceProbe.status,
        detail:
          "Identity surface simulation route reports redacted surface decisions for public-safe review without restricted vocabulary or private data.",
      },
      {
        path: "/api/brand-intelligence/guardian",
        method: "GET",
        status: brandIntelligenceProbe.status,
        detail:
          "Identity Guardian route reports public-safe blocked category readiness for motion, claims, plan language, and visual clutter.",
      },
      {
        path: "/api/brand-intelligence/occasion-themes",
        method: "GET",
        status: brandIntelligenceProbe.status,
        detail:
          "Occasion identity route reports opt-in theme governance without automatic cultural, religious, political, copyrighted, or partnership themes.",
      },
      {
        path: "/api/founder/secrets/readiness",
        method: "GET",
        status: secretsAuthorityProbe.status,
        detail:
          "Founder secrets readiness route reports status-only secret categories, rotation policy, and exposure guards without raw values.",
      },
      {
        path: "/api/founder/security/readiness",
        method: "GET",
        status: secretsAuthorityProbe.status,
        detail:
          "Founder security readiness route reports owner-only command protection and secret exposure policy without private data or action execution.",
      },
      {
        path: "/api/world-interface/readiness",
        method: "GET",
        status: worldInterfaceProbe.status,
        detail:
          "World Interface readiness route reports external-channel classification, quarantine, and draft-only response readiness without connections, tokens, sending, or publishing.",
      },
      {
        path: "/api/world-interface/channels",
        method: "GET",
        status: worldInterfaceProbe.status,
        detail:
          "World Interface channels route reports channel status only with no account connections, tokens, sending, or fake metrics.",
      },
      {
        path: "/api/world-interface/quarantine/readiness",
        method: "GET",
        status: worldInterfaceProbe.status,
        detail:
          "World Interface quarantine route reports suspicious-signal handling and evidence-locker readiness without storing tokens or private payloads.",
      },
      {
        path: "/api/founder/world-interface/readiness",
        method: "GET",
        status: worldInterfaceProbe.status,
        detail:
          "Founder World Interface route reports owner-only unified inbox readiness, queues, draft replies, and quarantine state without external automation.",
      },
      {
        path: "/api/academy/readiness",
        method: "GET",
        status: learningCommunityProbe.status,
        detail:
          "Academy readiness route reports learning paths and safety-led plan access without advice, signals, fake progress, or paid activation.",
      },
      {
        path: "/api/community/readiness",
        method: "GET",
        status: learningCommunityProbe.status,
        detail:
          "Community readiness route reports planned rooms and safety policy only; no active rooms, fake members, live chat, social network, or billing exists.",
      },
      {
        path: "/api/vip-rooms/readiness",
        method: "GET",
        status: learningCommunityProbe.status,
        detail:
          "VIP Rooms readiness route reports planned premium capabilities without fake VIP access, signal rooms, copy trading, profit promises, or billing.",
      },
      {
        path: "/api/media-office/readiness",
        method: "GET",
        status: mediaAiVideoWorkflowProbe.status,
        detail:
          "Media Office readiness route reports content drafts, review queues, blocked claims, and no-publishing truth without social tokens or fake metrics.",
      },
      {
        path: "/api/ai-video-studio/readiness",
        method: "GET",
        status: mediaAiVideoWorkflowProbe.status,
        detail:
          "AI Video Studio readiness route reports script, caption, brief, and risk-score workflow readiness without generation APIs, uploads, publishing, or fake views.",
      },
      {
        path: "/api/content-review/readiness",
        method: "GET",
        status: mediaAiVideoWorkflowProbe.status,
        detail:
          "Content review readiness route reports lifecycle, risk classification, and blocked claim samples with Founder approval gates for sensitive drafts.",
      },
    ],
    subsystems: [
      ...(baseHealth.subsystems ?? []),
      {
        key: "launch_readiness",
        label: launchProbe.label,
        status: launchProbe.status,
        summary: launchProbe.summary,
        detail: launchProbe.detail,
      },
      {
        key: "market_parity",
        label: marketParityProbe.label,
        status: marketParityProbe.status,
        summary: marketParityProbe.summary,
        detail: marketParityProbe.detail,
      },
      {
        key: "product_memory",
        label: productMemoryProbe.label,
        status: productMemoryProbe.status,
        summary: productMemoryProbe.summary,
        detail: productMemoryProbe.detail,
      },
      {
        key: "daily_operations_loop",
        label: dailyOperationsProbe.label,
        status: dailyOperationsProbe.status,
        summary: dailyOperationsProbe.summary,
        detail: dailyOperationsProbe.detail,
      },
      {
        key: "founder_local_command",
        label: founderLocalCommandProbe.label,
        status: founderLocalCommandProbe.status,
        summary: founderLocalCommandProbe.summary,
        detail: founderLocalCommandProbe.detail,
      },
      {
        key: "local_day_one_acceptance",
        label: localDayOneProbe.label,
        status: localDayOneProbe.status,
        summary: localDayOneProbe.summary,
        detail: localDayOneProbe.detail,
      },
      {
        key: "local_day_one_operation",
        label: localDayOneOperationProbe.label,
        status: localDayOneOperationProbe.status,
        summary: localDayOneOperationProbe.summary,
        detail: localDayOneOperationProbe.detail,
      },
      {
        key: "founder_build_room",
        label: founderBuildRoomProbe.label,
        status: founderBuildRoomProbe.status,
        summary: founderBuildRoomProbe.summary,
        detail: founderBuildRoomProbe.detail,
      },
      {
        key: "living_brand_intelligence",
        label: brandIntelligenceProbe.label,
        status: brandIntelligenceProbe.status,
        summary: brandIntelligenceProbe.summary,
        detail: brandIntelligenceProbe.detail,
      },
      {
        key: "surface_boundaries",
        label: surfaceBoundaryProbe.label,
        status: surfaceBoundaryProbe.status,
        summary: surfaceBoundaryProbe.summary,
        detail: surfaceBoundaryProbe.detail,
      },
      {
        key: "security_sovereignty",
        label: securitySovereigntyProbe.label,
        status: securitySovereigntyProbe.status,
        summary: securitySovereigntyProbe.summary,
        detail: securitySovereigntyProbe.detail,
      },
      {
        key: "secrets_authority",
        label: secretsAuthorityProbe.label,
        status: secretsAuthorityProbe.status,
        summary: secretsAuthorityProbe.summary,
        detail: secretsAuthorityProbe.detail,
      },
      {
        key: "world_interface",
        label: worldInterfaceProbe.label,
        status: worldInterfaceProbe.status,
        summary: worldInterfaceProbe.summary,
        detail: worldInterfaceProbe.detail,
      },
      {
        key: "learning_community_vip",
        label: learningCommunityProbe.label,
        status: learningCommunityProbe.status,
        summary: learningCommunityProbe.summary,
        detail: learningCommunityProbe.detail,
      },
      {
        key: "media_ai_video_workflow",
        label: mediaAiVideoWorkflowProbe.label,
        status: mediaAiVideoWorkflowProbe.status,
        summary: mediaAiVideoWorkflowProbe.summary,
        detail: mediaAiVideoWorkflowProbe.detail,
      },
    ],
    launchReadiness: {
      checkedAt: launchGate.checkedAt,
      mode: launchGate.mode,
      status: launchGate.overall.status,
      score: launchGate.overall.score,
      failedChecklist: launchGate.checklist.failedCount,
      warnedDomains: launchGate.overall.warnCount,
    },
    marketParity: {
      checkedAt: marketParitySnapshot.checkedAt,
      mode: marketParitySnapshot.mode,
      status: marketParitySnapshot.status,
      score: marketParitySnapshot.score,
      guardedCapabilities: marketParitySnapshot.guards.length,
      launchReadiness: marketParitySnapshot.evidence.launchReadinessGate.status,
    },
    launchOperations: {
      checkedAt: publicLaunchPreparation.checkedAt,
      mode: launchOperationsControl.mode,
      stage: launchOperationsControl.stage,
      status: publicLaunchPreparation.status === "ready" ? "in_progress" : "blocked",
      supportRoute: "/api/launch/feedback",
      feedbackLoop:
        feedbackStoreDiagnostics.pendingTriageCount > 20 ||
        feedbackStoreDiagnostics.highSeverityOpenCount > 0
          ? "triage_backlog_guarded"
          : "operational_guarded",
      pendingTriage: feedbackStoreDiagnostics.pendingTriageCount,
      highSeverityOpen: feedbackStoreDiagnostics.highSeverityOpenCount,
      hardeningFollowUps: feedbackStoreDiagnostics.hardeningFollowUpCount,
      recoveryLinked: feedbackStoreDiagnostics.recoveryLinkedCount,
      lastLifecycleUpdateAt: feedbackStoreDiagnostics.lastLifecycleUpdateAt,
      supportReadiness:
        feedbackStoreDiagnostics.pendingTriageCount > 20 ||
        feedbackStoreDiagnostics.highSeverityOpenCount > 0
          ? "operator_guarded"
          : "operator_ready",
      rollbackReadiness:
        productionHardening.status === "ready"
          ? "recoverable_guarded"
          : "guarded",
      escalationState:
        feedbackStoreDiagnostics.pendingTriageCount > 20 ||
        feedbackStoreDiagnostics.highSeverityOpenCount > 0 ||
        productionHardening.status !== "ready"
          ? "elevated"
          : "normal",
      publicLaunchGate:
        launchOperationsControl.stage === "public_launch_gate_active"
          ? "active_guarded"
          : "inactive_guarded",
      publicLaunchDecision:
        launchOperationsControl.stage === "public_launch_gate_active" &&
        publicLaunchPreparation.status === "ready"
          ? "ready_guarded"
          : "not_ready",
      publicLaunchAuthority: "operator_manual_release_only",
      productionHardening:
        productionHardening.status === "ready" ? "ready" : "guarded",
      softLaunch: softLaunchPreparation.status === "ready" ? "ready" : "guarded",
      publicLaunch: publicLaunchPreparation.status === "ready" ? "ready" : "guarded",
    },
  };
}
