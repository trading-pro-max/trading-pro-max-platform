import { getCodexSovereigntySnapshot } from "@/lib/server/codex-sovereignty";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getCodexSovereigntySnapshot();

  return noStoreJson({
    ok: true,
    mode: "codex_task_passport_samples",
    taskPassports: snapshot.taskPassports,
    truth: snapshot.truth,
  });
}
