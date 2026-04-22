import "server-only";

export type RateLimitPolicy = {
  maxRequests: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const globalForRateLimits = globalThis as typeof globalThis & {
  tradingProMaxRateLimits?: Map<string, RateLimitBucket>;
};

const buckets =
  globalForRateLimits.tradingProMaxRateLimits ??
  new Map<string, RateLimitBucket>();

globalForRateLimits.tradingProMaxRateLimits = buckets;

function normalizeKeyPart(value: string) {
  return value.replace(/[\r\n\t]/g, " ").trim().slice(0, 160) || "unknown";
}

export function buildRateLimitKey(parts: string[]) {
  return parts.map(normalizeKeyPart).join(":");
}

export function checkRateLimit(
  key: string,
  policy: RateLimitPolicy,
  now = Date.now()
): RateLimitResult {
  const normalizedKey = normalizeKeyPart(key);
  const existing = buckets.get(normalizedKey);

  if (!existing || existing.resetAt <= now) {
    buckets.set(normalizedKey, {
      count: 1,
      resetAt: now + policy.windowMs,
    });

    return {
      allowed: true,
      remaining: Math.max(0, policy.maxRequests - 1),
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= policy.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000)
      ),
    };
  }

  existing.count += 1;

  return {
    allowed: true,
    remaining: Math.max(0, policy.maxRequests - existing.count),
    retryAfterSeconds: 0,
  };
}
