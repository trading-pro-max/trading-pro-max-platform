import { constantTimeEqual, deriveLocalAuthVerifier } from "./crypto";
import { getLocalAuthRecord } from "./storage";

export function validateLocalAuthSecretShape(secret: string): string | null {
  const trimmed = secret.trim();
  if (trimmed.length < 4) {
    return "Use at least 4 characters for a local PIN or passphrase.";
  }
  if (trimmed.length > 128) {
    return "Use 128 characters or fewer for this local lock.";
  }
  return null;
}

export async function verifyLocalAuthSecret(secret: string): Promise<boolean> {
  const record = getLocalAuthRecord();
  if (!record) {
    return false;
  }

  const verifier = await deriveLocalAuthVerifier(secret, record.salt);
  return constantTimeEqual(verifier, record.verifier);
}
