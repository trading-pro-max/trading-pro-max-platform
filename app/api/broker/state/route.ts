import { noStoreJson } from "@/lib/server/security";
import {
  getBrokerConnectorSafetySnapshot,
  getBrokerIntegrationSnapshot,
} from "@/lib/server/connectors/broker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();
  const integration = getBrokerIntegrationSnapshot(checkedAt);
  const safety = getBrokerConnectorSafetySnapshot(checkedAt);

  return noStoreJson({
    ok: true,
    checkedAt,
    integration,
    safety,
  });
}
