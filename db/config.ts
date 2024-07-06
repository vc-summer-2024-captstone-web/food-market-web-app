import { defineDb, defineTable, column } from 'astro:db';
import { createId } from '@paralleldrive/cuid2';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { Buffer } from 'buffer';

// https://astro.build/db/config

const EmailLog = defineTable({
  columns: {
    Id: column.text({ optional: false, primaryKey: true, default: createId() }),
    body: column.text(),
    created: column.date({ default: new Date() }),
  },
});

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    name: column.text({ optional: false }),
    email: column.text({ optional: false, unique: true }),
    password: column.text({ optional: false }),
    verified: column.boolean({ optional: false, default: false }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    expiresAt: column.number({ optional: false }),
  },
});

const EmailVerification = defineTable({
  columns: {
    userId: column.text({ optional: false, unique: true, references: () => User.columns.id }),
    token: column.text({ optional: false }),
    expiresAt: column.number({ optional: false }),
  },
});
export default defineDb({
  tables: {
    User,
    Session,
    EmailVerification,
    EmailLog,
  },
});

export const encryptBody = (body: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.SECRET_KEY || '____this_is_a_top_secret_key____'),
    iv
  );
  let encrypted = cipher.update(body);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString();
};
