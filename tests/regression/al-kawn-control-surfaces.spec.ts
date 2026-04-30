import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Infinity Mode active|Operator Mode active|public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|guaranteed profit|risk free|Product Truth disabled/i;

test.describe("Al-Kawn Control Surfaces", () => {
  test("/desktop/kawn renders full control surfaces", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-control-surfaces")).toBeVisible();
    await expect(body).toContainText("Control Surfaces");
    await expect(body).toContainText("Each layer has a control surface");
    await expect(body).toContainText("Direct internal execution");
    await expect(body).toContainText("Legal stop");
    await expect(body).toContainText("Money stop");
    await expect(body).toContainText("Blocked by Product Truth");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("Universe Operating Kernel هو القاضي التنفيذي");
    await expect(body).toContainText("Future Automation Control Surface");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders compact control summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-control-surfaces-summary")).toBeVisible();
    await expect(body).toContainText("Al-Kawn Control Surfaces");
    await expect(body).toContainText("Desktop is the main private command client for الكون");
    await expect(body).toContainText("Control surfaces prepare Infinity and Operator safely");
    await expect(body).toContainText("control surfaces");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/trading keeps control status compact", async ({ page }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Earth Control: available");
    await expect(body).toContainText("Earth Planet trading surface");
    await expect(body).toContainText("Product Truth");
    await expect(page.locator('[aria-label="Trading operating truth"] span')).toHaveCount(5);

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("control surface model files expose required exports and surfaces", () => {
    const indexSource = readFileSync("lib/server/universe/control-surfaces/index.ts", "utf8");
    const registrySource = readFileSync(
      "lib/server/universe/control-surfaces/control-surface-registry.ts",
      "utf8",
    );

    expect(existsSync("lib/server/universe/control-surfaces/types.ts")).toBe(true);
    expect(indexSource).toContain("getAlKawnControlSurfaces");
    expect(indexSource).toContain("getControlSurfaceById");
    expect(indexSource).toContain("getControlSurfaceRegistry");
    expect(indexSource).toContain("getControlSurfaceActions");
    expect(indexSource).toContain("getControlSurfaceBoundaries");
    expect(indexSource).toContain("getControlSurfaceSummary");
    expect(indexSource).toContain("getControlSurfaceNextAction");
    expect(registrySource).toContain("Kernel Control Surface");
    expect(registrySource).toContain("Future Automation Control Surface");
    expect(registrySource.match(/Control Surface/g)?.length ?? 0).toBeGreaterThanOrEqual(12);
  });
});
