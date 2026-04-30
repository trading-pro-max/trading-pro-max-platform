import type { AlKawnLocalAuthSession } from "./types";

export const AL_KAWN_LOCAL_AUTH_SESSION_KEY = "al-kawn-local-auth-session.v1";

function getSessionStorage(): Storage | undefined {
  try {
    return globalThis.sessionStorage;
  } catch {
    return undefined;
  }
}

export function getLocalAuthSession(): AlKawnLocalAuthSession | null {
  const storage = getSessionStorage();
  const raw = storage?.getItem(AL_KAWN_LOCAL_AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AlKawnLocalAuthSession;
    if (parsed.version !== 1 || typeof parsed.expiresAt !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function isLocalAuthSessionUnlocked(now = Date.now()): boolean {
  const session = getLocalAuthSession();
  return Boolean(session && session.expiresAt > now);
}

export function unlockLocalAuthSession(timeoutMs: number): AlKawnLocalAuthSession {
  const storage = getSessionStorage();
  if (!storage) {
    throw new Error("Session storage is unavailable.");
  }

  const now = Date.now();
  const session: AlKawnLocalAuthSession = {
    version: 1,
    unlockedAt: now,
    expiresAt: now + timeoutMs,
  };
  storage.setItem(AL_KAWN_LOCAL_AUTH_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearLocalAuthSession(): void {
  getSessionStorage()?.removeItem(AL_KAWN_LOCAL_AUTH_SESSION_KEY);
}

export function getLocalAuthRemainingMs(now = Date.now()): number {
  const session = getLocalAuthSession();
  if (!session) {
    return 0;
  }
  return Math.max(0, session.expiresAt - now);
}
