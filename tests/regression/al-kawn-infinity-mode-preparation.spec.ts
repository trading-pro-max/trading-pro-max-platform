import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Infinity Mode active|Operator Mode active|public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ط§ظ„ظƒظˆظ† active|public ALKON active|external accounts connected|uncontrolled infinite loop active|secrets stored in report|guaranteed profit|risk free|physical universe controlled/i;

test.describe("Al-Kawn Infinity Mode Preparation", () => {
  test("/desktop/kawn renders Infinity preparation", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-infinity-preparation-panel")).toBeVisible();
    await expect(body).toContainText("Infinity Mode preparation");
    await expect(body).toContainText("Infinity Mode is private internal continuous readiness");
    await expect(body).toContainText("Infinity Mode is not fully active yet");
    await expect(body).toContainText("Daily Work Loop feeds Infinity preparation");
    await expect(body).toContainText("Product Truth controls every cycle");
    await expect(body).toContainText("Legal and Money gates stop execution for Ahmad");
    await expect(body).toContainText("No uncontrolled infinite loop");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders compact Infinity preparation summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-infinity-preparation-summary")).toBeVisible();
    await expect(body).toContainText("Infinity Mode preparation");
    await expect(body).toContainText("Infinity Mode is private internal continuous readiness");
    await expect(body).toContainText("Infinity Mode is not fully active yet");
    await expect(body).toContainText("Daily Work Loop feeds Infinity preparation");
    await expect(body).toContainText("Product Truth controls every cycle");
    await expect(body).toContainText("Legal and Money gates stop execution for Ahmad");
    await expect(body).toContainText("No uncontrolled infinite loop");
    await expect(body).toContainText("No public, money, broker, legal, or external automation");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("Infinity preparation model, reports, and docs exist", () => {
    const indexSource = readFileSync("lib/server/universe/infinity/index.ts", "utf8");
    const preparationSource = readFileSync(
      "lib/server/universe/infinity/infinity-preparation.ts",
      "utf8",
    );
    const cycleSource = readFileSync(
      "lib/server/universe/infinity/infinity-cycle-plan.ts",
      "utf8",
    );
    const boundarySource = readFileSync(
      "lib/server/universe/infinity/infinity-boundaries.ts",
      "utf8",
    );

    expect(indexSource).toContain("getAlKawnInfinityPreparation");
    expect(indexSource).toContain("getInfinityReadiness");
    expect(indexSource).toContain("getInfinityCyclePlan");
    expect(indexSource).toContain("getInfinityBoundaries");
    expect(indexSource).toContain("getInfinitySafeAutomation");
    expect(indexSource).toContain("getInfinityBlockedActions");
    expect(indexSource).toContain("getInfinityNextAction");
    expect(preparationSource).toContain("ready_with_notes");
    expect(preparationSource).toContain("Infinity Mode is not fully active yet.");
    expect(cycleSource).toContain("Infinity cycle waits for safe trigger.");
    expect(boundarySource).toContain("No public, money, broker, legal, or external automation.");
    expect(existsSync("reports/infinity/al-kawn-infinity-preparation.md")).toBe(true);
    expect(existsSync("reports/infinity/al-kawn-infinity-cycle-plan.md")).toBe(true);
    expect(existsSync("reports/infinity/al-kawn-infinity-boundaries.md")).toBe(true);
    expect(existsSync("reports/infinity/al-kawn-infinity-next-action.md")).toBe(true);
    expect(existsSync("docs/product/al-kawn-infinity-mode-preparation.md")).toBe(true);
    expect(preparationSource + cycleSource + boundarySource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
