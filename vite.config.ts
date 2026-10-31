import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // Playwright e2e specs live in e2e/.
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
