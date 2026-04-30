import "server-only";

import type { LocalDesktopAuthBoundaries } from "./types";

export function getLocalDesktopAuthBoundaries(): LocalDesktopAuthBoundaries {
  return {
    id: "local_desktop_auth_boundaries",
    label: "Local auth boundaries",
    state: "ready_with_notes",
    status: "Auth boundaries block public/customer/external auth and plaintext secret storage.",
    checks: [
      "Public auth active: blocked.",
      "Customer login active: blocked.",
      "External auth connected: blocked.",
      "Plaintext passphrase stored: blocked.",
      "Product Truth overrides auth claims.",
    ],
    evidence: [
      "Absolute Founder Boundary.",
      "Local Packaged Auth Gate.",
      "Local PIN / Passphrase Auth implementation.",
    ],
    limitation:
      "Local storage can be cleared by the local user; reset does not recover passphrases or secrets.",
    nextAction: "Keep external auth disconnected unless Ahmad approves a future integration.",
    publicAuth: "blocked",
    customerLogin: "blocked",
    externalAuth: "blocked",
    plaintextSecretStorage: "blocked",
  };
}
