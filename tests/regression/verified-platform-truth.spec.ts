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
        expectedUrl: /\/$/,
        text: /Public Commercial Entry|Platform truth|First-use path|Route flow/,
      },
      {
        path: "/en",
        expectedUrl: /\/en$/,
        text: /Trading Pro Max|Execution Panel|Decision/,
      },
      {
        path: "/en/settings",
        expectedUrl: /\/en\/settings$/,
        text: /Settings|Mode and persistence|Paper ticket defaults|Account and commercial readiness/,
      },
      {
        path: "/diagnostics",
        expectedUrl: /\/diagnostics$/,
        text:
          /Diagnostics|System readiness|Connector safety state|Commercial trust and public product state/,
      },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page).toHaveURL(route.expectedUrl);
      await expect(page.locator("main").first()).toBeVisible();
      await expect(page.locator("body")).toContainText(route.text);

      if (route.path === "/") {
        await expect(page.locator(".tpm-product-entry").first()).toBeVisible();
        await expect(page.locator(".tpm-product-hero").first()).toBeVisible();
        await expect(page.locator(".tpm-product-workstation-shell").first()).toBeVisible();
        await expect(page.locator("body")).toContainText(
          /Paper-only evaluation|Fallback-first market data|Live execution blocked/
        );
        await expect(page.locator("body")).toContainText(
          /TPM IQ \/ Brain|Interpretive, bounded guidance|Chart \+ execution stay primary/
        );
        await expect(page.locator("body")).toContainText(
          /Broker unconfigured|no fake activation|not a live brokerage terminal/
        );
      }

      if (route.path === "/" || route.path === "/en") {
        await expect(page.locator(".tpmv2-command-center").first()).toBeVisible();
        await expect(page.locator(".tpmv2-brain-deck").first()).toBeVisible();
        await expect(page.locator(".tpmv2-workspace-depth-bar").first()).toBeVisible();
        await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
        await expect(page.locator(".tpmv2-chart-depth-panel").first()).toBeVisible();
        await expect(page.locator(".tpmv2-execution").first()).toBeVisible();
        await expect(page.locator(".tpmv2-ticket-preflight").first()).toBeVisible();
        await expect(page.locator(".tpmv2-ticket-activity").first()).toBeVisible();
        await expect(page.locator("body")).toContainText(
          /TPM IQ \/ Brain|Market context|Operator guidance|Truth layer/
        );
        await expect(page.locator("body")).toContainText(
          /Workspace depth|Shortcut layer|Layout-only|Recent desk activity|Market depth/
        );
        await expect(page.locator("body")).toContainText(
          /Paper access|Fallback-bound|Interpretive only|Live blocked/
        );
        await expect(page.locator("body")).toContainText("Fallback-bound");
        await expect(page.locator("body")).toContainText("Interpretive only");
        await expect(page.locator("body")).toContainText("Live blocked");

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
        await expect(page.locator("body")).toContainText(
          /Workspace depth and interaction layer|Workstation depth and shortcut truth/
        );
        await expect(page.locator("body")).toContainText(
          /Commercial trust and public product state|Account and commercial readiness|First-use platform guidance/
        );
        await expect(page.locator("body")).toContainText(
          /Product trust ledger|Commercial packaging readiness|No billing system active|Broker integration/
        );
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
    expect(typeof validPayload.snapshot.feed.readinessScore).toBe("number");
    expect(validPayload.snapshot.feed.readinessScore).toBeGreaterThanOrEqual(0);
    expect(validPayload.snapshot.feed.freshness).toMatchObject({
      chart: expect.stringMatching(/Fresh|Warm|Session Closed|Delayed|Stale|Pending/),
      health: expect.stringMatching(/Healthy|Stable|Delayed|Degraded|Session Closed/),
    });
    expect(validPayload.snapshot.assets[0].freshness).toMatch(
      /Fresh|Warm|Session Closed|Delayed|Stale|Pending/
    );
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

  test("shows truthful degraded intelligence when the market route falls back locally", async ({
    page,
  }) => {
    await page.route("**/api/market**", async (route) => {
      await route.abort();
    });

    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator(".tpmv2-brain-deck").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Degraded");
    await expect(page.locator("body")).toContainText(
      "Context engine operating in degraded mode"
    );
    await expect(page.locator("body")).toContainText(
      "fallback-safe structure cues"
    );
    await expect(page.locator("body")).toContainText("Interpretive only");
    await expect(page.locator("body")).toContainText("Live blocked");
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
    expect(healthPayload.policyTruth).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      marketData: "fallback_first",
      brokerRouting: "blocked",
      externalFeed: "fallback_active",
    });
    expect(healthPayload.architecture.marketFeed.policyMode).toBe("fallback_first");
    expect(typeof healthPayload.architecture.marketFeed.readinessScore).toBe("number");
    expect(typeof healthPayload.architecture.marketFeed.readinessStage).toBe("string");
    expect(typeof healthPayload.architecture.broker.readinessScore).toBe("number");
    expect(typeof healthPayload.architecture.broker.readinessStage).toBe("string");
    expect(healthPayload.clientExpansion).toMatchObject({
      shared: {
        apiContract: "http_json_v1",
        executionSafety: "paper_only_live_blocked",
      },
      desktop: {
        state: "future_ready",
        foundation: {
          runtimeBridge: "ipc_json_v1",
          packaging: "contract_ready",
          sessionStrategy: "http_session_bridge",
        },
      },
      mobile: {
        state: "future_ready",
        foundation: {
          runtimeBridge: "bridge_json_v1",
          pushDelivery: "unconfigured",
          sessionStrategy: "session_or_token_bridge",
        },
      },
    });
    expect(healthPayload.clientExpansion.desktop.foundation.targets).toEqual(
      expect.arrayContaining(["windows", "macos", "linux"])
    );
    expect(healthPayload.clientExpansion.mobile.foundation.targets).toEqual(
      expect.arrayContaining(["android", "ios"])
    );
    expect(Array.isArray(healthPayload.subsystems)).toBe(true);
    expect(healthPayload.subsystems.length).toBeGreaterThanOrEqual(8);
    expect(healthPayload.connectors[0]).toMatchObject({
      paperCapability: "local_paper_only",
      realCapability: "blocked",
      liveExecution: "blocked",
    });
    expect(["unconfigured", "configured_blocked"]).toContain(
      healthPayload.connectors[0].state
    );

    const diagnostics = await request.get("/api/diagnostics/probes");
    expect(diagnostics.status()).toBe(200);
    const diagnosticsPayload = await diagnostics.json();
    expect(diagnosticsPayload.ok).toBe(true);

    const probes = new Map<string, { key: string; status: string }>(
      diagnosticsPayload.health.probes.map((probe: { key: string; status: string }) => [
        probe.key,
        probe,
      ])
    );
    expect(probes.get("server_readiness")).toMatchObject({ status: "ready" });
    expect(probes.get("preferences_persistence")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("workspace_persistence")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("runtime_ops")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("product_backend_state")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("commercial_scaling_foundation")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("market_data")).toMatchObject({ status: "fallback" });
    expect(["unconfigured", "blocked"]).toContain(
      probes.get("broker_connector")?.status
    );
    expect(["unconfigured", "blocked"]).toContain(
      probes.get("real_integrations_foundation")?.status
    );
    expect(probes.get("alerts_workflow")).toMatchObject({
      status: "unconfigured",
    });
    expect(probes.get("intelligence_backend")).toMatchObject({
      status: "ready",
    });

    const routes = new Map<string, { path: string; status: string }>(
      diagnosticsPayload.health.routes.map((route: { path: string; status: string }) => [
        route.path,
        route,
      ])
    );
    expect(routes.get("/api/account/preferences")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/commercial/catalog")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/account/commercial-state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/workspace")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/product-state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/alerts/workflows")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/market/feed-state")).toMatchObject({
      status: "fallback",
    });
    expect(["unconfigured", "blocked"]).toContain(
      routes.get("/api/broker/state")?.status
    );
    expect(routes.get("/api/platform/desktop/state")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/platform/mobile/state")).toMatchObject({
      status: "ready",
    });
    expect(["unconfigured", "blocked"]).toContain(
      routes.get("/api/integrations/readiness")?.status
    );
    expect(routes.get("/api/account/compliance")).toMatchObject({
      status: "auth_required",
    });
    expect(["unconfigured", "auth_required"]).toContain(
      routes.get("/api/operator/compliance/review")?.status
    );

    const compliance = await request.get("/api/account/compliance");
    expect(compliance.status()).toBe(401);
    const commercialStateUnauth = await request.get("/api/account/commercial-state");
    expect(commercialStateUnauth.status()).toBe(401);
    const operatorReview = await request.get(
      "/api/operator/compliance/review?accountId=missing"
    );
    expect(operatorReview.status()).toBe(401);

    const broker = await request.get("/api/broker/state");
    expect(broker.status()).toBe(200);
    const brokerPayload = await broker.json();
    expect(brokerPayload.integration.integration).toMatchObject({
      paperRouting: "local_paper_only",
      realRouting: "blocked",
    });
    expect(brokerPayload.safety.liveExecution).toBe("blocked");
    expect(["unconfigured", "configured_blocked"]).toContain(
      brokerPayload.safety.state
    );

    const feedState = await request.get("/api/market/feed-state");
    expect(feedState.status()).toBe(200);
    const feedStatePayload = await feedState.json();
    expect(feedStatePayload.snapshot).toMatchObject({
      policyMode: "fallback_first",
    });
    expect(typeof feedStatePayload.snapshot.readiness.score).toBe("number");
    expect(typeof feedStatePayload.snapshot.readiness.stage).toBe("string");
    expect([
      "unconfigured",
      "configured_inactive",
      "configured_blocked",
    ]).toContain(feedStatePayload.snapshot.externalDriver.state);

    const desktopState = await request.get("/api/platform/desktop/state");
    expect(desktopState.status()).toBe(200);
    const desktopStatePayload = await desktopState.json();
    expect(desktopStatePayload.snapshot.truth).toMatchObject({
      foundationState: "contract_ready",
      hostRuntime: "desktop_shell_reserved",
      nativeClaims: "none",
    });
    expect(desktopStatePayload.snapshot.bridge).toMatchObject({
      protocol: "ipc_json_v1",
      transport: "local_host_bridge",
    });
    expect(desktopStatePayload.snapshot.targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ os: "windows" }),
        expect.objectContaining({ os: "macos" }),
        expect.objectContaining({ os: "linux" }),
      ])
    );
    expect(desktopStatePayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const mobileState = await request.get("/api/platform/mobile/state");
    expect(mobileState.status()).toBe(200);
    const mobileStatePayload = await mobileState.json();
    expect(mobileStatePayload.snapshot.truth).toMatchObject({
      foundationState: "contract_ready",
      runtime: "mobile_shell_reserved",
      pushClaims: "none",
    });
    expect(mobileStatePayload.snapshot.bridge).toMatchObject({
      protocol: "bridge_json_v1",
      transport: "native_web_runtime_bridge",
    });
    expect(mobileStatePayload.snapshot.targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ platform: "android" }),
        expect.objectContaining({ platform: "ios" }),
      ])
    );
    expect(mobileStatePayload.snapshot.workflow).toMatchObject({
      pushDelivery: "unconfigured",
    });
    expect(mobileStatePayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const integrationReadiness = await request.get("/api/integrations/readiness");
    expect(integrationReadiness.status()).toBe(200);
    const integrationPayload = await integrationReadiness.json();
    expect(integrationPayload.snapshot.policy).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked_until_policy_release",
      externalFeedActivation: "blocked_until_policy_release",
      operatorApproval: "required",
    });
    expect(integrationPayload.snapshot.activation).toMatchObject({
      mode: "operator_review_and_policy_guard",
      canActivateNow: false,
    });
    expect(Array.isArray(integrationPayload.snapshot.activation.blockedReasons)).toBe(
      true
    );
    expect(integrationPayload.snapshot.activation.blockedReasons.length).toBeGreaterThan(
      0
    );
    expect(["unconfigured", "configured_blocked"]).toContain(
      integrationPayload.snapshot.broker.state
    );
    expect(["unconfigured", "configured_inactive", "configured_blocked"]).toContain(
      integrationPayload.snapshot.marketFeed.state
    );

    const commercialCatalog = await request.get("/api/commercial/catalog");
    expect(commercialCatalog.status()).toBe(200);
    const commercialCatalogPayload = await commercialCatalog.json();
    expect(commercialCatalogPayload.snapshot.truth).toMatchObject({
      billingEngine: "inactive",
      subscriptionEngine: "unconfigured",
      checkoutSurface: "not_enabled",
      paidPlanActivation: "not_enabled",
    });
    expect(commercialCatalogPayload.snapshot.plans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "evaluation", billing: "inactive" }),
        expect.objectContaining({ key: "team_review", billing: "inactive" }),
      ])
    );

    const workspace = await request.get("/api/account/workspace");
    expect(workspace.status()).toBe(401);
    const productState = await request.get("/api/account/product-state");
    expect(productState.status()).toBe(401);
    const workflows = await request.get("/api/alerts/workflows");
    expect(workflows.status()).toBe(401);

    const intelligence = await request.get(
      "/api/intelligence/context?symbol=EURUSD&timeframe=1m"
    );
    expect(intelligence.status()).toBe(200);
    const intelligencePayload = await intelligence.json();
    expect(intelligencePayload.snapshot).toMatchObject({
      authenticated: false,
      availability: "bounded",
    });
    expect(intelligencePayload.snapshot.truth).toMatchObject({
      predictiveScope: "interpretive_only",
      liveExecution: "blocked",
    });
  });

  test("persists backend workspace depth and workflow state for authenticated sessions", async ({
    request,
  }) => {
    const login = await request.post("/api/auth/login", {
      data: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    });
    expect(login.status()).toBe(200);

    const product = await request.get("/api/account/product-state");
    expect(product.status()).toBe(200);
    const productPayload = await product.json();
    expect(productPayload.snapshot.capabilities).toMatchObject({
      liveExecution: "blocked",
      marketData: "fallback_first",
    });
    expect(productPayload.snapshot.trust).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
    });
    expect(productPayload.snapshot.commercial).toMatchObject({
      billing: "inactive",
      subscriptions: "unconfigured",
      plan: "evaluation",
    });

    const commercialState = await request.get("/api/account/commercial-state");
    expect(commercialState.status()).toBe(200);
    const commercialStatePayload = await commercialState.json();
    expect(commercialStatePayload.snapshot.plan).toMatchObject({
      key: "evaluation",
      state: "active_evaluation",
    });
    expect(commercialStatePayload.snapshot.billing).toMatchObject({
      engine: "inactive",
      subscriptions: "unconfigured",
      checkout: "not_enabled",
    });
    expect(commercialStatePayload.snapshot.trust).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      paidPlanActivation: "not_enabled",
      billingClaims: "none",
    });

    const workspaceUpdate = await request.post("/api/account/workspace", {
      data: {
        workspaceDepth: {
          focusMode: "execution_focus",
          watchlistDensity: "dense",
          shortcutLayer: "layout_only",
        },
      },
    });
    expect(workspaceUpdate.status()).toBe(200);
    const workspaceUpdatePayload = await workspaceUpdate.json();
    expect(workspaceUpdatePayload.workspaceDepth).toMatchObject({
      focusMode: "execution_focus",
      watchlistDensity: "dense",
      shortcutLayer: "layout_only",
    });

    const workspaceRead = await request.get("/api/account/workspace");
    expect(workspaceRead.status()).toBe(200);
    const workspaceReadPayload = await workspaceRead.json();
    expect(workspaceReadPayload.workspaceDepth).toMatchObject({
      focusMode: "execution_focus",
      watchlistDensity: "dense",
      shortcutLayer: "layout_only",
    });
    expect(workspaceReadPayload.source).toBe("backend_audit");

    const workflowsRead = await request.get("/api/alerts/workflows");
    expect(workflowsRead.status()).toBe(200);
    const workflowsReadPayload = await workflowsRead.json();
    expect(workflowsReadPayload.snapshot.runtime).toMatchObject({
      delivery: "unconfigured",
      automation: "inactive",
      liveExecution: "blocked",
    });

    const nextRules = [
      {
        id: "volatility-watch",
        label: "Volatility watch",
        state: "enabled",
        metric: "volatility",
        operator: "gt",
        threshold: 1.2,
        action: "desk_note",
        cooldownSeconds: 90,
      },
      {
        id: "drawdown-guard",
        label: "Drawdown guard",
        state: "enabled",
        metric: "session_drawdown",
        operator: "lt",
        threshold: -110,
        action: "review_flag",
        cooldownSeconds: 180,
      },
    ];

    const workflowsUpdate = await request.post("/api/alerts/workflows", {
      data: {
        rules: nextRules,
      },
    });
    expect(workflowsUpdate.status()).toBe(200);
    const workflowsUpdatePayload = await workflowsUpdate.json();
    expect(workflowsUpdatePayload.snapshot.source).toBe("backend_audit");
    expect(workflowsUpdatePayload.snapshot.rules).toHaveLength(2);

    const intelligence = await request.get(
      "/api/intelligence/context?symbol=EUR/USD&timeframe=5m"
    );
    expect(intelligence.status()).toBe(200);
    const intelligencePayload = await intelligence.json();
    expect(intelligencePayload.snapshot).toMatchObject({
      authenticated: true,
      availability: "bounded",
    });
    expect(intelligencePayload.snapshot.workflow.state).toBe("configured_local");
    expect(intelligencePayload.snapshot.execution.liveExecution).toBe("blocked");
    expect(intelligencePayload.snapshot.truth.executionAuthority).toBe(
      "operator_manual"
    );
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
