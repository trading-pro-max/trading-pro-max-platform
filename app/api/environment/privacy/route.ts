import { getWeatherProviderReadiness } from "@/lib/server/environment";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    policy: {
      publicName: "Adaptive Atmosphere",
      gpsUsed: false,
      preciseLocationTracking: false,
      hiddenTracking: false,
      exactLocationStored: false,
      externalWeatherCalls: false,
      externalMapAssets: false,
      weatherTradingAdvice: false,
      userControl: ["System", "Adaptive", "Solar", "Weather", "Light", "Dark", "High Contrast", "Static"],
      weather: getWeatherProviderReadiness(),
    },
  });
}
