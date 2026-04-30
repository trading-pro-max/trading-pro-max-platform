import type { Page } from "@playwright/test";

export async function seedUnlockedAlKawnLocalAuth(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const now = Date.now();
    localStorage.setItem(
      "al-kawn-local-auth.v1",
      JSON.stringify({
        version: 1,
        mode: "passphrase",
        algorithm: "PBKDF2-SHA-256",
        iterations: 210000,
        salt: "dGVzdC1sb2NhbC1zYWx0",
        verifier: "dGVzdC1sb2NhbC12ZXJpZmllcg==",
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
        sessionTimeoutMs: 30 * 60 * 1000,
      }),
    );
    sessionStorage.setItem(
      "al-kawn-local-auth-session.v1",
      JSON.stringify({
        version: 1,
        unlockedAt: now,
        expiresAt: now + 30 * 60 * 1000,
      }),
    );
  });
}
