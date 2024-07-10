import { defineDb, defineTable, column } from 'astro:db';
import { createId } from '@paralleldrive/cuid2';

// https://astro.build/db/config

const ContactFormLog = defineTable({
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
    userId: column.text({ optional: false, unique: false, references: () => User.columns.id }),
    token: column.text({ optional: false, unique: true, primaryKey: true }),
    expiresAt: column.number({ optional: false }),
  },
});
export default defineDb({
  tables: {
    User,
    Session,
    EmailVerification,
    ContactFormLog,
  },
});
