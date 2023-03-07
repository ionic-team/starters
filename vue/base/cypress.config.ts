import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: "tests/e2e/support/e2e.{js,jsx,ts,tsx}",
    specPattern: "tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
