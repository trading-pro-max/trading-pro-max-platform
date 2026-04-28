import {
  generateDomainSearchTasks,
  generateTrademarkSearchTasks,
} from "@/lib/server/brand-clearance";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const candidateName = "final global brand candidate";

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
    trademarkSearchTasks: generateTrademarkSearchTasks(candidateName),
    domainSearchTasks: generateDomainSearchTasks(candidateName),
  });
}
