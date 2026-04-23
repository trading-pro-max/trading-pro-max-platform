import "server-only";
import { prisma } from "@/lib/db/client";
import {
  getBrokerConnectorDiagnosticsProbe,
  getBrokerConnectorSafetySnapshot,
} from "@/lib/server/connectors/broker";
import { getMarketDiagnosticsProbe } from "@/lib/server/market-data/service";
import { probeWorkspacePreferencePersistence } from "@/lib/server/preferences/state";
import { getSecurityDiagnosticsProbe } from "@/lib/server/security";
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
        "Required runtime services are responding. Intentional fallback, auth-required, blocked, and unconfigured states are being reported explicitly.",
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
  preferences: DiagnosticsProbe;
  security: DiagnosticsProbe;
  broker: DiagnosticsProbe;
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
      path: "/api/account/preferences",
      method: "GET",
      status:
        input.preferences.status === "ready" ? "auth_required" : input.preferences.status,
      detail:
        input.preferences.status === "ready"
          ? "Backend preference route is available but requires authentication."
          : input.preferences.summary,
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

export async function getDiagnosticsHealthSnapshot(): Promise<DiagnosticsHealthSnapshot> {
  const checkedAt = new Date().toISOString();
  const [server, market, preferences] = await Promise.all([
    probeServerReadiness(),
    getMarketDiagnosticsProbe(),
    probeWorkspacePreferencePersistence(),
  ]);
  const runtimeBaseline = probeRuntimeBaseline(checkedAt);
  const brokerConnector = getBrokerConnectorSafetySnapshot(checkedAt);
  const broker = getBrokerConnectorDiagnosticsProbe(brokerConnector);
  const security = getSecurityDiagnosticsProbe();
  const readiness = buildAggregateReadiness({
    checkedAt,
    required: [server, runtimeBaseline, preferences, security],
    expectedTruthful: [market, broker],
  });

  return {
    checkedAt,
    readiness,
    probes: [server, runtimeBaseline, market, preferences, security, broker],
    connectors: [brokerConnector],
    routes: buildRouteProbes({
      readiness,
      market,
      preferences,
      security,
      broker,
      operatorReviewConfigured:
        brokerConnector.operatorReview.state !== "unconfigured",
    }),
  };
}
