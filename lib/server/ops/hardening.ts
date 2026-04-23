import "server-only";
import { performance } from "node:perf_hooks";
import { prisma } from "@/lib/db/client";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

type HardeningStage =
  | "baseline_hardened"
  | "rollout_hardened"
  | "operational_resilient";

type DbProbeResult = {
  ok: boolean;
  roundTripMs: number;
  timedOut: boolean;
};

export type OpsProductionHardeningSnapshot = {
  checkedAt: string;
  runtime: {
    uptimeSeconds: number;
    heapUsedMb: number;
    rssMb: number;
    nodeVersion: string;
    state: "stable" | "guarded";
  };
  database: {
    state: "reachable" | "guarded";
    roundTripMs: number;
    timeoutMs: number;
    timedOut: boolean;
  };
  durability: {
    preferenceProfiles: number;
    workspaceDepthSnapshots: number;
    staleSessions: number;
    state: "stable" | "guarded";
  };
  degraded: {
    status: "stable" | "guarded";
    signals: string[];
    failureMode: "truthful_degraded_disclosure";
    recoveryMode: "operator_guided_manual";
  };
  safeguards: {
    responseTimeouts: "bounded";
    retryPolicy: "single_retry_with_truthful_failure";
    fallbackPolicy: "fallback_first";
    executionSafety: "paper_only_live_blocked";
  };
  recovery: {
    runbookRoute: "/api/ops/runbook";
    readinessRoute: "/api/ops/readiness";
    diagnosticsRoute: "/api/diagnostics/probes";
    hardeningRoute: "/api/ops/hardening";
    recommendedActions: string[];
  };
  readiness: {
    score: number;
    stage: HardeningStage;
  };
  summary: string;
  limitations: string[];
};

export type OpsRecoverySnapshot = {
  checkedAt: string;
  mode: "operator_recovery_guarded";
  stage: "recoverable" | "guarded";
  rollback: {
    strategy: "manual_checkpoint_restore";
    rollbackWindowMinutes: number;
    readiness: "recoverable" | "guarded";
    requiresOperatorConfirmation: true;
    checkpoints: Array<
      | "capture_diagnostics_snapshot"
      | "freeze_new_rollout_changes"
      | "restore_runtime_checkpoint"
      | "verify_policy_truth"
    >;
  };
  failurePaths: {
    databasePath: "manual_operator_restore";
    runtimePath: "manual_process_recycle";
    sessionPath: "manual_session_hygiene";
    workflowPath: "manual_queue_review";
  };
  truth: {
    automation: "inactive";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    launchClaim: "not_launched";
  };
  references: {
    runbookRoute: "/api/ops/runbook";
    readinessRoute: "/api/ops/readiness";
    hardeningRoute: "/api/ops/hardening";
    diagnosticsRoute: "/api/diagnostics/probes";
  };
  recommendedActions: string[];
  summary: string;
  limitations: string[];
};

function timeoutAfter(ms: number) {
  return new Promise<never>((_, reject) => {
    const handle = setTimeout(() => {
      reject(new Error("database_probe_timeout"));
    }, ms);
    handle.unref?.();
  });
}

async function measureDatabaseProbe(timeoutMs: number): Promise<DbProbeResult> {
  const started = performance.now();

  try {
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeoutAfter(timeoutMs)]);

    return {
      ok: true,
      roundTripMs: Math.max(1, Math.round(performance.now() - started)),
      timedOut: false,
    };
  } catch {
    return {
      ok: false,
      roundTripMs: Math.max(1, Math.round(performance.now() - started)),
      timedOut: true,
    };
  }
}

function buildRecoveryActions(signals: string[]) {
  const actions = [
    "Review /api/diagnostics/probes for subsystem-level status transitions.",
    "Run /api/ops/runbook and execute manual incident review flow.",
  ];

  if (signals.includes("database_unreachable")) {
    actions.push("Restore local database availability before accepting further rollout traffic.");
  }
  if (signals.includes("stale_sessions_elevated")) {
    actions.push("Invalidate stale sessions and review session-expiry hygiene.");
  }
  if (signals.includes("memory_pressure_elevated")) {
    actions.push("Recycle process with operator supervision after collecting diagnostics evidence.");
  }

  return actions;
}

