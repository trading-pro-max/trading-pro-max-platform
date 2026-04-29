import { expect, test } from "@playwright/test";

const FORBIDDEN_CLAIMS =
  /Infinity Mode active|Operator Mode active|public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|guaranteed profit|risk free|physical universe controlled|Product Truth disabled/i;

test.describe("Al-Kawn Unified Visual Identity System", () => {
  test("founder universe renders command identity, canonical visual markers, and Product Truth", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-unified-visual-identity").first()).toBeVisible();
    await expect(page.getByTestId("al-kawn-cosmic-identity").first()).toBeVisible();
    await expect(page.getByTestId("al-kawn-product-truth-strip").first()).toBeVisible();
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("الكون هو الامتداد الإلكتروني الخاص بأحمد");
    await expect(body).toContainText("Pro Max Galaxy داخل الكون");
    await expect(body).toContainText("Earth Planet داخل Pro Max Galaxy");
    await expect(body).toContainText("Universe Operating Kernel");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("desktop renders main operating identity with shared truth and cosmic identity", async ({
    page,
  }) => {
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.locator('[data-al-kawn-visual-system="canonical"]').first()).toBeVisible();
    await expect(page.getByTestId("al-kawn-cosmic-identity").first()).toBeVisible();
    await expect(page.getByTestId("al-kawn-product-truth-strip").first()).toBeVisible();
    await expect(body).toContainText("Al-Kawn Desktop is Ahmad's private operating environment");
    await expect(body).toContainText("Desktop is the main private command client for الكون");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("الكون هو الامتداد الإلكتروني الخاص بأحمد");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("trading renders compact identity without chip clutter and keeps chart priority", async ({
    page,
  }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-unified-visual-identity").first()).toBeVisible();
    await expect(page.getByTestId("al-kawn-cosmic-identity").first()).toBeVisible();
    await expect(page.getByTestId("al-kawn-product-truth-strip").first()).toBeVisible();
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("Inside Al-Kawn law");
    await expect(body).toContainText("Earth Planet trading surface");
    await expect(body).toContainText("Trading Workspace");

    await expect(page.locator('[aria-label="Trading operating truth"] span')).toHaveCount(5);

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("Pro Max Center renders public-safe shared identity if present", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Pro Max Center");
    await expect(page.locator('[data-al-kawn-visual-system="canonical"]').first()).toBeVisible();
    await expect(page.getByTestId("al-kawn-cosmic-identity").first()).toBeVisible();
    await expect(page.getByTestId("al-kawn-product-truth-strip").first()).toBeVisible();
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("public launch blocked");
    await expect(body).toContainText("real money disabled");
    await expect(body).toContainText("broker execution disabled/not connected");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
