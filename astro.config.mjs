import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import netlify from '@astrojs/netlify';

import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    db(),
    sentry({
      dsn: process.env.SENTRY_DNS,
      sourceMapsUploadOptions: {
        project: process.env.SENTRY_PROJECT_ID,
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      enabled: {
        client: true,
        //todo: find a solution to fix issues with drizzle-orm to re-enable server side sentry
        server: false,
      }
    }),
  ],
  output: 'server',
  adapter: netlify(),
});
