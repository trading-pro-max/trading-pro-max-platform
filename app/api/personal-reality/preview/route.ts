import {
  buildPersonalRealityPreview,
  type PersonalRealityEngineInput,
} from "@/lib/server/personal-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function planFromParam(value: string | null) {
  if (value === "pro" || value === "vip" || value === "enterprise") return value;
  return "demo_free";
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const input: PersonalRealityEngineInput = {
    userIntent: searchParams.get("intent") ?? "make the platform calmer",
    currentPlan: planFromParam(searchParams.get("plan")),
    currentSurface: searchParams.get("surface") ?? "settings",
    currentEnvironmentMode: searchParams.get("environmentMode") ?? "adaptive",
    currentMotionPreference:
      searchParams.get("motion") === "static"
        ? "static"
        : searchParams.get("motion") === "reduced"
          ? "reduced"
          : "system",
  };

  return noStoreJson({
    ok: true,
    preview: buildPersonalRealityPreview(input),
  });
}
