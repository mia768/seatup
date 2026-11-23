import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  webServer: { command: 'npx expo start --web --port 8083', url: 'http://localhost:8083', reuseExistingServer: !process.env.CI, timeout: 120000, env: { CI: '1', EXPO_NO_TELEMETRY: '1' } },
  timeout: 60000,
  projects: [{ name: 'mobile', use: { viewport: { width: 412, height: 915 } } }, { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } }],
  use: { baseURL: 'http://localhost:8083', viewport: { width: 412, height: 915 }, launchOptions: { ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] } },
});
