import {
  getFounderPersonalRealityProfiles,
  getPersonalRealityReadinessSnapshot,
} from "@/lib/server/personal-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getPersonalRealityReadinessSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
    founderProfiles: getFounderPersonalRealityProfiles(),
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    productTruth: {
      billingActivated: false,
      liveExecutionActivated: false,
      brokerFeedActivated: false,
      realMoneyActivated: false,
      privateSystemsPublic: false,
    },
  });
}
