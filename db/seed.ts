import { db, ContactFormLog, User } from 'astro:db';
import { generateId, Scrypt } from 'lucia';

import { encryptBody } from '@services';
import { createId } from '@paralleldrive/cuid2';

const { DEV } = import.meta.env;

// https://astro.build/db/seed

export default async function seed() {
  if (DEV) {
    await db.insert(ContactFormLog).values({
      Id: createId(),
      body: encryptBody(
        JSON.stringify({
          email: 'jdoe@example.com',
          message: 'Sample email body content here',
        })
      ),
      created: new Date(),
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
