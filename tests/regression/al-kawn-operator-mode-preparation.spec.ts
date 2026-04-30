import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ط§ظ„ظƒظˆظ† active|public ALKON active|external accounts connected|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled/i;

test.describe("Al-Kawn Operator Mode Preparation", () => {
  test("/desktop/kawn renders Operator preparation", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Operator Mode preparation");
    await expect(body).toContainText("Operator Mode prepares الكون to work for Ahmad internally");
    await expect(body).toContainText("Operator Mode is not fully active yet");
    await expect(body).toContainText("Infinity feeds Operator preparation");
    await expect(body).toContainText("Legal and Money gates stop execution for Ahmad");
    await expect(body).toContainText("Product Truth overrides operator actions");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders Operator preparation summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Operator Mode preparation");
    await expect(body).toContainText("Operator Mode prepares الكون to work for Ahmad internally");
    await expect(body).toContainText("Infinity feeds Operator preparation");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("Operator preparation model, docs, and report exist", () => {
    const indexSource = readFileSync("lib/server/universe/operator/index.ts", "utf8");
    const preparationSource = readFileSync(
      "lib/server/universe/operator/operator-preparation.ts",
      "utf8",
    );

    expect(indexSource).toContain("getAlKawnOperatorPreparation");
    expect(indexSource).toContain("getOperatorReadiness");
    expect(indexSource).toContain("getOperatorPermissions");
    expect(indexSource).toContain("getOperatorWorkQueue");
    expect(indexSource).toContain("getOperatorBlockedActions");
    expect(indexSource).toContain("getOperatorNextAction");
    expect(preparationSource).toContain("closed_ready_for_operator_activation");
    expect(existsSync("docs/product/al-kawn-operator-mode-preparation.md")).toBe(true);
    expect(existsSync("reports/operator/al-kawn-operator-mode-preparation.md")).toBe(true);
    expect(preparationSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
