import { NextRequest, NextResponse } from "next/server";
import {
  classifyMarketDataError,
  getMarketDataSnapshot,
} from "@/lib/server/market-data/service";
import type { MarketFeedRoutePayload } from "@/modules/shell/types/platform-state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const marketRequest = {
    symbol: searchParams.get("symbol"),
    timeframe: searchParams.get("timeframe"),
  };
  const snapshot = await getMarketDataSnapshot(marketRequest).catch((error) =>
    getMarketDataSnapshot({
      ...marketRequest,
      degradedReason: classifyMarketDataError(error),
    })
  );

  return NextResponse.json(
    {
      ok: true,
      snapshot,
    } satisfies MarketFeedRoutePayload,
    { headers: { "Cache-Control": "no-store" } }
  );
}
