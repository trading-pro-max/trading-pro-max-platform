import { NextResponse } from "next/server";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";
import { buildLaunchReadinessGateSnapshot } from "@/lib/server/launch";
import { buildFinalMarketParitySnapshot } from "@/lib/server/parity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getDiagnosticsHealthSnapshot();
  const launchGate = buildLaunchReadinessGateSnapshot(health);
  const snapshot = buildFinalMarketParitySnapshot({
    health,
    launchReadinessGate: {
      status: launchGate.overall.status,
      score: launchGate.overall.score,
    },
  });

  return NextResponse.json(
    {
      ok: snapshot.status === "closed",
      snapshot,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
