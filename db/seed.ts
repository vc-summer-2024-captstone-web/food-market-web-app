import { db, ContactFormLog, User, Market, Role } from 'astro:db';

import { generateId, Scrypt } from 'lucia';
import { DEFAULT_ROLE_ID } from './config';

import { encryptBody, getDefaultUserRole } from '@services';
import { createId } from '@paralleldrive/cuid2';

const { DEV } = import.meta.env;

// https://astro.build/db/seed

export default async function seed() {
  if (DEV) {
    await createRoles();
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

    await db.insert(User).values({
      id: generateId(15),
      name: 'Test User',
      email: 'test.user@example.com',
      password: await new Scrypt().hash('P@ssw0rd'),
      verified: true,
      role: await getDefaultUserRole(),
    });

    await db.insert(Market).values({
      id: createId(),
      name: 'Audubon Park Farmers Market',
      address: 'Stardust parking lot 1842 East Winter Park Road',
      long: -81.3656,
      lat: 28.5708,
    });

    await db.insert(Market).values({
      id: createId(),
      name: 'Orlando Farmers Market',
      address: 'Lake Eola, 195 North Rosalind Avenue',
      long: -81.3752,
      lat: 28.544,
    });

    await db.insert(Market).values({
      id: createId(),
      name: 'Publix Super Market at Rio Pinar Plaza',
      address: '409 S Chickasaw Trail, Orlando, FL 32825',
      long: -81.2737,
      lat: 28.538,
    });
  }
}

async function createRoles() {
  await db.insert(Role).values({
    id: createId(),
    name: 'Admin',
    canManageUsers: true,
    canManageRoles: true,
    canManageMarkets: true,
    canManageProducts: true,
    canViewContactFormLogs: true,
  });
  await db.insert(Role).values({
    id: DEFAULT_ROLE_ID,
    name: 'User',
    canManageUsers: false,
    canManageRoles: false,
    canManageMarkets: false,
    canManageProducts: false,
    canViewContactFormLogs: false,
  });
}
