import { NextResponse } from "next/server";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";
import type { DiagnosticsRoutePayload } from "@/modules/shell/types/platform-state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getDiagnosticsHealthSnapshot();

  return NextResponse.json(
    {
      ok: health.readiness.status === "ready",
      health,
    } satisfies DiagnosticsRoutePayload,
    { headers: { "Cache-Control": "no-store" } }
  );
}