export async function getOpsProductionHardeningSnapshot(
  checkedAt = new Date().toISOString()
): Promise<OpsProductionHardeningSnapshot> {
  const timeoutMs = Number(process.env.TPM_OPS_DB_PROBE_TIMEOUT_MS ?? 1500);
  const safeTimeoutMs = Number.isFinite(timeoutMs) && timeoutMs > 0
    ? Math.min(10_000, Math.max(250, Math.round(timeoutMs)))
    : 1500;

  const databaseProbe = await measureDatabaseProbe(safeTimeoutMs);
  const memory = process.memoryUsage();
  const heapUsedMb = Math.round(memory.heapUsed / 1024 / 1024);
  const rssMb = Math.round(memory.rss / 1024 / 1024);

  let preferenceProfiles = 0;
  let workspaceDepthSnapshots = 0;
  let staleSessions = 0;

  if (databaseProbe.ok) {
    const stores = await Promise.all([
      prisma.workspacePreference.count(),
      prisma.auditEvent.count({
        where: {
          kind: "workspace_depth_changed",
          scope: "platform",
        },
      }),
      prisma.session.count({
        where: {
          revokedAt: null,
          expiresAt: {
            lte: new Date(),
          },
        },
      }),
    ]);

    [preferenceProfiles, workspaceDepthSnapshots, staleSessions] = stores;
  }

  const runtimeState = heapUsedMb > 640 || rssMb > 1024 ? "guarded" : "stable";
  const databaseState = databaseProbe.ok ? "reachable" : "guarded";
  const durabilityState = staleSessions > 5 ? "guarded" : "stable";
  const latencyGuard = databaseProbe.ok && databaseProbe.roundTripMs <= 250;

  const degradationSignals = [
    ...(databaseProbe.ok ? ([] as string[]) : ["database_unreachable"]),
    ...(databaseProbe.timedOut ? (["database_probe_timeout"] as string[]) : []),
    ...(!latencyGuard ? (["database_latency_guarded"] as string[]) : []),
    ...(runtimeState === "guarded" ? (["memory_pressure_elevated"] as string[]) : []),
    ...(durabilityState === "guarded" ? (["stale_sessions_elevated"] as string[]) : []),
  ];

  const readiness = buildReadinessSnapshot({
    components: [
      { key: "database_reachable", ok: databaseProbe.ok, weight: 25 },
      { key: "database_latency_guard", ok: latencyGuard, weight: 15 },
      { key: "runtime_memory_guard", ok: runtimeState === "stable", weight: 15 },
      { key: "session_hygiene_guard", ok: staleSessions <= 5, weight: 10 },
      { key: "durability_contract", ok: databaseProbe.ok, weight: 15 },
      { key: "degraded_disclosure", ok: true, weight: 10 },
      { key: "paper_execution_safety", ok: true, weight: 10 },
    ],
    stageThresholds: [
      { stage: "baseline_hardened", minScore: 0 },
      { stage: "rollout_hardened", minScore: 60 },
      { stage: "operational_resilient", minScore: 85 },
    ],
  });

  return {
    checkedAt,
    runtime: {
      uptimeSeconds: Math.max(0, Math.round(process.uptime())),
      heapUsedMb,
      rssMb,
      nodeVersion: process.version,
      state: runtimeState,
    },
    database: {
      state: databaseState,
      roundTripMs: databaseProbe.roundTripMs,
      timeoutMs: safeTimeoutMs,
      timedOut: databaseProbe.timedOut,
    },
    durability: {
      preferenceProfiles,
      workspaceDepthSnapshots,
      staleSessions,
      state: durabilityState,
    },
    degraded: {
      status: degradationSignals.length > 0 ? "guarded" : "stable",
      signals: degradationSignals.length > 0 ? degradationSignals : ["none"],
      failureMode: "truthful_degraded_disclosure",
      recoveryMode: "operator_guided_manual",
    },
    safeguards: {
      responseTimeouts: "bounded",
      retryPolicy: "single_retry_with_truthful_failure",
      fallbackPolicy: "fallback_first",
      executionSafety: "paper_only_live_blocked",
    },
    recovery: {
      runbookRoute: "/api/ops/runbook",
      readinessRoute: "/api/ops/readiness",
      diagnosticsRoute: "/api/diagnostics/probes",
      hardeningRoute: "/api/ops/hardening",
      recommendedActions: buildRecoveryActions(degradationSignals),
    },
    readiness: {
      score: readiness.score,
      stage: readiness.stage as HardeningStage,
    },
    summary:
      "Production hardening contracts are active with bounded DB/runtime probes, degraded-state disclosure, and operator-guided recovery flow.",
    limitations: [
      "Hardening remains operator-guided; no unattended remediation is enabled.",
      "Database probes are local-runtime checks and do not imply multi-region durability.",
      "Execution safety remains paper-only with live routing blocked.",
    ],
  };
}

