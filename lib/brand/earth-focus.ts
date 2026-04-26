import type {
  EarthFocusRegion,
  LivingEarthFocus,
  LivingEarthFocusInput,
} from "./earth-background-types";
import type { PlanRealmId } from "@/lib/plans/realms/types";

export type LivingEarthRealmAtmosphere = {
  realmId: PlanRealmId;
  perspective:
    | "earth_native"
    | "orbital_professional"
    | "lunar_deep_orbit"
    | "station_control"
    | "private_universe";
  preciseLocationTracking: false;
  rasterAssetsUsed: false;
  motion: "none" | "low" | "medium" | "command";
};

const realmAtmospheres: Record<PlanRealmId, LivingEarthRealmAtmosphere> = {
  free_earth: {
    realmId: "free_earth",
    perspective: "earth_native",
    preciseLocationTracking: false,
    rasterAssetsUsed: false,
    motion: "low",
  },
  pro_orbit: {
    realmId: "pro_orbit",
    perspective: "orbital_professional",
    preciseLocationTracking: false,
    rasterAssetsUsed: false,
    motion: "low",
  },
  vip_lunar: {
    realmId: "vip_lunar",
    perspective: "lunar_deep_orbit",
    preciseLocationTracking: false,
    rasterAssetsUsed: false,
    motion: "medium",
  },
  institutional_station: {
    realmId: "institutional_station",
    perspective: "station_control",
    preciseLocationTracking: false,
    rasterAssetsUsed: false,
    motion: "low",
  },
  alkon_universe: {
    realmId: "alkon_universe",
    perspective: "private_universe",
    preciseLocationTracking: false,
    rasterAssetsUsed: false,
    motion: "command",
  },
};

const focusLabels: Record<EarthFocusRegion, string> = {
  europe: "Europe focus",
  middle_east: "Middle East focus",
  north_america: "North America focus",
  south_america: "South America focus",
  east_asia: "East Asia focus",
  africa: "Africa focus",
  oceania: "Oceania focus",
  global: "Global focus",
};

const localeRegionHints: Array<{
  pattern: RegExp;
  region: EarthFocusRegion;
}> = [
  { pattern: /^(ar|fa|he|ur)(-|$)/i, region: "middle_east" },
  { pattern: /^(de|fr|it|es|pt|nl|sv|no|da|fi|pl|tr|en-GB|en-CH)(-|$)/i, region: "europe" },
  { pattern: /^(en-US|en-CA)(-|$)/i, region: "north_america" },
  { pattern: /^(pt-BR|es-AR|es-CL|es-CO|es-MX)(-|$)/i, region: "south_america" },
  { pattern: /^(zh|ja|ko)(-|$)/i, region: "east_asia" },
];

function regionFromTimeZone(timeZone?: string): EarthFocusRegion | null {
  if (!timeZone) return null;
  if (/Europe\//i.test(timeZone)) return "europe";
  if (/(Asia\/(Dubai|Riyadh|Qatar|Kuwait|Bahrain|Muscat|Jerusalem|Amman|Beirut)|Africa\/Cairo)/i.test(timeZone)) {
    return "middle_east";
  }
  if (/America\//i.test(timeZone)) return "north_america";
  if (/(Asia\/(Tokyo|Seoul|Shanghai|Hong_Kong|Singapore|Taipei))/i.test(timeZone)) {
    return "east_asia";
  }
  if (/Africa\//i.test(timeZone)) return "africa";
  if (/(Australia\/|Pacific\/)/i.test(timeZone)) return "oceania";

  return null;
}

function regionFromLocale(locale?: string): EarthFocusRegion | null {
  if (!locale) return null;

  const normalized = locale.replace("_", "-");
  return (
    localeRegionHints.find((hint) => hint.pattern.test(normalized))?.region ?? null
  );
}

export function resolveLivingEarthFocus(
  input: LivingEarthFocusInput = {}
): LivingEarthFocus {
  if (input.selectedRegion) {
    return {
      region: input.selectedRegion,
      label: focusLabels[input.selectedRegion],
      basis: "selected_region",
      precision: "broad_region_only",
      gpsUsed: false,
      exactCityUsed: false,
      persisted: false,
    };
  }

  const localeRegion = regionFromLocale(input.locale);
  if (localeRegion) {
    return {
      region: localeRegion,
      label: focusLabels[localeRegion],
      basis: "locale",
      precision: "broad_region_only",
      gpsUsed: false,
      exactCityUsed: false,
      persisted: false,
    };
  }

  const timeZoneRegion = regionFromTimeZone(input.timeZone);
  if (timeZoneRegion) {
    return {
      region: timeZoneRegion,
      label: focusLabels[timeZoneRegion],
      basis: "time_zone",
      precision: "broad_region_only",
      gpsUsed: false,
      exactCityUsed: false,
      persisted: false,
    };
  }

  return {
    region: "global",
    label: focusLabels.global,
    basis: "default_global",
    precision: "broad_region_only",
    gpsUsed: false,
    exactCityUsed: false,
    persisted: false,
  };
}

export function resolveLivingEarthRealmAtmosphere(
  realmId: PlanRealmId
): LivingEarthRealmAtmosphere {
  return realmAtmospheres[realmId];
}
