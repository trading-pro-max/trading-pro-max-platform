import { NextResponse } from "next/server";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getDiagnosticsHealthSnapshot();
  const ready = health.readiness.status === "ready";
  const opsSubsystem = health.subsystems?.find((subsystem) => subsystem.key === "ops");

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
      architecture: health.architecture,
      clientExpansion: health.clientExpansion,
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
