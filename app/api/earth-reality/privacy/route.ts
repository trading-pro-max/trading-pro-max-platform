import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    privacy: {
      gpsUsed: false,
      preciseLocationTracking: false,
      hiddenTracking: false,
      exactLocationStored: false,
      weatherLocationIsAtmosphereOnly: true,
      userSelectedRegionFutureOptional: true,
      publicCopy:
        "Earth-native atmosphere uses privacy-safe time, locale, timezone, or explicit manual preference only. It does not require GPS or precise location.",
      validation:
        "Public privacy status is read-only and cannot affect trading decisions.",
    },
  });
}
