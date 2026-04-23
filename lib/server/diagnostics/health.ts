import "server-only";
import { prisma } from "@/lib/db/client";
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
  getAiIqBrainDeepeningDiagnosticsProbe,
  getAiIqBrainDiagnosticsProbe,
  getIntelligenceBackendDiagnosticsProbe,
} from "@/lib/server/intelligence";
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
  buildLaunchReadinessGateSnapshot,
  getClosedBetaPreparationDiagnosticsProbe,
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
  productionHardening: DiagnosticsProbe;
  opsRecovery: DiagnosticsProbe;
  workspace: DiagnosticsProbe;
  alerts: DiagnosticsProbe;
  alertsAutomation: DiagnosticsProbe;
  alertsDelivery: DiagnosticsProbe;
  intelligence: DiagnosticsProbe;
  aiFoundation: DiagnosticsProbe;
  aiDeepening: DiagnosticsProbe;
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
      detail: `${input.productionHardening.summary}. Route is operator-guarded and requires authentication.`,
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
    productionHardening,
    opsRecovery,
    alerts,
    alertsAutomation,
    alertsDelivery,
    intelligence,
    aiFoundation,
    aiDeepening,
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
    getProductionHardeningDiagnosticsProbe(),
    getOpsRecoveryDiagnosticsProbe(),
    getAlertWorkflowDiagnosticsProbe(),
    getAlertAutomationDiagnosticsProbe(),
    getAlertDeliveryActivationDiagnosticsProbe(),
    getIntelligenceBackendDiagnosticsProbe(),
    getAiIqBrainDiagnosticsProbe(),
    getAiIqBrainDeepeningDiagnosticsProbe(),
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
      productionHardening,
      opsRecovery,
      intelligence,
      aiFoundation,
      aiDeepening,
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
    productionHardening,
    opsRecovery,
    workspace,
    alerts,
    alertsAutomation,
    alertsDelivery,
    intelligence,
    aiFoundation,
    aiDeepening,
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

  return {
    ...baseHealth,
    probes: [...baseHealth.probes, launchProbe, marketParityProbe],
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
      mode: "public_launch_preparation",
      status: publicLaunchPreparation.status === "ready" ? "in_progress" : "blocked",
      supportRoute: "/api/launch/feedback",
      productionHardening:
        productionHardening.status === "ready" ? "ready" : "guarded",
      softLaunch: softLaunchPreparation.status === "ready" ? "ready" : "guarded",
      publicLaunch: publicLaunchPreparation.status === "ready" ? "ready" : "guarded",
    },
  };
}
