import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /public الكون active|public ALKON active|legal approval active|FINMA approved|licensed trading platform|payments active|receiving money active|billing active|real money enabled|broker execution active|guaranteed profit|risk free|Product Truth disabled/i;

test.describe("Al-Kawn Visual Map", () => {
  test("/founder/universe renders the private visual architecture map", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(page.getByTestId("al-kawn-visual-map")).toBeVisible();
    await expect(body).toContainText("Al-Kawn Visual Map");
    await expect(body).toContainText("أحمد هو الأصل");
    await expect(body).toContainText("الكون هو الوجود الرقمي الخاص بأحمد");
    await expect(body).toContainText(
      "Every entity inside الكون needs an Existence Contract"
    );
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("Universe Operating Kernel هو القاضي التنفيذي");
    await expect(body).toContainText("Pro Max Galaxy is inside الكون");
    await expect(body).toContainText("Earth Planet is the trading project");
    await expect(body).toContainText(
      "Swiss Local Constitution is above the Global Layer"
    );
    await expect(body).toContainText("ALKON is private/background");
    await expect(body).toContainText(
      "Legal and Money gates stop execution for Ahmad"
    );
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("public launch blocked");
    await expect(body).toContainText("billing inactive");
    await expect(body).toContainText("payments inactive");
    await expect(body).toContainText("real money disabled");
    await expect(body).toContainText("broker execution disabled/not connected");
    await expect(body).toContainText("legal review pending");
    await expect(body).toContainText("ALKON private/background");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("visual map model, docs, and report exist", () => {
    const requiredFiles = [
      "lib/server/universe/visual-map/index.ts",
      "lib/server/universe/visual-map/types.ts",
      "lib/server/universe/visual-map/visual-map-model.ts",
      "docs/product/al-kawn-visual-map-standard.md",
      "reports/al-kawn-visual-map-closure.md",
    ];

    for (const file of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    }

    const standard = fs.readFileSync(
      path.join(process.cwd(), "docs/product/al-kawn-visual-map-standard.md"),
      "utf8"
    );

    expect(standard).toContain("Al-Kawn Visual Map");
    expect(standard).toContain("Product Truth as the highest truth law");
    expect(standard).toContain("Swiss Local Constitution above Global Layer");
  });
});
