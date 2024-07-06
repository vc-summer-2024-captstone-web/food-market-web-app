import { db, EmailLog, User } from 'astro:db';
import { encryptBody } from './config';
import { generateId, Scrypt } from 'lucia';

const { DEV } = import.meta.env;

// https://astro.build/db/seed

export default async function seed() {
  if (DEV) {
    await db.insert(EmailLog).values({
      body: encryptBody('Sample email body content here'),
    });
    console.log('Seeding database with test user');
    await db.insert(User).values({
      id: generateId(15),
      name: 'Test User',
      email: 'test.user@example.com',
      password: await new Scrypt().hash('P@ssw0rd'),
      verified: true,
    });
  }
}
