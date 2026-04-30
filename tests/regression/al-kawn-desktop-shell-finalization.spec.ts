import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public desktop distribution active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|secrets stored in desktop bundle|external accounts connected without approval|public الكون active|public ALKON active|guaranteed profit|risk free/i;

test.describe("Al-Kawn Desktop Shell Finalization", () => {
  test("/desktop/kawn renders finalized private desktop shell status", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-operating-environment")).toBeVisible();
    await expect(page.getByTestId("al-kawn-desktop-shell-status")).toBeVisible();
    await expect(body).toContainText("/desktop/kawn is the Al-Kawn private desktop home.");
    await expect(body).toContainText("Private Ahmad-only desktop shell.");
    await expect(body).toContainText("Public desktop distribution is blocked.");
    await expect(body).toContainText("No secrets are stored in the desktop bundle.");
    await expect(body).toContainText("External accounts require Ahmad approval.");
    await expect(body).toContainText("Product Truth overrides every action.");
    await expect(body).toContainText("Native signing and private distribution remain future gates.");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe shows desktop shell finalization status", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-card")).toBeVisible();
    await expect(body).toContainText("Desktop shell finalization");
    await expect(body).toContainText("Desktop is the main private command client for الكون");
    await expect(body).toContainText("/desktop/kawn is the Al-Kawn private desktop home.");
    await expect(body).toContainText("Private Ahmad-only desktop shell.");
    await expect(body).toContainText("Public desktop distribution is blocked.");
    await expect(body).toContainText("No secrets are stored in the desktop bundle.");
    await expect(body).toContainText("External accounts require Ahmad approval.");
    await expect(body).toContainText("Product Truth overrides every action.");
    await expect(body).toContainText("Native signing and private distribution remain future gates");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("desktop shell docs, report, and check script exist", async () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

    expect(packageJson.scripts["desktop:check"]).toBe(
      "node scripts/al-kawn-desktop-shell-check.mjs",
    );
    expect(existsSync("scripts/al-kawn-desktop-shell-check.mjs")).toBe(true);
    expect(existsSync("docs/product/al-kawn-desktop-shell-finalization.md")).toBe(true);
    expect(existsSync("reports/al-kawn-desktop-shell-finalization.md")).toBe(true);
  });
});
