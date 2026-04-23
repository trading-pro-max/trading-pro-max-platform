import { NextResponse } from "next/server";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";
import { buildLaunchReadinessGateSnapshot } from "@/lib/server/launch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getDiagnosticsHealthSnapshot();
  const launchReadinessGate = buildLaunchReadinessGateSnapshot(health);
  const ready = health.readiness.status === "ready";
  const opsSubsystem = health.subsystems?.find((subsystem) => subsystem.key === "ops");
  const degradedSubsystems =
    health.subsystems
      ?.filter((subsystem) => subsystem.status === "degraded")
      .map((subsystem) => subsystem.key) ?? [];

  return NextResponse.json(
    {
      ok: ready,
      status: health.readiness.status,
      checkedAt: health.checkedAt,
      paperSafe: true,
      liveExecution: "blocked",
      readiness: health.readiness,
      connectors: health.connectors,
      subsystems: health.subsystems ?? [],
      ops: opsSubsystem
        ? {
            status: opsSubsystem.status,
            summary: opsSubsystem.summary,
            detail: opsSubsystem.detail,
          }
        : null,
      policyTruth: health.policyTruth,
      launchReadinessGate: {
        mode: launchReadinessGate.mode,
        status: launchReadinessGate.overall.status,
        score: launchReadinessGate.overall.score,
        failedChecklist: launchReadinessGate.checklist.failedCount,
        warnedDomains: launchReadinessGate.overall.warnCount,
        checkedAt: launchReadinessGate.checkedAt,
      },
      truthSemantics: {
        blocked: [
          "live_execution",
          "real_money_routing",
          "external_money_movement",
          "auto_trading",
        ],
        fallback: ["market_data_fallback_first"],
        unconfigured: [
          "notification_delivery_unconfigured",
          "billing_checkout_inactive",
          "external_monitoring_unconfigured",
        ],
        degraded:
          degradedSubsystems.length > 0
            ? degradedSubsystems
            : ["none"],
      },
      architecture: health.architecture,
      clientExpansion: health.clientExpansion,
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
