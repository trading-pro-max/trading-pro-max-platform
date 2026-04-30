import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ط§ظ„ظƒظˆظ† active|public ALKON active|external accounts connected|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled/i;

test.describe("Al-Kawn Local Day One Boot Gate", () => {
  test("/desktop/kawn renders Local Day One boot gate", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Local Day One Boot Gate");
    await expect(body).toContainText("Local Day One is ready but not started");
    await expect(body).toContainText("Ahmad must start Local Day One");
    await expect(body).toContainText("Infinity and Operator are ready for private internal operation");
    await expect(body).toContainText("Legal and Money gates remain Ahmad gates");
    await expect(body).toContainText("Product Truth is enforced");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders Local Day One summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Local Day One Boot Gate");
    await expect(body).toContainText("Local Day One is ready but not started");
    await expect(body).toContainText("Ahmad must start Local Day One");
    await expect(body).toContainText("Infinity and Operator are ready for private internal operation");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("Local Day One readiness model, docs, and report exist", () => {
    const indexSource = readFileSync("lib/server/universe/local-day-one/index.ts", "utf8");
    const readinessSource = readFileSync(
      "lib/server/universe/local-day-one/local-day-one-readiness.ts",
      "utf8",
    );
    const typesSource = readFileSync(
      "lib/server/universe/local-day-one/types.ts",
      "utf8",
    );

    expect(indexSource).toContain("getLocalDayOneReadiness");
    expect(indexSource).toContain("getLocalDayOneBootGate");
    expect(indexSource).toContain("getLocalDayOneChecklist");
    expect(indexSource).toContain("getLocalDayOneBlockedActions");
    expect(indexSource).toContain("getLocalDayOneNextAction");
    expect(typesSource).toContain("ready_not_started");
    expect(existsSync("docs/product/al-kawn-local-day-one-boot-gate.md")).toBe(true);
    expect(existsSync("reports/local-day-one/al-kawn-local-day-one-readiness.md")).toBe(true);
    expect(readinessSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
