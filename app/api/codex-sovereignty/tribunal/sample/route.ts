import { getCodexSovereigntySnapshot } from "@/lib/server/codex-sovereignty";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getCodexSovereigntySnapshot();

  return noStoreJson({
    ok: true,
    mode: "codex_result_tribunal_samples",
    resultTribunal: snapshot.resultTribunal,
    memoryLessons: snapshot.memoryLessons,
    truth: snapshot.truth,
  });
}
