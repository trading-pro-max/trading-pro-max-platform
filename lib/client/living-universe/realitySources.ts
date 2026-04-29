export type RealitySourceStatus =
  | "active"
  | "not_connected"
  | "not_requested"
  | "user_controlled"
  | "local_or_procedural_or_license_safe"
  | "demo_safe_read_only"
  | "review_pending";

export type RealitySource = {
  id: string;
  label: string;
  status: RealitySourceStatus;
  source: string;
  visibleLabel: string;
  warning?: string;
};

const realitySources: Record<string, RealitySource> = {
  deviceTime: {
    id: "deviceTime",
    label: "Time",
    status: "active",
    source: "user_device_clock",
    visibleLabel: "Time: device clock",
  },
  deviceDate: {
    id: "deviceDate",
    label: "Date",
    status: "active",
    source: "user_device_date",
    visibleLabel: "Date: device date",
  },
  season: {
    id: "season",
    label: "Season",
    status: "active",
    source: "device_date_simulation",
    visibleLabel: "Season: device-date simulation",
  },
  dayNight: {
    id: "dayNight",
    label: "Day/Night",
    status: "active",
    source: "device_time_simulation",
    visibleLabel: "Day/Night: device-time simulation",
  },
  weather: {
    id: "weather",
    label: "Weather",
    status: "not_connected",
    source: "none",
    visibleLabel: "Weather: not connected",
    warning: "Weather is not connected.",
  },
  location: {
    id: "location",
    label: "Location",
    status: "not_requested",
    source: "none",
    visibleLabel: "Location: not requested",
  },
  soundscape: {
    id: "soundscape",
    label: "Soundscape",
    status: "user_controlled",
    source: "local_generated_audio",
    visibleLabel: "Soundscape: user controlled",
  },
  earthAssets: {
    id: "earthAssets",
    label: "Earth assets",
    status: "local_or_procedural_or_license_safe",
    source: "asset_manifest",
    visibleLabel: "Earth assets: local/legal-safe/procedural",
  },
  trading: {
    id: "trading",
    label: "Trading",
    status: "demo_safe_read_only",
    source: "internal_demo_state",
    visibleLabel: "Trading: demo-safe/read-only",
  },
  legal: {
    id: "legal",
    label: "Legal",
    status: "review_pending",
    source: "manual_future_review",
    visibleLabel: "Legal review: pending",
    warning: "Legal review is pending.",
  },
};

export type RealitySources = typeof realitySources;
export type RealitySourceKey = keyof RealitySources;

export function getRealitySources(): RealitySources {
  return realitySources;
}

export function getRealitySourceLabel(key: RealitySourceKey): string {
  return realitySources[key].visibleLabel;
}

export function getRealityTruthWarnings(): string[] {
  return Object.values(realitySources)
    .map((source) => source.warning)
    .filter((warning): warning is string => Boolean(warning));
}
