import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import netlify from '@astrojs/netlify';

import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), sentry()],
  output: 'server',
  adapter: netlify()
});