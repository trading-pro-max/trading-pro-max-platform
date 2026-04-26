export type EarthFocusRegion =
  | "europe"
  | "middle_east"
  | "north_america"
  | "south_america"
  | "east_asia"
  | "africa"
  | "oceania"
  | "global";

export type LivingEarthSurface =
  | "public_entry"
  | "workstation"
  | "settings"
  | "diagnostics"
  | "founder_command";

export type LivingEarthPlan =
  | "free"
  | "pro"
  | "vip"
  | "institutional"
  | "founder";

export type LivingEarthState =
  | "paper_safe"
  | "fallback"
  | "blocked"
  | "review_required"
  | "local_only";

export type LivingEarthFocusInput = {
  locale?: string;
  selectedRegion?: EarthFocusRegion;
  timeZone?: string;
};

export type LivingEarthFocus = {
  region: EarthFocusRegion;
  label: string;
  basis: "selected_region" | "locale" | "time_zone" | "default_global";
  precision: "broad_region_only";
  gpsUsed: false;
  exactCityUsed: false;
  persisted: false;
};
