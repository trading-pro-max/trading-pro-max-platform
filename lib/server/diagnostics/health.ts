import "server-only";
import { prisma } from "@/lib/db/client";
import { getMarketDiagnosticsProbe } from "@/lib/server/market-data/service";
import { probeWorkspacePreferencePersistence } from "@/lib/server/preferences/state";
import { getSecurityDiagnosticsProbe } from "@/lib/server/security";
import type {
  DiagnosticsHealthSnapshot,
  DiagnosticsProbe,
  DiagnosticsRouteProbe,
} from "@/modules/shell/types/platform-state";

const BROKER_CONNECTOR_URL = process.env.TPM_BROKER_CONNECTOR_URL?.trim();

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
      status: "degraded",
      summary: "Server runtime degraded",
      detail:
        error instanceof Error ? error.message : "Server readiness probe failed.",
      checkedAt,
    };
  }
}

function buildBrokerConnectorProbe(checkedAt: string): DiagnosticsProbe {
  if (!BROKER_CONNECTOR_URL) {
    return {
      key: "broker_connector",
      label: "Connector visibility",
      status: "unconfigured",
      summary: "No broker connector configured",
      detail:
        "Broker connectivity is not configured, activation is blocked, and real-money execution remains disabled.",
      checkedAt,
    };
  }

  return {
    key: "broker_connector",
    label: "Connector visibility",
    status: "blocked",
    summary: "Connector configured but blocked",
    detail:
      "A connector endpoint is configured for future integration work, but broker activation and real-money execution remain blocked by policy.",
    checkedAt,
  };
}

function buildRouteProbes(input: {
  market: DiagnosticsProbe;
  preferences: DiagnosticsProbe;
  security: DiagnosticsProbe;
}): DiagnosticsRouteProbe[] {
  return [
    {
      path: "/api/health",
      method: "GET",
      status: "ready",
      detail: "External readiness probe is available.",
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
      status: "blocked",
      detail: "Operator review requires operator auth plus an explicit operator secret.",
    },
  ];
}

export async function getDiagnosticsHealthSnapshot(): Promise<DiagnosticsHealthSnapshot> {
  const checkedAt = new Date().toISOString();
  const [readiness, market, preferences] = await Promise.all([
    probeServerReadiness(),
    getMarketDiagnosticsProbe(),
    probeWorkspacePreferencePersistence(),
  ]);
  const broker = buildBrokerConnectorProbe(checkedAt);
  const security = getSecurityDiagnosticsProbe();

  return {
    checkedAt,
    readiness,
    probes: [market, preferences, security, broker],
    routes: buildRouteProbes({
      market,
      preferences,
      security,
    }),
  };
}
