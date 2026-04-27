import type { CreatorRuntimeOath } from "./types";

export function getCreatorRuntimeOath(): CreatorRuntimeOath {
  return {
    oathStatus: "active",
    oath: "Alkon creates. Reality judges. Evidence proves. Memory preserves. Ahmad decides.",
    privateOnly: true,
    publicExposureAllowed: false,
    noExecutionByItself: true,
    unsafeActivationBlocked: true,
    sensitiveActionRequiresAhmad: true,
  };
}
