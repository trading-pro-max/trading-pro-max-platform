import { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getFounderCommandAppSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: "founder_construction_readiness",
      access: snapshot.access,
      construction: snapshot.autonomousConstructionIntelligence,
      localUniverseOperations: snapshot.localUniverseOperations,
      persistentProductMemory: snapshot.persistentProductMemory,
      safety: snapshot.safety,
    },
  });
}
