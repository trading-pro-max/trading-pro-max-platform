import { expect, test } from "@playwright/test";

const STORAGE_KEY = "tpm-platform-state-v1";
const DEMO_EMAIL = process.env.TPM_DEMO_EMAIL ?? "demo@tradingpromax.local";
const DEMO_PASSWORD =
  process.env.TPM_DEMO_PASSWORD ?? "TradingProMaxDemo!2026";

test.describe("verified platform truth", () => {
  test("visibly renders the verified workstation and utility routes", async ({
    page,
  }) => {
    const routes = [
      {
        path: "/",
        expectedUrl: /\/en$/,
        text: /Trading Pro Max|Execution Panel|Decision/,
      },
      {
        path: "/en",
        expectedUrl: /\/en$/,
        text: /Trading Pro Max|Execution Panel|Decision/,
      },
      {
        path: "/en/settings",
        expectedUrl: /\/en\/settings$/,
        text: /Settings|Mode and persistence|Paper ticket defaults/,
      },
      {
        path: "/diagnostics",
        expectedUrl: /\/diagnostics$/,
        text: /Diagnostics|System readiness|Connector safety state/,
      },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page).toHaveURL(route.expectedUrl);
      await expect(page.locator("main").first()).toBeVisible();
      await expect(page.locator("body")).toContainText(route.text);

      if (route.path === "/" || route.path === "/en") {
        await expect(page.locator(".tpmv2-command-center").first()).toBeVisible();
        await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
        await expect(page.locator(".tpmv2-execution").first()).toBeVisible();

        const chartBox = await page
          .locator(".tpmv2-chart-surface")
          .first()
          .boundingBox();
        const executionBox = await page
          .locator(".tpmv2-execution")
          .first()
          .boundingBox();

        expect(chartBox?.width ?? 0).toBeGreaterThan(620);
        expect(chartBox?.height ?? 0).toBeGreaterThan(420);
        expect(executionBox?.width ?? 0).toBeGreaterThan(240);
      }

      if (route.path === "/en/settings" || route.path === "/diagnostics") {
        await expect(page.locator(".tpm-utility-page").first()).toBeVisible();
        await expect(page.locator(".tpm-foundation-card").first()).toBeVisible();
      }
    }
  });

  test("keeps unauthenticated preferences on local fallback storage", async ({
    page,
    request,
  }) => {
    const unauthenticatedPreferences = await request.get(
      "/api/account/preferences"
    );
    expect(unauthenticatedPreferences.status()).toBe(401);

    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();
    await page.waitForFunction(
      (key) => Boolean(window.localStorage.getItem(key)),
      STORAGE_KEY
    );

    const storedState = await page.evaluate((key) => {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }, STORAGE_KEY);

    expect(storedState?.accountMode).toBe("demo");
    expect(storedState?.workspacePreferences?.ticketVisible).toBe(true);
    expect(storedState?.workspacePreferences?.chartType).toBe("candlestick");
  });

  test("persists authenticated workspace preferences through the backend", async ({
    request,
  }) => {
    const login = await request.post("/api/auth/login", {
      data: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    });
    expect(login.status()).toBe(200);

    const preferences = {
      chartType: "bars",
      activeIndicators: ["EMA 20", "RSI", "VOL"],
      activeDrawingTool: "Level",
      chartZoom: 120,
      watchlistVisible: true,
      ticketVisible: true,
      blotterExpanded: true,
      timeframe: "5m",
      duration: "30s",
      selectedAssetSymbol: "BTC/USD",
    };

    const update = await request.post("/api/account/preferences", {
      data: { preferences },
    });
    expect(update.status()).toBe(200);
    const updatePayload = await update.json();
    expect(updatePayload.authenticated).toBe(true);
    expect(updatePayload.preferences).toMatchObject(preferences);

    const readBack = await request.get("/api/account/preferences");
    expect(readBack.status()).toBe(200);
    const readBackPayload = await readBack.json();
    expect(readBackPayload.preferences).toMatchObject(preferences);
  });

  test("keeps market feed fallback-first, normalized, and honestly labeled", async ({
    request,
  }) => {
    const valid = await request.get("/api/market?symbol=EUR/USD&timeframe=1m");
    expect(valid.status()).toBe(200);
    const validPayload = await valid.json();

    expect(validPayload.snapshot.feed).toMatchObject({
      adapter: "fallback_simulated",
      state: "fallback_ready",
      sourceLabel: "Fallback market adapter",
      externalFeedActive: false,
    });
    expect(validPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "EUR/USD",
      normalizedTimeframe: "1m",
      symbolFallbackApplied: false,
      timeframeFallbackApplied: false,
    });

    const invalid = await request.get(
      "/api/market?symbol=not-a-market&timeframe=2h"
    );
    expect(invalid.status()).toBe(200);
    const invalidPayload = await invalid.json();
    const noticeCodes = invalidPayload.snapshot.feed.notices.map(
      (notice: { code: string }) => notice.code
    );

    expect(invalidPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "EUR/USD",
      normalizedTimeframe: "1m",
      symbolFallbackApplied: true,
      timeframeFallbackApplied: true,
    });
    expect(noticeCodes).toEqual(
      expect.arrayContaining([
        "fallback_adapter_active",
        "symbol_fallback_applied",
        "timeframe_fallback_applied",
      ])
    );

    const compact = await request.get("/api/market?symbol=btcusd&timeframe=5M");
    expect(compact.status()).toBe(200);
    const compactPayload = await compact.json();
    expect(compactPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "BTC/USD",
      normalizedTimeframe: "5m",
    });
  });

  test("reports diagnostics, readiness, auth-required routes, and connector truth", async ({
    request,
  }) => {
    const health = await request.get("/api/health");
    expect(health.status()).toBe(200);
    const healthPayload = await health.json();
    expect(healthPayload).toMatchObject({
      ok: true,
      status: "ready",
      paperSafe: true,
      liveExecution: "blocked",
    });
    expect(healthPayload.connectors[0]).toMatchObject({
      state: "unconfigured",
      paperCapability: "local_paper_only",
      realCapability: "blocked",
      liveExecution: "blocked",
    });

    const diagnostics = await request.get("/api/diagnostics/probes");
    expect(diagnostics.status()).toBe(200);
    const diagnosticsPayload = await diagnostics.json();
    expect(diagnosticsPayload.ok).toBe(true);

    const probes = new Map(
      diagnosticsPayload.health.probes.map((probe: { key: string }) => [
        probe.key,
        probe,
      ])
    );
    expect(probes.get("server_readiness")).toMatchObject({ status: "ready" });
    expect(probes.get("preferences_persistence")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("market_data")).toMatchObject({ status: "fallback" });
    expect(probes.get("broker_connector")).toMatchObject({
      status: "unconfigured",
    });

    const routes = new Map(
      diagnosticsPayload.health.routes.map((route: { path: string }) => [
        route.path,
        route,
      ])
    );
    expect(routes.get("/api/account/preferences")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/compliance")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/operator/compliance/review")).toMatchObject({
      status: "unconfigured",
    });

    const compliance = await request.get("/api/account/compliance");
    expect(compliance.status()).toBe(401);
    const operatorReview = await request.get(
      "/api/operator/compliance/review?accountId=missing"
    );
    expect(operatorReview.status()).toBe(401);
  });

  test("keeps real-money execution blocked when real mode is selected", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();

    await page.getByRole("button", { name: "Real" }).first().click();

    await expect(page.locator("body")).toContainText("Real");
    await expect(page.locator("body")).toContainText(
      "Order entry stays visible, but execution remains disabled"
    );
    await expect(page.getByRole("button", { name: "Open paper buy" }).first())
      .toBeDisabled();
    await expect(page.getByRole("button", { name: "Open paper sell" }).first())
      .toBeDisabled();
  });
});
