import "server-only";
import { prisma } from "@/lib/db/client";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type OpsTelemetrySnapshot = {
  checkedAt: string;
  observability: {
    mode: "local_observability";
    logging: "structured_local";
    metrics: "runtime_process";
    tracing: "inactive";
    alerting: "unconfigured";
  };
  runtime: {
    uptimeSeconds: number;
    heapUsedMb: number;
    rssMb: number;
    nodeVersion: string;
  };
  stores: {
    auditEvents24h: number;
    activeSessions: number;
    accounts: number;
  };
  degradation: {
    status: "stable" | "guarded";
    memoryPressure: "normal" | "elevated";
    sessionBacklog: "normal" | "elevated";
    auditVolume: "stable" | "elevated";
    indicators: string[];
  };
  opsTruth: {
    adminSurface: "operator_guarded_api";
    remoteControl: "not_enabled";
    externalMonitoring: "unconfigured";
    incidentAutomation: "inactive";
  };
  runbookPointers: Array<
    | "/api/ops/runbook"
    | "/api/ops/readiness"
    | "/api/ops/hardening"
    | "/api/diagnostics/probes"
  >;
  readiness: {
    score: number;
    stage: "baseline_ready" | "observability_expanded" | "guarded_operational";
  };
  summary: string;
  limitations: string[];
};

export type OpsRunbookSnapshot = {
  checkedAt: string;
  mode: "operator_manual";
  runbooks: Array<{
    key:
      | "runtime_readiness"
      | "market_feed_truth"
      | "execution_safety"
      | "workflow_delivery"
      | "ops_incident_review";
    label: string;
    state: "ready";
    severity: "baseline" | "elevated";
    probeKey: string;
    steps: string[];
  }>;
  lastReviewedAt: string;
  summary: string;
};

export async function getOpsTelemetrySnapshot(): Promise<OpsTelemetrySnapshot> {
  const checkedAt = new Date().toISOString();
  const [auditEvents24h, activeSessions, accounts] = await Promise.all([
    prisma.auditEvent.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.session.count({
      where: {
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    }),
    prisma.account.count(),
  ]);
  const memory = process.memoryUsage();
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "structured_logging", ok: true, weight: 20 },
      { key: "runtime_metrics", ok: true, weight: 20 },
      { key: "audit_store", ok: true, weight: 20 },
      { key: "operator_guards", ok: true, weight: 20 },
      { key: "external_monitoring", ok: false, weight: 20 },
    ],
    stageThresholds: [
      { stage: "baseline_ready", minScore: 0 },
      { stage: "observability_expanded", minScore: 60 },
      { stage: "guarded_operational", minScore: 80 },
    ],
  });
  const memoryPressure = memory.heapUsed / 1024 / 1024 > 512 ? "elevated" : "normal";
  const sessionBacklog = activeSessions > 25 ? "elevated" : "normal";
  const auditVolume = auditEvents24h > 2000 ? "elevated" : "stable";
  const degradationIndicators = [
    ...(memoryPressure === "elevated" ? (["memory_pressure_elevated"] as const) : []),
    ...(sessionBacklog === "elevated" ? (["session_backlog_elevated"] as const) : []),
    ...(auditVolume === "elevated" ? (["audit_volume_elevated"] as const) : []),
  ];

  return {
    checkedAt,
    observability: {
      mode: "local_observability",
      logging: "structured_local",
      metrics: "runtime_process",
      tracing: "inactive",
      alerting: "unconfigured",
    },
    runtime: {
      uptimeSeconds: Math.max(0, Math.round(process.uptime())),
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      rssMb: Math.round(memory.rss / 1024 / 1024),
      nodeVersion: process.version,
    },
    stores: {
      auditEvents24h,
      activeSessions,
      accounts,
    },
    degradation: {
      status: degradationIndicators.length > 0 ? "guarded" : "stable",
      memoryPressure,
      sessionBacklog,
      auditVolume,
      indicators: degradationIndicators.length > 0 ? degradationIndicators : ["none"],
    },
    opsTruth: {
      adminSurface: "operator_guarded_api",
      remoteControl: "not_enabled",
      externalMonitoring: "unconfigured",
      incidentAutomation: "inactive",
    },
    runbookPointers: [
      "/api/ops/runbook",
      "/api/ops/readiness",
      "/api/ops/hardening",
      "/api/diagnostics/probes",
    ],
    readiness: {
      score: readiness.score,
      stage: readiness.stage as
        | "baseline_ready"
        | "observability_expanded"
        | "guarded_operational",
    },
    summary:
      "Enterprise ops telemetry contracts are active with local structured observability and guarded admin semantics.",
    limitations: [
      "No external monitoring backend is configured.",
      "No remote-control or unattended incident automation is enabled.",
      "Alert delivery remains unconfigured and operator-reviewed.",
    ],
  };
}

