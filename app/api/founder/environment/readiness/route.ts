import { getPlanetaryEnvironmentReadinessSnapshot } from "@/lib/server/environment";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = getPlanetaryEnvironmentReadinessSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: readiness.checkedAt,
      status: readiness.status,
      internalName: readiness.internalName,
      publicName: readiness.publicName,
      environment: readiness.snapshot,
      privacy: readiness.privacy,
      publicExposure: readiness.publicExposure,
      nextSafeActions: readiness.nextSafeActions,
      whatNotToAutomate: [
        "Do not request GPS.",
        "Do not connect external weather until a reviewed provider and consent model exist.",
        "Do not use weather, time, moon, or market sessions as trading advice.",
        "Do not make workspace atmosphere louder than the chart.",
      ],
    },
  });
}
