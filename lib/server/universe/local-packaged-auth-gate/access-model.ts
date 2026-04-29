import "server-only";

import type { DesktopAccessModel } from "./types";

export function getDesktopAccessModel(): DesktopAccessModel {
  return {
    id: "private_access_model",
    label: "Private Ahmad-only access model",
    state: "ready_with_notes",
    status: "Al-Kawn Desktop is private Ahmad-only access, not public auth.",
    checks: [
      "Ahmad-only desktop access.",
      "No customer login.",
      "No public auth.",
      "No SaaS account system.",
      "Packaged-app authentication is private and local-first.",
    ],
    evidence: [
      "/desktop/kawn private route.",
      "Private Desktop Packaging Gate.",
      "Product Truth: public desktop distribution is blocked.",
    ],
    risk: "The access model is defined, but a packaged-app lock is not implemented yet.",
    nextAction: "Ahmad must choose the local packaged access method before implementation.",
    scope: "private_ahmad_only",
    customerLogin: "not_applicable",
    publicAuth: "blocked",
    saasAccountSystem: "not_applicable",
  };
}
