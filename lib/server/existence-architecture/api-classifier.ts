import { boundary, entity, evidence, purpose, risk } from "./helpers";
import type { ExistenceEntity } from "./types";

export function getApiExistenceEntities(): ExistenceEntity[] {
  return [
    entity({
      id: "api_public_product_truth",
      name: "Public product truth APIs",
      path: "/api/product/truth /api/earth-reality/* /api/devices/public",
      type: "api",
      owner: "public_pro_max",
      purpose: purpose("Expose public-safe readiness and Product Truth.", true, "Public users need truthful blocked/inactive/readiness state."),
      visibility: "public_safe",
      boundary: boundary({ publicExposureAllowed: true }),
      evidence: evidence("present", ["tests/regression/verified-platform-truth.spec.ts"], ["reports/alkon-api-existence-map.md"], []),
      lifecycle: "active",
      nextFate: "keep",
    }),
    entity({
      id: "api_founder_private_readiness",
      name: "Founder private readiness APIs",
      path: "/api/founder/*",
      type: "api",
      owner: "private_alkon_minus_zero",
      purpose: purpose("Founder-only read-only private snapshots.", true, "Founder Command and private Alkon can read internal state."),
      visibility: "private_founder_only",
      evidence: evidence("present", ["tests/regression/alkon-permission-to-exist.spec.ts"], ["reports/alkon-api-existence-map.md"], []),
      lifecycle: "active_with_notes",
      nextFate: "protect",
    }),
    entity({
      id: "api_existence_architecture",
      name: "Permission-to-Exist Founder APIs",
      path: "/api/founder/existence-architecture/*",
      type: "api",
      owner: "private_alkon_minus_zero",
      purpose: purpose("Founder-only read-only Permission-to-Exist snapshots.", true, "Ahmad can inspect unknowns, Jar mapping, and one next structural action."),
      visibility: "private_founder_only",
      evidence: evidence("present", ["tests/regression/alkon-permission-to-exist.spec.ts"], ["reports/alkon-api-existence-map.md"], []),
      lifecycle: "active_with_notes",
      nextFate: "keep",
    }),
    entity({
      id: "api_account_preferences",
      name: "Account and preference APIs",
      path: "/api/account/* /api/auth/*",
      type: "api",
      owner: "invisible_operating_layer",
      purpose: purpose("Local account/session and preference state with safety boundaries.", false, "They support product usability without unsafe activation."),
      visibility: "invisible_internal",
      evidence: evidence("present", ["tests/regression/verified-platform-truth.spec.ts"], ["reports/alkon-api-existence-map.md"], []),
      lifecycle: "active_with_notes",
      nextFate: "protect",
    }),
    entity({
      id: "api_blocked_execution_pattern",
      name: "Shell/Codex/payment execution API pattern",
      path: "/api/* unsafe execution pattern",
      type: "api",
      owner: "sensitive_do_not_commit",
      purpose: purpose("Blocked pattern for unsafe API capability.", false, "Web APIs must never execute shell, Codex, payment, secrets, live trading, billing, broker/feed, or real money."),
      visibility: "sensitive_local_only",
      boundary: boundary({ noExecution: false, noShell: false, noCodex: false, noPayments: false, noSecrets: false }),
      risk: risk("p0", "Unsafe execution API is forbidden.", ["shell", "codex", "payment", "secrets"]),
      evidence: evidence("missing", [], ["reports/alkon-existence-blocked.md"], []),
      lifecycle: "blocked",
      nextFate: "black_hole",
      requiresAhmad: true,
    }),
  ];
}

export function classifyApiCapability(description: string): ExistenceEntity {
  const lowered = description.toLowerCase();
  if (/shell|codex|payment|stripe|secret|live trading|real money|billing/.test(lowered)) {
    return getApiExistenceEntities().find((item) => item.id === "api_blocked_execution_pattern")!;
  }

  return entity({
    id: "api_capability_public_safe_readonly",
    name: "Public-safe read-only API capability",
    path: description,
    type: "api",
    owner: "invisible_operating_layer",
    purpose: purpose("Read-only API capability requires boundary and evidence.", false, "API must prove boundary before existence."),
    visibility: "invisible_internal",
    evidence: evidence("documented_reason", [], ["reports/alkon-api-existence-map.md"], []),
    lifecycle: "readiness_only",
    nextFate: "needs_ahmad_decision",
    requiresAhmad: true,
  });
}
