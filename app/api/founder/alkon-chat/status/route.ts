import { getAlkonChatReadiness } from "@/lib/server/alkon-chat";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noShell: true,
    noCodex: true,
    noPayments: true,
    noExternalCalls: true,
    snapshot: getAlkonChatReadiness(),
  });
}
