import type { AhmadSovereignDigitalTwin } from "./types";

export const AHMAD_TWIN_ALLOWED_MEMORY = [
  "operating will",
  "project vision",
  "preferences",
  "decision rules",
  "visual acceptance rules",
  "memory lessons",
  "safety boundaries",
  "authority requirements",
];

export const AHMAD_TWIN_FORBIDDEN_MEMORY = [
  "passport numbers",
  "permit numbers",
  "national IDs",
  "bank details",
  "card numbers",
  "CVV",
  "passwords",
  "API keys",
  "tokens",
  "raw biometric data",
  "fingerprint data",
  "raw face images",
  "raw video",
  "legal documents",
  "precise home address",
  "private identity documents",
];

export function getAhmadSovereignDigitalTwin(): AhmadSovereignDigitalTwin {
  return {
    twinId: "ahmad_sovereign_operational_twin",
    purpose: "operational_digital_twin_foundation",
    publicExposure: false,
    digitalTwinReadiness: "ready_with_notes",
    allowedMemory: AHMAD_TWIN_ALLOWED_MEMORY,
    forbiddenMemory: AHMAD_TWIN_FORBIDDEN_MEMORY,
    sensitiveDataStoredInCode: false,
    rawPersonalDataStored: false,
    founderAuthorityRequiredForSensitiveActions: true,
    futureSensitiveDataRequiresEncryptedVault: true,
  };
}
