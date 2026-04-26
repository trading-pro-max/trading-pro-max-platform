import type { DeviceContinuityPath } from "./types";

export function getDeviceContinuityPaths(): DeviceContinuityPath[] {
  return [
    {
      pathId: "public_web_to_desktop",
      label: "Web workspace to Desktop App",
      fromDeviceId: "tpm_web_app",
      toDeviceId: "tpm_desktop_app",
      audience: "authenticated_user",
      readiness: "planned",
      syncTruth:
        "Workspace preferences can inform future desktop continuity; no native sync claim is active.",
      blockedClaims: ["No installer", "No fake desktop download", "No live execution"],
    },
    {
      pathId: "academy_to_mobile",
      label: "Academy to Mobile App",
      fromDeviceId: "tpm_web_app",
      toDeviceId: "tpm_mobile_app",
      audience: "authenticated_user",
      readiness: "planned",
      syncTruth:
        "Learning and journal continuity is planned only; no push notification or mobile store claim exists.",
      blockedClaims: ["No App Store claim", "No Play Store claim", "No APK/IPA"],
    },
    {
      pathId: "support_to_mobile",
      label: "Support readiness to Mobile App",
      fromDeviceId: "tpm_web_app",
      toDeviceId: "tpm_mobile_app",
      audience: "authenticated_user",
      readiness: "planned",
      syncTruth:
        "Support continuity is readiness-only until a real provider and privacy policy are configured.",
      blockedClaims: ["No fake ticket backend", "No email sending"],
    },
    {
      pathId: "alkon_desktop_to_mobile",
      label: "Alkon Desktop to Pocket Universe",
      fromDeviceId: "alkon_desktop_command",
      toDeviceId: "alkon_pocket_universe_os",
      audience: "founder_private",
      readiness: "internal_only",
      syncTruth:
        "Private mobile decisions stay planned until trusted-device, step-up, audit, and no-secret gates exist.",
      blockedClaims: ["No shell execution", "No secrets", "No public route"],
    },
    {
      pathId: "alkon_tablet_to_memory",
      label: "Alkon Tablet Review to Memory",
      fromDeviceId: "alkon_tablet_review",
      toDeviceId: "alkon_desktop_command",
      audience: "founder_private",
      readiness: "future",
      syncTruth:
        "Visual acceptance and report review may later feed memory summaries, never raw secrets.",
      blockedClaims: ["No external publishing", "No private sensitive data"],
    },
    {
      pathId: "alkon_watch_to_mobile",
      label: "Alkon Watch Alerts to Pocket Universe",
      fromDeviceId: "alkon_watch_alerts",
      toDeviceId: "alkon_pocket_universe_os",
      audience: "founder_private",
      readiness: "future",
      syncTruth:
        "Future watch alerts are P0-only and route to review; they cannot approve or execute actions.",
      blockedClaims: ["No decisions on watch", "No secret values", "No execution"],
    },
  ];
}
