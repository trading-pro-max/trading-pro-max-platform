import { getCodexSovereigntySnapshot } from "@/lib/server/codex-sovereignty";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getCodexSovereigntySnapshot();

  return noStoreJson({
    ok: true,
    mode: "codex_execution_permit_samples",
    executionPermits: snapshot.executionPermits,
    autoSubmitGovernance: snapshot.autoSubmitGovernance,
    truth: snapshot.truth,
  });
}
