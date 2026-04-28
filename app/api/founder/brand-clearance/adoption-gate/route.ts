import { getBrandClearanceSnapshot } from "@/lib/server/brand-clearance";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getBrandClearanceSnapshot();

  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noExternalCalls: true,
    noDomainPurchase: true,
    noPayments: true,
    noLegalClaims: true,
    adoptionGate: snapshot.adoptionGate,
    migrationPlan: snapshot.migrationPlan,
  });
}
