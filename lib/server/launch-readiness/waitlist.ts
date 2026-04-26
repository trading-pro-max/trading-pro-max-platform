import "server-only";

import type { WaitlistReadinessSnapshot } from "./types";

export function getWaitlistReadinessSnapshot(
  checkedAt = new Date().toISOString()
): WaitlistReadinessSnapshot {
  return {
    checkedAt,
    status: "partial",
    publicCopy: "Waitlist planned",
    emailCapture: "future_provider_required",
    privacyNoticeRequired: true,
    fakeSignupCountAllowed: false,
    emailSendingActive: false,
    hiddenTrackingAllowed: false,
    backendActive: false,
  };
}
