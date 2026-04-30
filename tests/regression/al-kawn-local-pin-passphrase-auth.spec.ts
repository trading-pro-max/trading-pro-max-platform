import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";

const FORBIDDEN_CLAIMS =
  /production-grade auth active|external auth connected without approval|public auth active|customer login active|public desktop distribution active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|secrets stored in Git|secrets stored in app bundle|plaintext passphrase stored|public ALKON active/i;

test.describe("Al-Kawn Local PIN / Passphrase Auth", () => {
  test("/desktop/kawn renders the local private access setup gate", async ({ page }) => {
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("local-auth-gate")).toBeVisible();
    await expect(body).toContainText("Local PIN / Passphrase Auth");
    await expect(body).toContainText("Al-Kawn Desktop requires Ahmad-only local access");
    await expect(body).toContainText(
      "This is a local private access lock, not public authentication",
    );
    await expect(body).toContainText("No plaintext passphrase is stored");
    await expect(body).toContainText("External auth providers require Ahmad approval");
    await expect(body).toContainText("Product Truth overrides auth claims");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("local setup, manual lock, and unlock work with browser-local verifier", async ({
    page,
  }) => {
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("local-auth-setup")).toBeVisible();
    const secretInputs = page.locator('input[type="password"]');
    await secretInputs.nth(0).fill("Ahmad-local-passphrase-2026");
    await secretInputs.nth(1).fill("Ahmad-local-passphrase-2026");
    await page.getByRole("button", { name: "Set local private lock" }).click();

    await expect(page.getByTestId("al-kawn-desktop-operating-environment")).toBeVisible({
      timeout: 20000,
    });
    await expect(page.getByText("Session timeout: active")).toBeVisible();
    await expect(
      page
        .getByLabel("Local PIN / Passphrase Auth status")
        .getByText("No plaintext passphrase is stored"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Manual lock" }).click();
    await expect(page.getByTestId("local-auth-unlock")).toBeVisible();
    await page.locator('input[type="password"]').fill("Ahmad-local-passphrase-2026");
    await page.getByRole("button", { name: "Unlock local desktop" }).click();

    await expect(page.getByTestId("al-kawn-desktop-operating-environment")).toBeVisible({
      timeout: 20000,
    });

    const storedRecord = await page.evaluate(() => localStorage.getItem("al-kawn-local-auth.v1"));
    expect(storedRecord).toBeTruthy();
    expect(storedRecord).not.toContain("Ahmad-local-passphrase-2026");
  });

  test("/founder/universe shows local PIN/passphrase auth status", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-card")).toBeVisible();
    await expect(body).toContainText("Local PIN / Passphrase Auth");
    await expect(body).toContainText("External auth providers require Ahmad approval");
    await expect(body).toContainText(
      "Production-grade auth remains a future gate unless implemented",
    );
    await expect(body).toContainText("Desktop remains Ahmad-only");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("local auth model, docs, report, and client utility exist", () => {
    const indexSource = readFileSync(
      "lib/server/universe/local-desktop-auth/index.ts",
      "utf8",
    );
    const cryptoSource = readFileSync("lib/client/al-kawn-local-auth/crypto.ts", "utf8");
    const storageSource = readFileSync("lib/client/al-kawn-local-auth/storage.ts", "utf8");
    const reportSource = readFileSync("reports/al-kawn-local-pin-passphrase-auth.md", "utf8");

    expect(existsSync("docs/product/al-kawn-local-pin-passphrase-auth.md")).toBe(true);
    expect(existsSync("reports/al-kawn-local-pin-passphrase-auth.md")).toBe(true);
    expect(indexSource).toContain("getLocalDesktopAuthPolicy");
    expect(indexSource).toContain("getLocalDesktopAuthReadiness");
    expect(indexSource).toContain("getLocalDesktopAuthStatus");
    expect(indexSource).toContain("getLocalDesktopAuthBoundaries");
    expect(indexSource).toContain("getLocalDesktopAuthNextAction");
    expect(cryptoSource).toContain("PBKDF2");
    expect(cryptoSource).toContain("deriveLocalAuthVerifier");
    expect(storageSource).toContain("verifier");
    expect(storageSource).not.toContain("plaintext");
    expect(reportSource).toContain("No plaintext PIN/passphrase is stored.");
    expect(reportSource).toContain("Product Truth overrides auth claims.");
    expect(reportSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
