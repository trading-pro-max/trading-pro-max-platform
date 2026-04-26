import {
  getPublicPersonalRealityProfiles,
  getPublicPersonalRealitySettings,
} from "@/lib/server/personal-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    profiles: getPublicPersonalRealityProfiles(),
    settings: getPublicPersonalRealitySettings(),
    publicOnly: true,
  });
}
