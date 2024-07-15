import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config

const ContactFormLog = defineTable({
  columns: {
    Id: column.text({ optional: false, primaryKey: true }),
    body: column.text(),
    created: column.date({ optional: false }),
  },
});

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    name: column.text({ optional: false }),
    email: column.text({ optional: false, unique: true }),
    password: column.text({ optional: false }),
    verified: column.boolean({ optional: false, default: false }),
    role: column.text({
      optional: false,
      references: () => Role.columns.id,
    }),
  },
});

const Role = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    name: column.text({ optional: false, unique: true }),
    canManageUsers: column.boolean({ optional: false, default: false }),
    canManageRoles: column.boolean({ optional: false, default: false }),
    canManageMarkets: column.boolean({ optional: false, default: false }),
    canViewContactFormLogs: column.boolean({ optional: false, default: false }),
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

const Market = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    name: column.text({ optional: false }),
    address: column.text({ optional: false }),
    long: column.number({ optional: false }),
    lat: column.number({ optional: false }),
  },
});

const Products = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    marketId: column.text({ optional: false, references: () => Market.columns.id }),
    price: column.number({ optional: false }),
    description: column.text({ optional: false }),
  },
});

export default defineDb({
  tables: {
    User,
    Session,
    EmailVerification,
    Market,
    Products,
    ContactFormLog,
    Role,
  },
});
