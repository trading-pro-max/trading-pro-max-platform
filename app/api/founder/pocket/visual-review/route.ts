import { getAlkonPocketUniverseSnapshot } from "@/lib/server/devices";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getAlkonPocketUniverseSnapshot();

  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    visualAcceptance: snapshot.visualAcceptance,
    safeDecisionOptions: snapshot.decisionOptions,
    blockedActions: snapshot.blockedActions,
    noShell: snapshot.noShell,
    noCodex: snapshot.noCodex,
    noPayments: snapshot.noPayments,
    noSecrets: snapshot.noSecrets,
    noLiveTrading: snapshot.noLiveTrading,
  });
}

