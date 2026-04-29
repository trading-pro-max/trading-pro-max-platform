import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /payments active without Ahmad|receiving money active without Ahmad|billing active|real money enabled|broker execution active|public launch active|legal approval active|FINMA approved|licensed trading platform|brand adopted|domain purchased|secrets stored in Git|external accounts connected without approval|fully autonomous live trading|Universe public active|الكون public active|ALKON public active|guaranteed profit|risk free/i;

test.describe("Absolute Founder Boundary 100", () => {
  test("/founder/universe renders the Absolute Founder Boundary", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(page.getByTestId("absolute-founder-boundary")).toBeVisible();
    await expect(body).toContainText("الكون ينفذ الأعمال الداخلية الآمنة مباشرة");
    await expect(body).toContainText(
      "أحمد يوافق على الأمور الرسمية والقانونية والمالية والإطلاق والبروكر والاسم والقرارات النهائية"
    );
    await expect(body).toContainText(
      "الدفع واستلام الأموال يتطلبان موافقة أحمد دائمًا"
    );
    await expect(body).toContainText(
      "التداول الحقيقي وتنفيذ البروكر يتطلبان موافقة أحمد دائمًا"
    );
    await expect(body).toContainText(
      "الأسرار والوثائق الخاصة لا تخرج من سيطرة أحمد إلا بموافقة صريحة"
    );
    await expect(body).toContainText("الكون لا يتجاوز Product Truth");
    await expect(body).toContainText(
      "Universe Operating Kernel enforces Absolute Founder Boundary"
    );
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Public launch: blocked/not started");
    await expect(body).toContainText("Billing: not active");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/trading keeps only compact founder boundary chips", async ({ page }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(body).toContainText("Founder Boundary: active");
    await expect(body).toContainText("Money/broker actions approval-gated");
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Public launch: blocked/not started");
    await expect(body).toContainText("Billing inactive");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("boundary modules, docs, and reports exist", () => {
    const requiredFiles = [
      "lib/server/universe/founder-boundary/index.ts",
      "lib/server/universe/founder-boundary/boundary-guard.ts",
      "docs/product/absolute-founder-boundary-standard.md",
      "reports/absolute-founder-boundary-100.md",
    ];

    for (const file of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    }

    const report = fs.readFileSync(
      path.join(process.cwd(), "reports/absolute-founder-boundary-100.md"),
      "utf8"
    );
    expect(report).toContain("Universe Operating Kernel enforces Absolute Founder Boundary");
    expect(report).toContain("Product Truth overrides every action");
    expect(report).toContain("Al-Kawn Visual Map");
  });
});
