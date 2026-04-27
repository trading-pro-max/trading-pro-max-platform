import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type DeviceWorld =
  | "public_earth"
  | "private_alkon"
  | "invisible_operating_layer";

export type DeviceType = "web" | "desktop" | "mobile" | "tablet" | "watch";

export type DeviceAvailability =
  | "current"
  | "planned"
  | "future"
  | "internal_only"
  | "blocked";

export type DeviceAudience =
  | "public_user"
  | "authenticated_user"
  | "founder_private"
  | "internal_only";

export type DevicePermissionLevel =
  | "public_view"
  | "authenticated_use"
  | "paper_workspace"
  | "review_only"
  | "approve_low_risk"
  | "founder_command"
  | "alert_only"
  | "forbidden";

export type DeviceSecurityPosture =
  | "public_safe"
  | "account_required"
  | "trusted_device_required"
  | "step_up_required"
  | "biometric_planned"
  | "passkey_planned"
  | "internal_only";

export type DeviceCapability =
  | "public_entry"
  | "paper_workspace"
  | "plans_view"
  | "assistant"
  | "journal_coach_basic"
  | "academy_support"
  | "settings_diagnostics"
  | "deep_work_terminal_planned"
  | "mobile_status_planned"
  | "learning_review_future"
  | "full_private_command"
  | "mobile_pulse_planned"
  | "visual_review_future"
  | "p0_alerts_future"
  | "local_build_center"
  | "wake_report_review"
  | "one_next_action_review"
  | "mobile_visual_review"
  | "focused_correction_intent";

export type DeviceBlockedCapability =
  | "live_execution"
  | "real_money"
  | "billing_activation"
  | "broker_feed_activation"
  | "production_activation"
  | "production_secrets"
  | "codex_execution"
  | "payment_execution"
  | "social_publishing"
  | "shell_execution"
  | "public_private_systems"
  | "fake_downloads"
  | "fake_store_claims"
  | "fake_metrics";

export type PrivateDeviceConstellationRole =
  | "public_device_truth"
  | "windows_command_build_center"
  | "iphone_pocket_decision_center"
  | "samsung_review_android_reality_center"
  | "legacy_internal_readiness";

export type DeviceRegistryItem = {
  deviceId: string;
  publicName: string;
  privateName: string;
  world: DeviceWorld;
  type: DeviceType;
  audience: DeviceAudience;
  availability: DeviceAvailability;
  role: string;
  allowedCapabilities: DeviceCapability[];
  blockedCapabilities: DeviceBlockedCapability[];
  permissionLevel: DevicePermissionLevel;
  constellationRole: PrivateDeviceConstellationRole;
  securityPosture: DeviceSecurityPosture[];
  publicVisible: boolean;
  founderVisible: boolean;
  appStoreStatus: "not_applicable" | "not_published" | "planned" | "future" | "internal_only";
  installStatus: "web_current" | "not_shipped" | "planned" | "future" | "internal_only";
  continuityRole: string;
  productTruthNotes: string[];
  nextSafeAction: string;
};

export type PocketDecisionOption =
  | "accept"
  | "reject_with_notes"
  | "focused_correction";

export type AlkonPocketUniverseSnapshot = {
  checkedAt: string;
  mode: "alkon_pocket_universe";
  founderOnly: true;
  readOnly: true;
  previewOnly: true;
  publicExposure: false;
  station: "Local Day One Gate";
  localDayOne: "not_started";
  heartStatus: "Prime World heart preserved behind Alkon";
  visualAcceptance: "visual_acceptance_needed";
  wakeReport: {
    status: string;
    mission: string;
    done: string;
    notDone: string;
    next: string;
  };
  oneNextAction: string;
  decisionOptions: PocketDecisionOption[];
  deviceRoles: Array<{
    deviceId: string;
    privateName: string;
    role: string;
    constellationRole: PrivateDeviceConstellationRole;
    allowed: DeviceCapability[];
    blocked: DeviceBlockedCapability[];
  }>;
  blockedActions: DeviceBlockedCapability[];
  whatNotToDo: string[];
  noShell: true;
  noCodex: true;
  noPayments: true;
  noSecrets: true;
  noLiveTrading: true;
};

export type PublicDeviceRegistryItem = Omit<
  DeviceRegistryItem,
  "privateName" | "founderVisible"
> & {
  world: "public_earth";
  audience: "public_user" | "authenticated_user";
  publicVisible: true;
};

export type DevicePermissionRule = {
  deviceId: string;
  permissionLevel: DevicePermissionLevel;
  allowed: string[];
  blocked: DeviceBlockedCapability[];
  reason: string;
  founderApprovalRequired: boolean;
};

export type DeviceSecurityReadiness = {
  deviceId: string;
  publicName: string;
  posture: DeviceSecurityPosture[];
  requirements: string[];
  secretsVisible: false;
  executionControlsEnabled: false;
  nextSafeAction: string;
};

export type DeviceContinuityPath = {
  pathId: string;
  label: string;
  fromDeviceId: string;
  toDeviceId: string;
  audience: DeviceAudience;
  readiness: "current" | "planned" | "future" | "internal_only";
  syncTruth: string;
  blockedClaims: string[];
};

export type PublicDeviceReadinessSnapshot = {
  checkedAt: string;
  mode: "public_device_world";
  status: "ready_with_notes";
  devices: PublicDeviceRegistryItem[];
  appsPlatformsTruth: {
    webApp: "current";
    desktopApp: "planned";
    mobileApp: "planned";
    tabletApp: "future";
    fakeDownloads: false;
    appStoreClaims: false;
  };
  productTruth: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    billingInactive: true;
    brokerFeedInactive: true;
    publicLaunchInactive: true;
    internalDeviceExposure: false;
  };
  nextSafeActions: string[];
};

export type FounderDeviceReadinessSnapshot = {
  checkedAt: string;
  mode: "alkon_device_constellation";
  status: "ready_with_notes";
  publicDevices: DeviceRegistryItem[];
  privateDevices: DeviceRegistryItem[];
  permissionRules: DevicePermissionRule[];
  securityReadiness: DeviceSecurityReadiness[];
  continuity: DeviceContinuityPath[];
  publicExposure: false;
  noExecution: true;
  noSecrets: true;
  officialConstellation: {
    windows: "Windows Command + Build Center";
    iphone: "iPhone Pocket Decision Center";
    samsung: "Samsung Review + Android Reality Center";
  };
  nextSafeActions: string[];
  blockedActions: DeviceBlockedCapability[];
};

export type DeviceDiagnosticsSnapshot = {
  public: PublicDeviceReadinessSnapshot;
  founder: FounderDeviceReadinessSnapshot;
  probe: DiagnosticsProbe;
};
