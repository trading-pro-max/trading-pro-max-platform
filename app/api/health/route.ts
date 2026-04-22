import { NextResponse } from "next/server";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getDiagnosticsHealthSnapshot();

  return NextResponse.json(
    {
      ok: true,
      status: health.readiness.status,
      checkedAt: health.checkedAt,
      paperSafe: true,
      liveExecution: "blocked",
      readiness: health.readiness,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
