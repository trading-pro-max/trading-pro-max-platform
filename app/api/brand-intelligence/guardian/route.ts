import { getIdentityGuardianSnapshot } from "@/lib/server/brand-intelligence";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicSafeCategory(category: string) {
  return category
    .replace("Founder Command as user plan", "restricted command as user plan")
    .replace("Enterprise public label", "legacy non-public plan label");
}

export async function GET() {
  const snapshot = getIdentityGuardianSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: snapshot.mode,
      status: snapshot.status,
      blockedCategories: snapshot.blockedCategories.map(publicSafeCategory),
      samples: Object.fromEntries(
        Object.entries(snapshot.samples).map(([key, review]) => [
          key,
          {
            outcome: review.outcome,
            reasons: review.reasons,
            blockedReasons: review.blockedReasons,
            safeAlternative: review.safeAlternative,
            requiredReviews: review.requiredReviews,
          },
        ])
      ),
      truth: {
        ...snapshot.truth,
        publicSafeOutput: true,
        restrictedVocabularyRedacted: true,
      },
    },
  });
}
