import {
  buildCompanionDailyUseSamples,
  buildCompanionResponseTemplates,
  getCompanionContextSnapshot,
} from "@/lib/server/companion";
import { noStoreJson } from "@/lib/server/security";
import type { CompanionContextInput } from "@/lib/server/companion/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme");
  const planTier = url.searchParams.get("planTier");
  const sessionState = url.searchParams.get("sessionState");
  const skillLevel = url.searchParams.get("skillLevel");
  const riskProfile = url.searchParams.get("riskProfile");
  const input: CompanionContextInput = {
    route: url.searchParams.get("route") ?? undefined,
    language: url.searchParams.get("language") ?? undefined,
    selectedAsset: url.searchParams.get("asset") ?? undefined,
    timeframe: url.searchParams.get("timeframe") ?? undefined,
    theme:
      theme === "dark" || theme === "light" || theme === "system"
        ? theme
        : undefined,
    planTier:
      planTier === "demo_free" ||
      planTier === "pro" ||
      planTier === "vip" ||
      planTier === "enterprise"
        ? planTier
        : undefined,
    sessionState:
      sessionState === "authenticated_safe" || sessionState === "anonymous"
        ? sessionState
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

  const snapshot = getCompanionContextSnapshot(input);

  return noStoreJson({
    ok: true,
    snapshot,
    responses: buildCompanionResponseTemplates(snapshot),
    samples: buildCompanionDailyUseSamples(snapshot),
  });
}
