import { defineConfig } from "@playwright/test";

const port = Number(process.env.TPM_REGRESSION_PORT ?? 3210);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/regression",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `node scripts/verify-runtime-baseline.mjs && node node_modules/next/dist/bin/next start -p ${port}`,
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
