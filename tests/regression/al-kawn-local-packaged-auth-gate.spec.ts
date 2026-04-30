import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /production-grade auth active|external auth connected without approval|public auth active|public desktop distribution active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|secrets stored in app bundle|secrets stored in Git|public ALKON active/i;

test.describe("Al-Kawn Local Packaged Auth Gate", () => {
  test("/desktop/kawn renders the local packaged auth gate", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("local-packaged-auth-gate")).toBeVisible();
    await expect(body).toContainText("Local Packaged Auth Gate");
    await expect(body).toContainText("Al-Kawn Desktop requires Ahmad-only local access");
    await expect(body).toContainText("Packaged-app authentication is private and local-first");
    await expect(body).toContainText("No secrets are stored in the app bundle");
    await expect(body).toContainText("External auth providers require Ahmad approval");
    await expect(body).toContainText("Product Truth overrides local auth claims");
    await expect(body).toContainText("Public desktop distribution is blocked");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe shows local packaged auth gate status", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-card")).toBeVisible();
    await expect(body).toContainText("Local Packaged Auth Gate");
    await expect(body).toContainText("Ahmad-only local access");
    await expect(body).toContainText("External auth requires Ahmad approval");
    await expect(body).toContainText("Public desktop distribution is blocked");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("local packaged auth gate source, docs, and report exist", () => {
    const indexSource = readFileSync(
      "lib/server/universe/local-packaged-auth-gate/index.ts",
      "utf8",
    );
    const gateSource = readFileSync(
      "lib/server/universe/local-packaged-auth-gate/local-auth-gate.ts",
      "utf8",
    );

    expect(existsSync("docs/product/al-kawn-local-packaged-auth-gate.md")).toBe(true);
    expect(existsSync("reports/al-kawn-local-packaged-auth-gate.md")).toBe(true);
    expect(indexSource).toContain("getLocalPackagedAuthGate");
    expect(indexSource).toContain("getLocalAuthReadiness");
    expect(indexSource).toContain("getDesktopAccessModel");
    expect(indexSource).toContain("getPackagedAppLockReadiness");
    expect(indexSource).toContain("getSessionTimeoutReadiness");
    expect(indexSource).toContain("getAuthSecretSafety");
    expect(indexSource).toContain("getLocalAuthNextAction");
    expect(gateSource).toContain("Local Packaged Auth Gate");
    expect(gateSource).toContain("Product Truth overrides local auth claims.");
    expect(gateSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
