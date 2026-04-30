import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ط§ظ„ظƒظˆظ† active|public ALKON active|external accounts connected|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled/i;

test.describe("Al-Kawn Operator Controlled Activation", () => {
  test("/desktop/kawn renders Operator controlled activation", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Operator Mode controlled activation");
    await expect(body).toContainText("الكون يعمل عن أحمد داخليًا");
    await expect(body).toContainText("Operator Mode executes safe internal work only");
    await expect(body).toContainText("Legal and Money gates stop execution for Ahmad");
    await expect(body).toContainText("Product Truth blocks unsafe or false actions");
    await expect(body).toContainText("No public, money, broker, legal, or external actions");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders Operator controlled summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Operator Mode controlled activation");
    await expect(body).toContainText("الكون يعمل عن أحمد داخليًا");
    await expect(body).toContainText("Operator Mode executes safe internal work only");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("Operator controlled activation model, docs, and report exist", () => {
    const indexSource = readFileSync("lib/server/universe/operator/index.ts", "utf8");
    const activationSource = readFileSync(
      "lib/server/universe/operator/operator-activation.ts",
      "utf8",
    );

    expect(indexSource).toContain("getOperatorControlledActivation");
    expect(indexSource).toContain("getOperatorCycle");
    expect(indexSource).toContain("getOperatorLedger");
    expect(indexSource).toContain("getOperatorCurrentWork");
    expect(indexSource).toContain("getOperatorHumanMessage");
    expect(indexSource).toContain("getOperatorControlledNextAction");
    expect(activationSource).toContain("closed_operator_internal_active");
    expect(existsSync("docs/product/al-kawn-operator-controlled-activation.md")).toBe(true);
    expect(existsSync("reports/operator/al-kawn-operator-controlled-activation.md")).toBe(true);
    expect(activationSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
