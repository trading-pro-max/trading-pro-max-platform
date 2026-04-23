import { NextResponse } from "next/server";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";
import { buildLaunchReadinessGateSnapshot } from "@/lib/server/launch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getDiagnosticsHealthSnapshot();
  const gate = buildLaunchReadinessGateSnapshot(health);

  return NextResponse.json(
    {
      ok: true,
      gate,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
