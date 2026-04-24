import { getCompanionContextSnapshot } from "@/lib/server/companion";
import { noStoreJson } from "@/lib/server/security";
import type { CompanionContextInput } from "@/lib/server/companion/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme");
  const planTier = url.searchParams.get("planTier");
  const sessionState = url.searchParams.get("sessionState");
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
  };

  return noStoreJson({
    ok: true,
    snapshot: getCompanionContextSnapshot(input),
  });
}
