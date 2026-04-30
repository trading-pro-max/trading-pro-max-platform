import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";

const FORBIDDEN_CLAIMS =
  /public desktop distribution active|production signing active|public release active|installer uploaded|auto-update active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|secrets stored in desktop bundle|secrets stored in Git|public ALKON active/i;

test.describe("Al-Kawn Private Desktop Distribution Gate", () => {
  test("/desktop/kawn renders private distribution gate", async ({ page }) => {
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("private-desktop-distribution-gate")).toBeVisible();
    await expect(body).toContainText("Private Desktop Distribution Gate");
    await expect(body).toContainText("Distribution is private Ahmad-only");
    await expect(body).toContainText("Public desktop distribution is blocked");
    await expect(body).toContainText("Production signing remains a future gate");
    await expect(body).toContainText("No installers are uploaded or published");
    await expect(body).toContainText("Product Truth overrides distribution");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe shows private distribution gate status", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-card")).toBeVisible();
    await expect(body).toContainText("Private Desktop Distribution Gate");
    await expect(body).toContainText("Distribution is private Ahmad-only");
    await expect(body).toContainText("Public desktop distribution is blocked");
    await expect(body).toContainText("Production signing remains a future gate");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("distribution gate model, docs, and report exist", () => {
    const indexSource = readFileSync(
      "lib/server/universe/desktop-distribution-gate/index.ts",
      "utf8",
    );
    const gateSource = readFileSync(
      "lib/server/universe/desktop-distribution-gate/distribution-gate.ts",
      "utf8",
    );

    expect(existsSync("docs/product/al-kawn-private-desktop-distribution-gate.md")).toBe(
      true,
    );
    expect(existsSync("reports/al-kawn-private-desktop-distribution-gate.md")).toBe(true);
    expect(indexSource).toContain("getDesktopDistributionGate");
    expect(indexSource).toContain("getPrivateDistributionReadiness");
    expect(indexSource).toContain("getPublicDistributionBlock");
    expect(indexSource).toContain("getProductionSigningGate");
    expect(indexSource).toContain("getDesktopArtifactPolicy");
    expect(indexSource).toContain("getDesktopDistributionNextAction");
    expect(gateSource).toContain("Private Desktop Distribution Gate");
    expect(gateSource).toContain("Product Truth overrides distribution.");
    expect(gateSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
