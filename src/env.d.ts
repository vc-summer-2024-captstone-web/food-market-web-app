/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    session: import('lucia').Session | null;
    user: import('lucia').User | null;
  }
}
interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly TIME_TO_LIVE: number;
  readonly TIME_TO_LIVE_UNIT: TimeSpanUnit;
  readonly SESSION_SAME_SITE: String<'lax' | 'strict' | 'none'>;
  readonly SESSION_DOMAIN: string;
  readonly SESSION_SECRET: string;
  readonly TOKEN_LENGTH: number;
  readonly VITE_APP_NAME: String;
  // nodemailer (DEV)
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: number;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  // sendgrid (PROD)
  readonly SENDGRID_API_KEY: string;
  readonly SMTP_EMAIL: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
