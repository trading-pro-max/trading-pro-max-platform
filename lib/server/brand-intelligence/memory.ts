import "server-only";

export const IDENTITY_MEMORY_PREFERENCES = Object.freeze([
  "no generated images unless explicitly requested",
  "SVG/code identity only",
  "Free familiar and premium",
  "Pro/VIP differentiated",
  "Institutional public naming",
  "Founder terms internal only",
  "chart-first",
  "no clutter",
  "no boxed/small feeling",
  "Earth Mark alive but calm",
  "previous logo rejected as not distinctive enough",
  "Celestial Swiss Earth Mark direction",
  "visible moon orbit around Earth",
  "gold world-map edge preference",
  "chart currently visually annoying and requires calmer rebuild",
  "no fake claims",
  "no competitor copying",
  "no noisy animation",
]);

export function getIdentityMemorySnapshot(
  checkedAt = new Date().toISOString()
) {
  return {
    checkedAt,
    mode: "identity_memory" as const,
    preferences: [...IDENTITY_MEMORY_PREFERENCES],
    storage: "deterministic_safe_contract",
    truth: {
      secretsStored: false,
      privateSensitiveDataStored: false,
      surveillance: false,
      externalSync: false,
    },
  };
}
