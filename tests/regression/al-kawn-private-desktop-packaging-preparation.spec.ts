import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public desktop distribution active|signing complete|production release active|auto-update active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|secrets stored in desktop bundle|secrets stored in Git|plaintext passphrase stored|public ALKON active/i;

test.describe("Al-Kawn Private Desktop Packaging Preparation", () => {
  test("/desktop/kawn renders private packaging preparation", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("private-desktop-packaging-preparation")).toBeVisible();
    await expect(body).toContainText("Private Desktop Packaging Preparation");
    await expect(body).toContainText("Packaging preparation is not public release");
    await expect(body).toContainText("Al-Kawn Desktop remains Ahmad-only");
    await expect(body).toContainText("No secrets are stored in the desktop bundle");
    await expect(body).toContainText("Signing and public distribution remain blocked");
    await expect(body).toContainText("Product Truth overrides packaging");
    await expect(body).toContainText("Local PIN / Passphrase Auth is preserved");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe shows packaging preparation status", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-card")).toBeVisible();
    await expect(body).toContainText("Private Desktop Packaging Preparation");
    await expect(body).toContainText("Public desktop distribution is blocked");
    await expect(body).toContainText("Signing remains a future gate");
    await expect(body).toContainText("Desktop remains Ahmad-only");
    await expect(body).toContainText("Package readiness");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("preparation model, docs, report, and safe package check script exist", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const indexSource = readFileSync(
      "lib/server/universe/desktop-packaging-preparation/index.ts",
      "utf8",
    );
    const preparationSource = readFileSync(
      "lib/server/universe/desktop-packaging-preparation/packaging-preparation.ts",
      "utf8",
    );

    expect(packageJson.scripts["desktop:package:check"]).toBe(
      "node scripts/al-kawn-desktop-package-check.mjs",
    );
    expect(existsSync("scripts/al-kawn-desktop-package-check.mjs")).toBe(true);
    expect(existsSync("docs/product/al-kawn-private-desktop-packaging-preparation.md")).toBe(
      true,
    );
    expect(existsSync("reports/al-kawn-private-desktop-packaging-preparation.md")).toBe(true);
    expect(indexSource).toContain("getPrivateDesktopPackagingPreparation");
    expect(indexSource).toContain("getDesktopPackagingPreparation");
    expect(indexSource).toContain("getPackagingCapabilityCheck");
    expect(indexSource).toContain("getDesktopPackagingCapability");
    expect(indexSource).toContain("getNativeShellStatus");
    expect(indexSource).toContain("getPackageScriptStatus");
    expect(indexSource).toContain("getPackagingAuthDependency");
    expect(indexSource).toContain("getPackagingSecretSafetyCheck");
    expect(indexSource).toContain("getPackagingSecretSafety");
    expect(indexSource).toContain("getDesktopPackagingPreparationNextAction");
    expect(preparationSource).toContain("Private Desktop Packaging Preparation");
    expect(preparationSource).toContain("Product Truth overrides packaging.");
    expect(preparationSource).toContain("Local PIN / Passphrase Auth is preserved.");
    expect(preparationSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
