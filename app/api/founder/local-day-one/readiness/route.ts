import { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";
import {
  getLocalDayOneReadinessSnapshot,
  getLocalDayOneOperationSnapshot,
  getLocalOperationsFinalReportSnapshot,
} from "@/lib/server/local-ops";
import {
  getProductRealityFinalScoreSnapshot,
  getProductRealityLocalStartScoreSnapshot,
} from "@/lib/server/product-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();
  const dayOne = getLocalDayOneReadinessSnapshot(checkedAt);
  const operationGate = getLocalDayOneOperationSnapshot(checkedAt);
  const finalScore = getProductRealityFinalScoreSnapshot(checkedAt);
  const localStartScore = getProductRealityLocalStartScoreSnapshot(checkedAt);
  const finalReport = getLocalOperationsFinalReportSnapshot(checkedAt);
  const founderCommand = getFounderCommandAppSnapshot(checkedAt);

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt,
      mode: "founder_local_day_one_readiness" as const,
      access: founderCommand.access,
      localDayOne: {
        gateStatus: dayOne.gateStatus,
        readyToStartLocalDayOne: dayOne.readyToStartLocalDayOne,
        ahmadHumanReviewRequired: dayOne.ahmadHumanReviewRequired,
        globalLaunchEvaluation: dayOne.globalLaunchEvaluation,
        summary: dayOne.summary,
        blockers: dayOne.blockers,
      },
      productRealityFinalScore: {
        overallScore: finalScore.overallScore,
        status: finalScore.status,
        ahmadHumanAcceptanceRequired:
          finalScore.ahmadHumanAcceptanceRequired,
        noPerfectScoreClaim: finalScore.truth.noPerfectScoreClaim,
      },
      operationGate: {
        status: operationGate.status,
        canStartLocalWork: operationGate.canStartLocalWork,
        canStartOnlyAs: operationGate.canStartOnlyAs,
        ahmadHumanVisualAcceptanceRequired:
          operationGate.ahmadHumanVisualAcceptanceRequired,
        ahmadVisualReviewRecorded: operationGate.ahmadVisualReviewRecorded,
        visualProofDirectory: operationGate.visualProofDirectory,
        remainingLocalBlockers: operationGate.remainingLocalBlockers,
      },
      productRealityLocalStartScore: {
        overallScore: localStartScore.overallScore,
        status: localStartScore.status,
        summary: localStartScore.summary,
        noPerfectScoreClaim: localStartScore.truth.noPerfectScoreClaim,
      },
      finalReport: {
        canStartLocalDayOne: finalReport.canStartLocalDayOne,
        partial: finalReport.partial,
        planned: finalReport.planned,
        blockedByDesign: finalReport.blockedByDesign,
        nextSafeActions: finalReport.nextSafeActions,
      },
      launchForbiddenReminder: dayOne.launchForbiddenReminder,
      safety: founderCommand.safety,
      truth: {
        ...dayOne.truth,
        noApprovalExecution: true,
        noSecrets: true,
        noPrivateSensitiveData: true,
      },
    },
  });
}
