import type { SelfCorrectionPassport } from "./types";

export function createSelfCorrectionPassport(): SelfCorrectionPassport {
  return {
    passportId: "alkon_a_z_self_correction_passport",
    valid: true,
    mission: "Detect drift and correct privately without unsafe activation.",
    allowedScope: ["docs", "types", "private APIs", "Founder Command panels", "tests", "reports"],
    forbiddenScope: ["public Alkon", "shell from web app", "payments", "live trading", "billing", "broker/feed"],
    validationRequired: ["public leak tests", "Product Truth tests", "visual proof", "wake report"],
  };
}

