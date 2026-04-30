import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|unknown-source asset public approved|global ownership confirmed|trademark approved|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled|Product Truth disabled/i;

test.describe("Al-Kawn Total Existence System", () => {
  test("/desktop/kawn renders total existence system", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-total-existence-completion-panel")).toBeVisible();
    await expect(body).toContainText("Total Existence System");
    await expect(body).toContainText("الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص");
    await expect(body).toContainText("الكون هو كون إلكتروني كامل خاص داخل لابتوب أحمد");
    await expect(body).toContainText("الكون ليس Dashboard عادي");
    await expect(body).toContainText("الكون لا يدّعي التحكم بالكون الفيزيائي");
    await expect(body).toContainText("كل شيء داخل الكون يمكن تفسيره من ∞ إلى 0");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders compact total existence summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-total-existence-summary")).toBeVisible();
    await expect(body).toContainText("الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("Universe Operating Kernel هو القاضي التنفيذي");
    await expect(body).toContainText("Swiss-inspired precision, not official Swiss endorsement");
    await expect(body).toContainText("Product Truth remains visible above visual beauty");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("total existence source, docs, and report exist", () => {
    const source = readFileSync("lib/server/universe/total-existence/index.ts", "utf8");

    expect(source).toContain("getAlKawnTotalExistenceSystem");
    expect(source).toContain("getTotalExistenceLayerTree");
    expect(source).toContain("getTotalExistenceEntityRegistry");
    expect(source).toContain("getTotalExistenceTruth");
    expect(source).toContain("getTotalExistenceMissingItems");
    expect(source).toContain("getTotalExistenceNextAction");
    expect(source).toContain("الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص.");
    expect(existsSync("docs/product/al-kawn-total-existence-system.md")).toBe(true);
    expect(existsSync("reports/al-kawn-total-existence-system.md")).toBe(true);
    expect(source).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
