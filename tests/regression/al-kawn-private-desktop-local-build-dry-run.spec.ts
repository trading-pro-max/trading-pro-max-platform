import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public desktop distribution active|production signing active|public release active|upload complete|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|secrets stored in desktop bundle|secrets stored in Git|public ALKON active/i;

test.describe("Al-Kawn Private Desktop Local Build Dry Run", () => {
  test("/desktop/kawn renders private local build dry run", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("private-desktop-local-build-dry-run")).toBeVisible();
    await expect(body).toContainText("Private Desktop Local Build Dry Run");
    await expect(body).toContainText("Local build dry run is not public release");
    await expect(body).toContainText("Al-Kawn Desktop remains Ahmad-only");
    await expect(body).toContainText("No secrets are stored in the desktop bundle");
    await expect(body).toContainText("Production signing and public distribution remain blocked");
    await expect(body).toContainText("Product Truth overrides local build");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe shows local build dry run status", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-card")).toBeVisible();
    await expect(body).toContainText("Private Desktop Local Build Dry Run");
    await expect(body).toContainText("Public desktop distribution is blocked");
    await expect(body).toContainText("Production signing remains a future gate");
    await expect(body).toContainText("Desktop remains Ahmad-only");
    await expect(body).toContainText("Local dry run support");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("local dry run model, docs, report, and safe script exist", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const indexSource = readFileSync(
      "lib/server/universe/desktop-local-build-dry-run/index.ts",
      "utf8",
    );
    const modelSource = readFileSync(
      "lib/server/universe/desktop-local-build-dry-run/local-build-dry-run.ts",
      "utf8",
    );

    expect(packageJson.scripts["desktop:package:dry-run"]).toBe(
      "node scripts/al-kawn-desktop-local-build-dry-run.mjs",
    );
    expect(existsSync("scripts/al-kawn-desktop-local-build-dry-run.mjs")).toBe(true);
    expect(existsSync("docs/product/al-kawn-private-desktop-local-build-dry-run.md")).toBe(
      true,
    );
    expect(existsSync("reports/al-kawn-private-desktop-local-build-dry-run.md")).toBe(true);
    expect(indexSource).toContain("getPrivateDesktopLocalBuildDryRun");
    expect(indexSource).toContain("getLocalBuildCapabilityCheck");
    expect(indexSource).toContain("getLocalBuildSecretSafety");
    expect(modelSource).toContain("Private Desktop Local Build Dry Run");
    expect(modelSource).toContain("Product Truth overrides local build.");
    expect(modelSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
