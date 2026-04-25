import { getBrandOccasionThemes } from "@/lib/brand/occasion-themes";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    themes: getBrandOccasionThemes(),
    truth: {
      defaultOnlyAutoApplies: true,
      religiousCulturalThemesOptInOnly: true,
      founderApprovalRequiredForPublicOccasions: true,
      fakePartnershipAllowed: false,
    },
  });
}
