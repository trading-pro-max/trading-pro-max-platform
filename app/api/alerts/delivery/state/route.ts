import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import { getAlertDeliveryActivationSnapshot } from "@/lib/server/workflows";
import { getRequestContext, noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(getSessionTokenFromRequest(request), getRequestContext(request));
}

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson({ ok: false, authenticated: false }, 401);
  }

  const snapshot = await getAlertDeliveryActivationSnapshot(session.account.id);

  return noStoreJson({
    ok: true,
    authenticated: true,
    snapshot,
  });
}
