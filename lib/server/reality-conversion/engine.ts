import { getRealityConversionSnapshot } from "./state";
import type { RealityConversionPassport, RealityConversionSnapshot } from "./types";

export function getFirstRealityPassport(
  snapshot: RealityConversionSnapshot = getRealityConversionSnapshot()
): RealityConversionPassport {
  return snapshot.passports[0];
}

export function getRealityConversionReadiness(
  checkedAt?: string
): {
  status: RealityConversionSnapshot["status"];
  passportCount: number;
  firstRealityStep: string;
  noExecution: true;
  noPublicExposure: true;
} {
  const snapshot = getRealityConversionSnapshot(checkedAt);

  return {
    status: snapshot.status,
    passportCount: snapshot.passports.length,
    firstRealityStep: snapshot.firstRealityStep,
    noExecution: snapshot.noExecution,
    noPublicExposure: snapshot.noPublicExposure,
  };
}
