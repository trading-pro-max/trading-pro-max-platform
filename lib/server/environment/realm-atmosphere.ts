import type { PlanRealmAtmosphere } from "./types";

export type RealmAtmosphereResolution = {
  planRealm: PlanRealmAtmosphere;
  publicTone: string;
  cssClassName: string;
  motionProfile: "low" | "medium" | "private_command";
  publicVisible: boolean;
};

const realmAtmospheres: Record<PlanRealmAtmosphere, RealmAtmosphereResolution> = {
  free_earth: {
    planRealm: "free_earth",
    publicTone: "Simple Earth atmosphere with low motion and no premium gold dominance.",
    cssClassName: "tpm-realm-free-earth-env",
    motionProfile: "low",
    publicVisible: true,
  },
  pro_orbit: {
    planRealm: "pro_orbit",
    publicTone: "Professional orbital atmosphere with emerald and silver precision.",
    cssClassName: "tpm-realm-pro-orbit-env",
    motionProfile: "medium",
    publicVisible: true,
  },
  vip_lunar: {
    planRealm: "vip_lunar",
    publicTone: "Lunar premium atmosphere with controlled gold and platinum depth.",
    cssClassName: "tpm-realm-vip-lunar-env",
    motionProfile: "medium",
    publicVisible: true,
  },
  institutional_station: {
    planRealm: "institutional_station",
    publicTone: "Formal station atmosphere with navy, platinum, and cyan monitoring.",
    cssClassName: "tpm-realm-institutional-station-env",
    motionProfile: "low",
    publicVisible: true,
  },
  alkon_universe_private: {
    planRealm: "alkon_universe_private",
    publicTone: "Private command atmosphere. Never shown to public users.",
    cssClassName: "tpm-realm-alkon-universe-env",
    motionProfile: "private_command",
    publicVisible: false,
  },
};

export function resolveRealmAtmosphere(
  planRealm: PlanRealmAtmosphere = "free_earth"
) {
  return realmAtmospheres[planRealm];
}

export function getPublicRealmAtmospheres() {
  return Object.values(realmAtmospheres).filter((realm) => realm.publicVisible);
}
