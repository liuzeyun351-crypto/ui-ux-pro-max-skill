import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

// The CI/sandbox image pre-installs Chromium at /opt/pw-browsers/chromium;
// fall back to it when the version-keyed browser cache doesn't match.
const pinnedChromium = "/opt/pw-browsers/chromium";
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  (fs.existsSync(pinnedChromium) ? pinnedChromium : undefined);

export default defineConfig({
  testDir: "./tests-e2e",
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