export function getOpsRunbookSnapshot(
  checkedAt = new Date().toISOString()
): OpsRunbookSnapshot {
  return {
    checkedAt,
    mode: "operator_manual",
    runbooks: [
      {
        key: "runtime_readiness",
        label: "Runtime readiness verification",
        state: "ready",
        severity: "baseline",
        probeKey: "runtime_ops",
        steps: [
          "Check /api/health for overall readiness and policy truth.",
          "Check /api/diagnostics/probes for subsystem-level probe status.",
          "Confirm build/runtime baseline checks pass before deployment.",
        ],
      },
      {
        key: "market_feed_truth",
        label: "Market feed truth verification",
        state: "ready",
        severity: "baseline",
        probeKey: "market_data",
        steps: [
          "Check /api/market and /api/market/feed-state for fallback-first semantics.",
          "Confirm external feed remains inactive/blocked unless explicitly configured.",
          "Validate degraded reasons are exposed when fallback reliability is reduced.",
        ],
      },
      {
        key: "execution_safety",
        label: "Execution safety verification",
        state: "ready",
        severity: "baseline",
        probeKey: "broker_connector",
        steps: [
          "Confirm /api/broker/state reports real routing blocked.",
          "Confirm workstation and product APIs continue to expose paper-only truth.",
          "Verify unauthenticated account preference/commercial routes remain 401.",
        ],
      },
      {
        key: "workflow_delivery",
        label: "Workflow and delivery verification",
        state: "ready",
        severity: "baseline",
        probeKey: "alerts_delivery_activation",
        steps: [
          "Check /api/alerts/workflows for rule contract integrity.",
          "Check /api/alerts/automation/state for inactive scheduler and local queue truth.",
          "Confirm notification delivery channels remain unconfigured unless truly configured.",
        ],
      },
      {
        key: "ops_incident_review",
        label: "Ops incident review flow",
        state: "ready",
        severity: "elevated",
        probeKey: "production_ops_activation",
        steps: [
          "Review diagnostics subsystem summaries and route probes.",
          "Check /api/ops/hardening for runtime/db durability signals and recovery actions.",
          "Collect relevant audit events before operator intervention.",
          "Apply manual operator action; do not rely on automated incident responders.",
        ],
      },
    ],
    lastReviewedAt: checkedAt,
    summary:
      "Runbook visibility is available for runtime, market/feed truth, execution safety, workflow delivery, and incident review.",
  };
}

export async function getEnterpriseOpsDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  try {
    const telemetry = await getOpsTelemetrySnapshot();

    return {
      key: "enterprise_ops_foundation",
      label: "Enterprise ops foundation",
      status: "ready",
      summary: telemetry.summary,
      detail:
        `Ops readiness ${telemetry.readiness.score}/100 (${telemetry.readiness.stage}). Local observability and runbook contracts are active with truthful unconfigured external monitoring semantics.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "enterprise_ops_foundation",
      label: "Enterprise ops foundation",
      status: "degraded",
      summary: "Enterprise ops contracts degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Enterprise ops diagnostics probe failed.",
      checkedAt,
    };
  }
}
