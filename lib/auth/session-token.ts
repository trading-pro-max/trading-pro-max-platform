import "server-only";
import { createHash, randomBytes } from "node:crypto";

const SESSION_TOKEN_BYTES = 32;
const SESSION_TOKEN_HASH_ALGORITHM = "sha256";
const SESSION_TOKEN_BASE64URL_LENGTH = 43;
const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;

export function createSessionToken() {
  return randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
}

export function isSessionTokenShape(
  token: string | null | undefined
): token is string {
  return (
    typeof token === "string" &&
    token.length === SESSION_TOKEN_BASE64URL_LENGTH &&
    SESSION_TOKEN_PATTERN.test(token)
  );
}

export function hashSessionToken(token: string) {
  return createHash(SESSION_TOKEN_HASH_ALGORITHM).update(token).digest("hex");
}

export function createSessionExpiry(now = new Date(), ttlHours = 24) {
  return new Date(now.getTime() + ttlHours * 60 * 60 * 1000);
}
