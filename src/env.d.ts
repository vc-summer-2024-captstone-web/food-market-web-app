/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />
import type { TimeSpanUnit } from 'oslo';

declare namespace App {
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}
interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly TIME_TO_LIVE: number;
  readonly TIME_TO_LIVE_UNIT: TimeSpanUnit;
  readonly SESSION_SAME_SITE: String<'lax' | 'strict' | 'none'>;
  readonly SESSION_DOMAIN: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
