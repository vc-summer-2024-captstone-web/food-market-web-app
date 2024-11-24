import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import netlify from '@astrojs/netlify';

// import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    db(),
    // sentry({
    //   dsn: process.env.SENTRY_DNS,
    //   sourceMapsUploadOptions: {
    //     project: process.env.SENTRY_PROJECT_ID,
    //     authToken: process.env.SENTRY_AUTH_TOKEN,
    //   },
    // }),
  ],
  output: 'server',
  adapter: netlify(),
});
