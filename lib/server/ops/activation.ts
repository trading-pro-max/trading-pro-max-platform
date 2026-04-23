import "server-only";
import { prisma } from "@/lib/db/client";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

type OpsActivationStage =
  | "baseline_ready"
  | "activation_guarded"
  | "operational_guarded";

export type OpsProductionActivationSnapshot = {
  checkedAt: string;
  telemetryActivation: {
    logging: "structured_local";
    metrics: "runtime_process";
    tracing: "inactive" | "configured_guarded";
    externalMonitoring: "unconfigured" | "configured_guarded";
    incidentSignals: "guarded_local";
  };
  readiness: {
    score: number;
    stage: OpsActivationStage;
  };
  adminGuard: {
    operatorApi: "guarded";
    remoteAdmin: "not_enabled";
    commandExecution: "manual_review_required";
    maintenanceMode: "manual_only";
  };
  runbookFlow: {
    readinessReview: "manual_operator";
    incidentReview: "manual_operator";
    escalation: "manual_operator";
    automation: "inactive";
  };
  stores: {
    auditEvents24h: number;
    activeSessions: number;
    pendingComplianceReviews: number;
  };
  summary: string;
  limitations: string[];
};

function isConfigured(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export async function getOpsProductionActivationSnapshot(): Promise<OpsProductionActivationSnapshot> {
  const checkedAt = new Date().toISOString();
  const tracingConfigured = isConfigured(process.env.TPM_OPS_TRACING_ENDPOINT);
  const externalMonitoringConfigured = isConfigured(
    process.env.TPM_OPS_EXTERNAL_MONITOR_URL
  );
  const [auditEvents24h, activeSessions, pendingComplianceReviews] = await Promise.all([
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
        expiresAt: { gt: new Date() },
      },
    }),
    prisma.complianceReview.count({
      where: {
        state: { in: ["not_started", "in_progress", "pending_review"] },
      },
    }),
  ]);
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "local_logging", ok: true, weight: 20 },
      { key: "runtime_metrics", ok: true, weight: 20 },
      { key: "incident_signals", ok: true, weight: 15 },
      { key: "runbook_flow", ok: true, weight: 15 },
      { key: "tracing_endpoint", ok: tracingConfigured, weight: 10 },
      { key: "external_monitoring", ok: externalMonitoringConfigured, weight: 10 },
      { key: "admin_guard", ok: true, weight: 10 },
    ],
    stageThresholds: [
      { stage: "baseline_ready", minScore: 0 },
      { stage: "activation_guarded", minScore: 60 },
      { stage: "operational_guarded", minScore: 85 },
    ],
  });

  return {
    checkedAt,
    telemetryActivation: {
      logging: "structured_local",
      metrics: "runtime_process",
      tracing: tracingConfigured ? "configured_guarded" : "inactive",
      externalMonitoring: externalMonitoringConfigured
        ? "configured_guarded"
        : "unconfigured",
      incidentSignals: "guarded_local",
    },
    readiness: {
      score: readiness.score,
      stage: readiness.stage as OpsActivationStage,
    },
    adminGuard: {
      operatorApi: "guarded",
      remoteAdmin: "not_enabled",
      commandExecution: "manual_review_required",
      maintenanceMode: "manual_only",
    },
    runbookFlow: {
      readinessReview: "manual_operator",
      incidentReview: "manual_operator",
      escalation: "manual_operator",
      automation: "inactive",
    },
    stores: {
      auditEvents24h,
      activeSessions,
      pendingComplianceReviews,
    },
    summary:
      "Production-ops activation is available with guarded telemetry, runbook, and admin-control semantics.",
    limitations: [
      "No remote admin control is enabled.",
      "Incident handling remains operator-manual; no unattended ops automation.",
      "External monitoring/tracing remains explicitly unconfigured unless provided.",
    ],
  };
}

export async function getOpsProductionActivationDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  try {
    const snapshot = await getOpsProductionActivationSnapshot();

    return {
      key: "production_ops_activation",
      label: "Production ops activation",
      status: "ready",
      summary: snapshot.summary,
      detail:
        `Ops activation readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}) with guarded admin truth and explicit monitoring/tracing states.`,
      checkedAt: snapshot.checkedAt,
    };
  } catch (error) {
    return {
      key: "production_ops_activation",
      label: "Production ops activation",
      status: "degraded",
      summary: "Production ops activation degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Production ops activation diagnostics probe failed.",
      checkedAt: new Date().toISOString(),
    };
  }
}
