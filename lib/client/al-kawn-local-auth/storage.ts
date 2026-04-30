import {
  AL_KAWN_LOCAL_AUTH_ITERATIONS,
  createLocalAuthSalt,
  deriveLocalAuthVerifier,
} from "./crypto";
import type { AlKawnLocalAuthMode, AlKawnLocalAuthRecord } from "./types";

export const AL_KAWN_LOCAL_AUTH_STORAGE_KEY = "al-kawn-local-auth.v1";
export const AL_KAWN_LOCAL_AUTH_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function getLocalStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function getLocalAuthRecord(): AlKawnLocalAuthRecord | null {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(AL_KAWN_LOCAL_AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AlKawnLocalAuthRecord;
    if (
      parsed.version !== 1 ||
      parsed.algorithm !== "PBKDF2-SHA-256" ||
      typeof parsed.salt !== "string" ||
      typeof parsed.verifier !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function hasLocalAuthRecord(): boolean {
  return Boolean(getLocalAuthRecord());
}

export async function saveLocalAuthRecord(
  mode: AlKawnLocalAuthMode,
  secret: string,
): Promise<AlKawnLocalAuthRecord> {
  const storage = getLocalStorage();
  if (!storage) {
    throw new Error("Local browser storage is unavailable.");
  }

  const now = new Date().toISOString();
  const salt = createLocalAuthSalt();
  const verifier = await deriveLocalAuthVerifier(secret, salt);
  const record: AlKawnLocalAuthRecord = {
    version: 1,
    mode,
    algorithm: "PBKDF2-SHA-256",
    iterations: AL_KAWN_LOCAL_AUTH_ITERATIONS,
    salt,
    verifier,
    createdAt: now,
    updatedAt: now,
    sessionTimeoutMs: AL_KAWN_LOCAL_AUTH_SESSION_TIMEOUT_MS,
  };
  storage.setItem(AL_KAWN_LOCAL_AUTH_STORAGE_KEY, JSON.stringify(record));
  return record;
}

export function clearLocalAuthRecord(): void {
  const storage = getLocalStorage();
  storage?.removeItem(AL_KAWN_LOCAL_AUTH_STORAGE_KEY);
}
