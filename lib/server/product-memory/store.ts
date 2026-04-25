import "server-only";

import type {
  ProductMemoryDomain,
  ProductMemoryDomainSummary,
  ProductMemoryDraftInput,
  ProductMemoryItem,
  ProductMemorySafetyPolicy,
  ProductMemorySensitivity,
  ProductMemoryStatus,
  ProductMemoryStoreResult,
  ProductMemoryVisibility,
} from "./types";

const forbiddenStorageReminders = [
  "production secrets",
  "API keys",
  "passwords",
  "broker credentials",
  "payment data",
  "raw private sensitive user data",
  "real-money trading credentials",
  "social tokens",
  "hidden production config",
  "fake users, revenue, or metrics",
];

export const productMemorySafetyPolicy: ProductMemorySafetyPolicy = {
  allowedStorage: [
    "local day reports",
    "Founder acceptance decisions",
    "visual feedback notes",
    "UI acceptance status",
    "journal/coach demo notes",
    "decision replay local notes",
    "build decisions",
    "validation summaries",
    "Codex task outcomes",
    "product gap notes",
    "safe plan/readiness notes",
    "non-sensitive product preferences",
  ],
  forbiddenStorage: forbiddenStorageReminders,
  defaultStorageMode: "local_internal_readiness_only",
  productionStorageActive: false,
  externalSyncActive: false,
  surveillanceAllowed: false,
  secretPersistenceAllowed: false,
  rawSensitiveUserDataAllowed: false,
  fakeMetricsAllowed: false,
};

const secretLikePatterns = [
  /api[_-]?key/i,
  /password/i,
  /secret/i,
  /token/i,
  /broker credential/i,
  /payment/i,
  /private key/i,
  /bearer\s+[a-z0-9._-]+/i,
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

function isForbiddenSensitivity(sensitivity: ProductMemorySensitivity): boolean {
  return sensitivity === "secret_forbidden" || sensitivity === "sensitive_do_not_store";
}

export function redactUnsafeMemoryText(value: string) {
  let redacted = value;
  let redactionRequired = false;

  for (const pattern of secretLikePatterns) {
    if (pattern.test(redacted)) {
      redactionRequired = true;
      redacted = redacted.replace(pattern, "[redacted]");
    }
  }

  return { value: redacted, redactionRequired };
}

export function createProductMemoryDraft(
  input: ProductMemoryDraftInput,
  checkedAt = new Date().toISOString()
): ProductMemoryStoreResult {
  if (isForbiddenSensitivity(input.sensitivity)) {
    return {
      ok: false,
      item: null,
      rejectedReason:
        "Product memory rejects sensitive_do_not_store and secret_forbidden items.",
    };
  }

  const title = redactUnsafeMemoryText(input.title);
  const summary = redactUnsafeMemoryText(input.summary);
  const redactionRequired = title.redactionRequired || summary.redactionRequired;

  return {
    ok: true,
    item: {
      ...input,
      id: input.id ?? `${input.domain}-${slugify(input.title)}`,
      title: title.value,
      summary: summary.value,
      createdAt: input.createdAt ?? checkedAt,
      updatedAt: input.updatedAt ?? checkedAt,
      safeToPersist: !redactionRequired,
      redactionRequired,
    },
    rejectedReason: null,
  };
}

export function filterSafeProductMemoryItems(
  items: ProductMemoryItem[],
  filter: {
    domain?: ProductMemoryDomain;
    visibility?: ProductMemoryVisibility;
    sensitivity?: ProductMemorySensitivity;
  } = {}
) {
  return items.filter((item) => {
    if (!item.safeToPersist || item.redactionRequired) return false;
    if (item.sensitivity === "secret_forbidden") return false;
    if (item.sensitivity === "sensitive_do_not_store") return false;
    if (filter.domain && item.domain !== filter.domain) return false;
    if (filter.visibility && item.visibility !== filter.visibility) return false;
    if (filter.sensitivity && item.sensitivity !== filter.sensitivity) return false;
    return true;
  });
}

export function summarizeProductMemoryItems(
  items: ProductMemoryItem[]
): ProductMemoryDomainSummary[] {
  const domains = Array.from(new Set(items.map((item) => item.domain))).sort();

  return domains.map((domain) => {
    const domainItems = items.filter((item) => item.domain === domain);

    return {
      domain,
      total: domainItems.length,
      safeToPersist: domainItems.filter((item) => item.safeToPersist).length,
      founderOnly: domainItems.filter((item) => item.visibility === "founder_only")
        .length,
      redactionRequired: domainItems.filter((item) => item.redactionRequired).length,
      open: domainItems.filter((item) =>
        ["draft", "needs_polish", "confusing", "too_much", "missing", "future"].includes(
          item.status
        )
      ).length,
    };
  });
}

export function markProductMemoryStatus(
  item: ProductMemoryItem,
  status: ProductMemoryStatus,
  checkedAt = new Date().toISOString()
): ProductMemoryItem {
  return {
    ...item,
    status,
    updatedAt: checkedAt,
  };
}

export function getForbiddenStorageReminders() {
  return forbiddenStorageReminders;
}
