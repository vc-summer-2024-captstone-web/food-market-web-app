import { db, EmailLog } from 'astro:db';
import { encryptBody } from './config';

// https://astro.build/db/seed

export default async function seed() {
  await db.insert(EmailLog).values({
    body: encryptBody('Sample email body content here')
  })
}