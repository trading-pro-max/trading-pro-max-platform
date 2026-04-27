import type { NextRequest } from "next/server";
import { runAlkonChatMessage } from "@/lib/server/alkon-chat";
import {
  noStoreJson,
  normalizeClientText,
  readJsonBody,
  rejectCrossOriginMutation,
} from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AlkonChatMessageBody = {
  message?: unknown;
};

export async function POST(request: NextRequest) {
  const crossOriginBlock = rejectCrossOriginMutation(request);
  if (crossOriginBlock) return crossOriginBlock;

  const bodyResult = await readJsonBody<AlkonChatMessageBody>(request, {
    maxBytes: 2 * 1024,
  });
  if (!bodyResult.ok) return bodyResult.response;

  const message = normalizeClientText(bodyResult.body.message, 512);
  if (!message) {
    return noStoreJson(
      { ok: false, error: "Message is required." },
      400
    );
  }

  const result = runAlkonChatMessage(message);

  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noShell: true,
    noCodexCalls: true,
    noPayments: true,
    noExternalCalls: true,
    noSecrets: true,
    result,
  });
}
