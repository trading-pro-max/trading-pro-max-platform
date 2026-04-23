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
  getAlertWorkflowDiagnosticsProbe,
} from "@/lib/server/workflows";
import { getIntelligenceBackendDiagnosticsProbe } from "@/lib/server/intelligence";
import { getClientExpansionSnapshot } from "@/lib/server/platform/client-contracts";
import { getDesktopAppsDiagnosticsProbe } from "@/lib/server/platform/desktop-foundation";
import { getMobileAppsDiagnosticsProbe } from "@/lib/server/platform/mobile-foundation";
import { getRealIntegrationsDiagnosticsProbe } from "@/lib/server/integrations";
import { getCommercialScalingDiagnosticsProbe } from "@/lib/server/commercial";
import { getEnterpriseOpsDiagnosticsProbe } from "@/lib/server/ops";
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
  mobileFoundation: DiagnosticsProbe;
  integrationsFoundation: DiagnosticsProbe;
  commercialFoundation: DiagnosticsProbe;
  opsFoundation: DiagnosticsProbe;
  workspace: DiagnosticsProbe;
  alerts: DiagnosticsProbe;
  alertsAutomation: DiagnosticsProbe;
  intelligence: DiagnosticsProbe;
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
      path: "/api/intelligence/context",
      method: "GET",
      status: input.intelligence.status,
      detail: "Intelligence context route serves bounded, interpretive-only backend context.",
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
  mobileFoundation: DiagnosticsProbe;
  integrationsFoundation: DiagnosticsProbe;
  commercialFoundation: DiagnosticsProbe;
  opsFoundation: DiagnosticsProbe;
  preferences: DiagnosticsProbe;
  workspace: DiagnosticsProbe;
  productBackend: DiagnosticsProbe;
  market: DiagnosticsProbe;
  broker: DiagnosticsProbe;
  alerts: DiagnosticsProbe;
  alertsAutomation: DiagnosticsProbe;
  intelligence: DiagnosticsProbe;
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
      key: "mobile",
      label: input.mobileFoundation.label,
      status: input.mobileFoundation.status,
      summary: input.mobileFoundation.summary,
      detail: input.mobileFoundation.detail,
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
      key: "ops",
      label: input.opsFoundation.label,
      status: input.opsFoundation.status,
      summary: input.opsFoundation.summary,
      detail: input.opsFoundation.detail,
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
      key: "intelligence",
      label: input.intelligence.label,
      status: input.intelligence.status,
      summary: input.intelligence.summary,
      detail: input.intelligence.detail,
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
    mobileFoundation,
    integrationsFoundation,
    commercialFoundation,
    opsFoundation,
    alerts,
    alertsAutomation,
    intelligence,
  ] = await Promise.all([
    probeServerReadiness(),
    getMarketDiagnosticsProbe(),
    probeWorkspacePreferencePersistence(),
    probeWorkspaceDepthPersistence(),
    getProductBackendDiagnosticsProbe(),
    Promise.resolve(getDesktopAppsDiagnosticsProbe(checkedAt)),
    Promise.resolve(getMobileAppsDiagnosticsProbe(checkedAt)),
    Promise.resolve(getRealIntegrationsDiagnosticsProbe(checkedAt)),
    getCommercialScalingDiagnosticsProbe(),
    getEnterpriseOpsDiagnosticsProbe(),
    getAlertWorkflowDiagnosticsProbe(),
    getAlertAutomationDiagnosticsProbe(),
    getIntelligenceBackendDiagnosticsProbe(),
  ]);
  const runtimeBaseline = probeRuntimeBaseline(checkedAt);
  const runtimeOps = probeRuntimeOps(checkedAt);
  const brokerConnector = getBrokerConnectorSafetySnapshot(checkedAt);
  const broker = getBrokerConnectorDiagnosticsProbe(brokerConnector);
  const brokerIntegration = getBrokerIntegrationSnapshot(checkedAt);
  const marketFeedArchitecture = getMarketFeedArchitectureSnapshot(checkedAt);
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
      integrationsFoundation,
      alerts,
      alertsAutomation,
      intelligence,
    ],
  });

  return {
    checkedAt,
    readiness,
    probes: [
      server,
      runtimeBaseline,
      runtimeOps,
      security,
      desktopFoundation,
      mobileFoundation,
      integrationsFoundation,
      commercialFoundation,
      opsFoundation,
      preferences,
      workspace,
      productBackend,
      market,
      broker,
      alerts,
      alertsAutomation,
      intelligence,
    ],
    connectors: [brokerConnector],
    routes: buildRouteProbes({
      readiness,
      market,
      broker,
      desktopFoundation,
      mobileFoundation,
      integrationsFoundation,
      commercialFoundation,
      opsFoundation,
      workspace,
      alerts,
      alertsAutomation,
      intelligence,
      security,
      productBackend,
      operatorReviewConfigured:
        brokerConnector.operatorReview.state !== "unconfigured",
    }),
    subsystems: buildSubsystems({
      server,
      runtimeOps,
      security,
      desktopFoundation,
      mobileFoundation,
      integrationsFoundation,
      commercialFoundation,
      opsFoundation,
      preferences,
      workspace,
      productBackend,
      market,
      broker,
      alerts,
      alertsAutomation,
      intelligence,
      readiness,
    }),
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
    },
    clientExpansion,
  };
}
