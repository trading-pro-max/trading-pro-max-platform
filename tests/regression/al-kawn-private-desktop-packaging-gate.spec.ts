import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public desktop distribution active|signing complete|packaging release active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|secrets stored in desktop bundle|secrets stored in Git|public ALKON active|guaranteed profit|risk free/i;

test.describe("Al-Kawn Private Desktop Packaging Gate", () => {
  test("/desktop/kawn renders the private packaging gate", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("private-desktop-packaging-gate")).toBeVisible();
    await expect(body).toContainText("Private Desktop Packaging Gate");
    await expect(body).toContainText("Packaging is not public distribution");
    await expect(body).toContainText("Al-Kawn Desktop remains Ahmad-only");
    await expect(body).toContainText("No secrets are stored in the desktop bundle");
    await expect(body).toContainText("Signing, packaging, and private distribution remain gated");
    await expect(body).toContainText("Product Truth overrides desktop packaging");
    await expect(body).toContainText("Public desktop distribution is blocked");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe shows desktop packaging gate status", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-card")).toBeVisible();
    await expect(body).toContainText("Private Desktop Packaging Gate");
    await expect(body).toContainText("Public desktop distribution is blocked");
    await expect(body).toContainText("Signing and private distribution require future approval");
    await expect(body).toContainText("Desktop remains Ahmad-only");
    await expect(body).toContainText("No secrets are stored in the desktop bundle");
    await expect(body).toContainText("Product Truth overrides every action");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("packaging gate source, docs, and report exist", () => {
    const indexSource = readFileSync(
      "lib/server/universe/desktop-packaging-gate/index.ts",
      "utf8",
    );
    const gateSource = readFileSync(
      "lib/server/universe/desktop-packaging-gate/packaging-gate.ts",
      "utf8",
    );

    expect(existsSync("docs/product/al-kawn-private-desktop-packaging-gate.md")).toBe(
      true,
    );
    expect(existsSync("reports/al-kawn-private-desktop-packaging-gate.md")).toBe(true);
    expect(indexSource).toContain("getDesktopPackagingGate");
    expect(indexSource).toContain("getDesktopShellReadiness");
    expect(indexSource).toContain("getNativeDesktopShellReadiness");
    expect(indexSource).toContain("getDesktopPackageReadiness");
    expect(indexSource).toContain("getDesktopSigningReadiness");
    expect(indexSource).toContain("getDesktopPrivateDistributionReadiness");
    expect(indexSource).toContain("getDesktopAuthReadiness");
    expect(indexSource).toContain("getDesktopSecretSafety");
    expect(indexSource).toContain("getDesktopPackagingNextAction");
    expect(gateSource).toContain("Private Desktop Packaging Gate");
    expect(gateSource).toContain("Public desktop distribution is blocked.");
  });
});
