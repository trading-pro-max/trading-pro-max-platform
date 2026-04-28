import { getExistenceArchitectureSnapshot } from "@/lib/server/existence-architecture";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getExistenceArchitectureSnapshot();

  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noShell: true,
    noCodex: true,
    noPayments: true,
    noExternalCalls: true,
    jarMappedItems: snapshot.jarMappedItems,
  });
}
