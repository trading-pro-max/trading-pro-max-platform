import { previewFounderIdeaInbox } from "@/lib/server/sovereign-autonomy";
import { noStoreJson, readJsonBody } from "@/lib/server/security";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    preview: previewFounderIdeaInbox({
      title: "Chart visual feedback",
      rawIdea: "The chart feels too busy and should be easier to read.",
      affectedWorld: "public_user_world",
      affectedSurface: "chart",
      urgency: "medium",
      founderIntent: "Preview a chart-first improvement safely.",
      desiredTiming: "next",
      notes: "Sample preview only; nothing is persisted or executed.",
    }),
  });
}

export async function POST(request: NextRequest) {
  const bodyResult = await readJsonBody<Record<string, unknown>>(request, {
    maxBytes: 4096,
  });

  if (!bodyResult.ok) return bodyResult.response;

  return noStoreJson({
    ok: true,
    preview: previewFounderIdeaInbox(bodyResult.body),
  });
}
