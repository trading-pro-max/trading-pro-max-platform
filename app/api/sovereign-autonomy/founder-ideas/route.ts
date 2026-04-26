import { getFounderIdeaIntakeSamples } from "@/lib/server/sovereign-autonomy";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    mode: "founder_idea_intake_readiness",
    mutationState: "stateless_preview_only",
    samples: getFounderIdeaIntakeSamples(),
    truth: {
      storesSecrets: false,
      persistsPrivateSensitiveData: false,
      executesCommands: false,
      externalCalls: false,
      mutationsEnabled: false,
    },
  });
}
