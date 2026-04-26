import { getSovereignAutonomyReadinessSnapshot } from "@/lib/server/sovereign-autonomy";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getSovereignAutonomyReadinessSnapshot();

  return noStoreJson({
    ok: true,
    mode: "sovereign_codex_task_drafting_readiness",
    taskPassports: snapshot.taskPassports,
    licenses: snapshot.codexLicenses,
    submitReadiness: snapshot.codexSubmitReadiness,
    tribunalReports: snapshot.tribunalReports,
    truth: {
      ...snapshot.truth,
      externalSubmissionActive: false,
      webAppCallsCodexDirectly: false,
    },
  });
}
