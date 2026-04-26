import { resolveEnvironmentTime, resolveMarketSession } from "@/lib/server/environment";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const time = resolveEnvironmentTime({
    timestamp: searchParams.get("timestamp") ?? undefined,
    timezone: searchParams.get("timezone") ?? undefined,
  });
  const marketSession = resolveMarketSession({
    timestamp: time.date,
    utcDayOfWeek: time.utcDayOfWeek,
    utcHour: time.utcHour,
  });

  return noStoreJson({
    ok: true,
    marketSession,
    truth: {
      atmosphereOnly: true,
      liveFeedImplied: false,
      brokerConnectivityImplied: false,
      tradingAdvice: false,
    },
  });
}
