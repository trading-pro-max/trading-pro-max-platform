import {
  getCodexPresidencyReport,
  getCodexSovereigntySnapshot,
} from "@/lib/server/codex-sovereignty";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getCodexSovereigntySnapshot();
  const presidencyReport = getCodexPresidencyReport(snapshot.checkedAt);

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: "founder_codex_sovereignty_readiness",
      access: {
        ownerOnly: true,
        publicNavigationVisible: false,
        userPlanExposure: false,
        readOnly: true,
        approvalExecutionActive: false,
        secretsVisible: false,
      },
      status: {
        constructionState: snapshot.status,
        constitution: snapshot.constitution.status,
        level30DraftOnly: presidencyReport.level3Status.level30DraftOnly,
        level31ReadinessOnly: presidencyReport.level3Status.level31ReadinessOnly,
        publicPrivateBoundary: "protected",
        productTruth: "preserved",
      },
      presidencyReport,
      blockedCategories: snapshot.blockedCategories,
      nextSafeActions: snapshot.nextSafeActions,
      whatNotToAutomate: snapshot.whatNotToAutomate,
      truth: snapshot.truth,
    },
  });
}
