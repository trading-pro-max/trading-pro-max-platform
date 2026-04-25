import {
  getFounderCommandAppSnapshot,
  getFounderCommandReportingSnapshot,
  getFounderCommandRoomFoundationSnapshot,
} from "@/lib/server/founder-command";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getFounderCommandReportingSnapshot();
  const roomFoundation = getFounderCommandRoomFoundationSnapshot(snapshot.checkedAt);
  const commandApp = getFounderCommandAppSnapshot(snapshot.checkedAt);

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: snapshot.mode,
      privateOwnerOnly: snapshot.privateOwnerOnly,
      publicRouteExposed: snapshot.publicRouteExposed,
      briefing: snapshot.briefing,
      coordination: snapshot.coordination,
      truth: snapshot.truth,
      roomFoundation: {
        mode: roomFoundation.mode,
        access: roomFoundation.access,
        visualStyle: roomFoundation.visualStyle,
        overview: roomFoundation.overview,
        ministries: roomFoundation.ministries,
        founderCompanion: roomFoundation.founderCompanion,
        approvalQueue: roomFoundation.approvalQueue,
        guardianLegal: roomFoundation.guardianLegal,
        treasury: roomFoundation.treasury,
        planVisibility: roomFoundation.planVisibility,
        mediaVideo: roomFoundation.mediaVideo,
        coordination: roomFoundation.coordination,
        security: roomFoundation.security,
      },
      commandApp: {
        mode: commandApp.mode,
        access: commandApp.access,
        desktopApp: commandApp.desktopApp,
        mobileApp: commandApp.mobileApp,
        moduleSummary: commandApp.moduleSummary,
        approvalExecutionActive: commandApp.approvalCenter.executionActive,
        safety: commandApp.safety,
        apiReadiness: commandApp.apiReadiness,
      },
    },
  });
}
