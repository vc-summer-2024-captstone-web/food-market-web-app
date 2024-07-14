import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    video: false,
    baseUrl: process.env.TEST_BASEURL || 'http://localhost:4321/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
