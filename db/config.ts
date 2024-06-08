import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    name: column.text({ optional: false }),
    email: column.text({ optional: false, unique: true }),
    password: column.text({ optional: false }),
  }
});

const Session= defineTable({
  columns: {
    id: column.text({optional: false, unique: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    expiresAt: column.number({ optional: false }),
  }
});

export default defineDb({
  tables: {
    User,
    Session
  }
});
