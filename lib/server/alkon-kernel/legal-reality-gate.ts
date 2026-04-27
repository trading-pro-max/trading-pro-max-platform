import type { LegalRealityGate } from "./types";

type LegalGateRequest = {
  billing?: boolean;
  launch?: boolean;
  regulated?: boolean;
  userData?: boolean;
  mediaClaims?: boolean;
};

export function getLegalRealityGate(
  request: LegalGateRequest = {
    billing: true,
    launch: true,
    regulated: true,
    userData: true,
    mediaClaims: true,
  }
): LegalRealityGate {
  const requiredReview = [
    request.launch ? "terms/privacy/support readiness" : "",
    request.billing ? "legal/accounting/refund/support gates" : "",
    request.regulated ? "financial services and FINMA review if applicable" : "",
    request.userData ? "privacy readiness for user data" : "",
    request.mediaClaims ? "claims review for media and public statements" : "",
  ].filter(Boolean);

  return {
    legalStatus: "needs_review",
    requiredReview,
    blockedReason:
      "Real-world launch, billing, regulated activity, user data, and public claims need external reality review before activation.",
    safeAlternative:
      "Keep Pro Max local, paper-safe, read-only where appropriate, and truthfully marked planned/inactive/future.",
  };
}
