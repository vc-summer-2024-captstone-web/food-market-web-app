import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config

const ExampleTable = defineTable({
  columns: {
    Id: column.number({
      optional: false,
      primaryKey: true
    }),
    ItemName: column.text()
  }
});

export default defineDb({
  tables: {
    ExampleTable
  },
});
