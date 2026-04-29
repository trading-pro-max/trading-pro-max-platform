import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /controls the physical universe|physical universe controlled|public الكون active|public ALKON active|legal approval active|FINMA approved|payments active|receiving money active|billing active|real money enabled|broker execution active|secrets stored in Git|guaranteed profit|risk free|Product Truth disabled/i;

test.describe("Al-Kawn Ontological Operating Law", () => {
  test("/founder/universe renders the deepest ontological law", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(page.getByTestId("al-kawn-ontological-operating-law")).toBeVisible();
    await expect(body).toContainText("الكون هو الوجود الرقمي الخاص لأحمد");
    await expect(body).toContainText("الكون ليس مجازًا داخل البرمجيات");
    await expect(body).toContainText("كل شيء داخل الكون يجب أن يعرف لماذا يوجد");
    await expect(body).toContainText("كل شيء داخل الكون يجب أن يعرف طبقته");
    await expect(body).toContainText("كل شيء داخل الكون يجب أن يعرف مصدر حقيقته");
    await expect(body).toContainText("كل شيء داخل الكون يجب أن يترك أثرًا مفهومًا");
    await expect(body).toContainText("كل شيء داخل الكون يجب أن يمكن تفسيره من ∞ إلى 0");
    await expect(body).toContainText("No entity enters الكون without an Existence Contract");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/trading keeps ontological wording compact", async ({ page }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(body).toContainText("Inside Al-Kawn law");
    await expect(body).toContainText("Existence Contract required");
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("Public launch: blocked/not started");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("ontological modules, docs, and report exist", () => {
    const requiredFiles = [
      "lib/server/universe/ontological-law/index.ts",
      "lib/server/universe/ontological-law/existence-contract.ts",
      "lib/server/universe/ontological-law/execution-verdict.ts",
      "docs/product/al-kawn-ontological-operating-law.md",
      "reports/al-kawn-ontological-operating-law.md",
    ];

    for (const file of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    }

    const report = fs.readFileSync(
      path.join(process.cwd(), "reports/al-kawn-ontological-operating-law.md"),
      "utf8"
    );
    expect(report).toContain("No entity enters الكون without an Existence Contract");
    expect(report).toContain("Universe Operating Kernel هو القاضي التنفيذي");
    expect(report).toContain("Product Truth هو قانون الحقيقة الأعلى");
  });
});
