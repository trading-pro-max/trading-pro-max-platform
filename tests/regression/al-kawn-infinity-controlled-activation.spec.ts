import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ط§ظ„ظƒظˆظ† active|public ALKON active|external accounts connected|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled/i;

test.describe("Al-Kawn Infinity Controlled Activation", () => {
  test("/desktop/kawn renders controlled Infinity activation", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-internal-operating-sequence-panel")).toBeVisible();
    await expect(body).toContainText("Infinity Mode controlled activation");
    await expect(body).toContainText("Infinity Mode is active only for private internal cycles");
    await expect(body).toContainText("No uncontrolled infinite loop");
    await expect(body).toContainText("No background daemon");
    await expect(body).toContainText("Safe internal cycles only");
    await expect(body).toContainText("Legal and Money gates stop execution for Ahmad");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders controlled Infinity summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-internal-operating-sequence-summary")).toBeVisible();
    await expect(body).toContainText("Infinity Mode controlled activation");
    await expect(body).toContainText("Infinity Mode is active only for private internal cycles");
    await expect(body).toContainText("No uncontrolled infinite loop");
    await expect(body).toContainText("No background daemon");
    await expect(body).toContainText("Safe internal cycles only");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("Infinity controlled activation model, docs, and report exist", () => {
    const indexSource = readFileSync("lib/server/universe/infinity/index.ts", "utf8");
    const activationSource = readFileSync(
      "lib/server/universe/infinity/controlled-activation.ts",
      "utf8",
    );
    const cycleSource = readFileSync(
      "lib/server/universe/infinity/infinity-cycle-state.ts",
      "utf8",
    );

    expect(indexSource).toContain("getInfinityControlledActivation");
    expect(indexSource).toContain("getInfinityCycleState");
    expect(indexSource).toContain("getInfinityCycleTriggerRules");
    expect(indexSource).toContain("getInfinityCycleLedger");
    expect(indexSource).toContain("getInfinityControlledNextAction");
    expect(activationSource).toContain("Infinity Mode is active only for private internal cycles.");
    expect(cycleSource).toContain("No background daemon.");
    expect(existsSync("docs/product/al-kawn-infinity-controlled-activation.md")).toBe(true);
    expect(existsSync("reports/infinity/al-kawn-infinity-controlled-activation.md")).toBe(true);
    expect(activationSource + cycleSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
