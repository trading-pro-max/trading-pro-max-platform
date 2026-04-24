import { getTpmBrainContextSnapshot } from "@/lib/server/brain";
import { noStoreJson } from "@/lib/server/security";
import type { TpmBrainContextInput } from "@/lib/server/brain/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const planId = url.searchParams.get("planId");
  const skillLevel = url.searchParams.get("skillLevel");
  const riskProfile = url.searchParams.get("riskProfile");
  const input: TpmBrainContextInput = {
    route: url.searchParams.get("route") ?? undefined,
    selectedAsset: url.searchParams.get("asset") ?? undefined,
    timeframe: url.searchParams.get("timeframe") ?? undefined,
    planId:
      planId === "demo_free" ||
      planId === "pro" ||
      planId === "vip" ||
      planId === "enterprise"
        ? planId
        : undefined,
    skillLevel:
      skillLevel === "beginner" ||
      skillLevel === "intermediate" ||
      skillLevel === "advanced" ||
      skillLevel === "professional" ||
      skillLevel === "learning_only"
        ? skillLevel
        : undefined,
    riskProfile:
      riskProfile === "learning" ||
      riskProfile === "conservative" ||
      riskProfile === "balanced" ||
      riskProfile === "active" ||
      riskProfile === "high_caution"
        ? riskProfile
        : undefined,
  };

  return noStoreJson({
    ok: true,
    snapshot: getTpmBrainContextSnapshot(input),
  });
}
