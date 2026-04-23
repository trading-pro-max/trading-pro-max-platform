import { NextResponse } from "next/server";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getDiagnosticsHealthSnapshot();
  const ready = health.readiness.status === "ready";

  return NextResponse.json(
    {
      ok: ready,
      status: health.readiness.status,
      checkedAt: health.checkedAt,
      paperSafe: true,
      liveExecution: "blocked",
      readiness: health.readiness,
      connectors: health.connectors,
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