export async function getProductionHardeningDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): Promise<DiagnosticsProbe> {
  try {
    const snapshot = await getOpsProductionHardeningSnapshot(checkedAt);

    return {
      key: "production_hardening",
      label: "Production hardening",
      status: snapshot.degraded.status === "stable" ? "ready" : "degraded",
      summary: snapshot.summary,
      detail:
        `Hardening readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}); ` +
        `db=${snapshot.database.state} ${snapshot.database.roundTripMs}ms, runtime=${snapshot.runtime.state}, durability=${snapshot.durability.state}.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "production_hardening",
      label: "Production hardening",
      status: "degraded",
      summary: "Production hardening probe degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Production hardening diagnostics probe failed.",
      checkedAt,
    };
  }
}

export async function getOpsRecoverySnapshot(
  checkedAt = new Date().toISOString()
): Promise<OpsRecoverySnapshot> {
  const hardening = await getOpsProductionHardeningSnapshot(checkedAt);
  const stage = hardening.degraded.status === "stable" ? "recoverable" : "guarded";

  return {
    checkedAt,
    mode: "operator_recovery_guarded",
    stage,
    rollback: {
      strategy: "manual_checkpoint_restore",
      rollbackWindowMinutes: 90,
      readiness: stage,
      requiresOperatorConfirmation: true,
      checkpoints: [
        "capture_diagnostics_snapshot",
        "freeze_new_rollout_changes",
        "restore_runtime_checkpoint",
        "verify_policy_truth",
      ],
    },
    failurePaths: {
      databasePath: "manual_operator_restore",
      runtimePath: "manual_process_recycle",
      sessionPath: "manual_session_hygiene",
      workflowPath: "manual_queue_review",
    },
    truth: {
      automation: "inactive",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      launchClaim: "not_launched",
    },
    references: {
      runbookRoute: "/api/ops/runbook",
      readinessRoute: "/api/ops/readiness",
      hardeningRoute: "/api/ops/hardening",
      diagnosticsRoute: "/api/diagnostics/probes",
    },
    recommendedActions: hardening.recovery.recommendedActions,
    summary:
      "Operator recovery contract is available with guarded rollback semantics and explicit no-automation truth.",
    limitations: [
      "Recovery remains operator-manual and does not execute unattended rollback.",
      "Rollback checkpoints are local-runtime safeguards and not multi-region failover claims.",
      "Execution policy remains paper-only with live routing blocked.",
    ],
  };
}

export async function getOpsRecoveryDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): Promise<DiagnosticsProbe> {
  try {
    const snapshot = await getOpsRecoverySnapshot(checkedAt);

    return {
      key: "ops_recovery",
      label: "Ops recovery flow",
      status: snapshot.stage === "recoverable" ? "ready" : "degraded",
      summary: snapshot.summary,
      detail:
        `Recovery stage=${snapshot.stage}; rollback=${snapshot.rollback.strategy}; ` +
        `automation=${snapshot.truth.automation}; checkpoints=${snapshot.rollback.checkpoints.length}.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "ops_recovery",
      label: "Ops recovery flow",
      status: "degraded",
      summary: "Ops recovery diagnostics degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Ops recovery diagnostics probe failed.",
      checkedAt,
    };
  }
}
