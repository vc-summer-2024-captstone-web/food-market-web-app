import { db, ContactTableLog, User } from 'astro:db';
import { generateId, Scrypt } from 'lucia';

import { encryptBody } from '@services';

const { DEV } = import.meta.env;

// https://astro.build/db/seed

export default async function seed() {
  if (DEV) {
    await db.insert(ContactTableLog).values({
      body: encryptBody(
        JSON.stringify({
          email: 'jdoe@example.com',
          messsage: 'Sample email body content here',
        })
      ),
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
