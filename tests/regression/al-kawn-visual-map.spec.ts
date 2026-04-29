import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /Infinity Mode active|Operator Mode active|billing active|payments active|receiving money active|real money active|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|guaranteed profit|risk free|physical universe controlled|Product Truth disabled/i;

test.describe("Al-Kawn Visual Map canonical refinement", () => {
  test("/founder/universe renders the canonical visual map with official structure", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(page.getByTestId("al-kawn-visual-map")).toBeVisible();
    await expect(body).toContainText("Al-Kawn Visual Map");
    await expect(body).toContainText("الكون هو نسخة أحمد الإلكترونية الخاصة.");
    await expect(body).toContainText("الكون فوق برو ماكس.");
    await expect(body).toContainText("Pro Max Galaxy داخل الكون.");
    await expect(body).toContainText("Earth Planet داخل Pro Max Galaxy.");
    await expect(body).toContainText("/trading ينتمي إلى Earth Planet.");
    await expect(body).toContainText("ALKON هو حارس خلفي خاص.");
    await expect(body).toContainText("Infinity Mode محجوب حاليًا.");
    await expect(body).toContainText("Operator Mode محجوب حاليًا.");
    await expect(body).toContainText("Public Pro Max Future بوابة مستقبلية.");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى.");
    await expect(body).toContainText("Universe Operating Kernel هو القاضي التنفيذي.");
    await expect(body).toContainText("كل شيء داخل الكون يجب أن ينتمي إلى طبقة واضحة.");
    await expect(body).toContainText("∞ إلى 0 يعني تفسير البنية والرجوع إلى الأصل.");
    await expect(body).toContainText("Supreme Root Constitution");
    await expect(body).toContainText("Pro Max Center");
    await expect(body).toContainText("Legend");
    await expect(body).toContainText("Boundary explanation");
    await expect(body).toContainText("Future-gated layers");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("visual map model exposes nodes, edges, legend, boundaries, summary, and explanations", () => {
    const requiredFiles = [
      "lib/server/universe/visual-map/visual-map.ts",
      "lib/server/universe/visual-map/map-nodes.ts",
      "lib/server/universe/visual-map/map-edges.ts",
      "lib/server/universe/visual-map/map-groups.ts",
      "lib/server/universe/visual-map/map-legend.ts",
      "lib/server/universe/visual-map/map-status.ts",
      "lib/server/universe/visual-map/map-boundaries.ts",
      "lib/server/universe/visual-map/map-explanations.ts",
      "docs/product/al-kawn-visual-map.md",
      "reports/al-kawn-visual-map-closure.md",
    ];

    for (const file of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    }

    const index = fs.readFileSync(
      path.join(process.cwd(), "lib/server/universe/visual-map/index.ts"),
      "utf8"
    );
    expect(index).toContain("getAlKawnVisualMapNodes");
    expect(index).toContain("getAlKawnVisualMapEdges");
    expect(index).toContain("getAlKawnVisualMapLegend");
    expect(index).toContain("getAlKawnVisualMapBoundaries");
    expect(index).toContain("getAlKawnVisualMapSummary");
    expect(index).toContain("explainVisualMapNode");
  });
});
