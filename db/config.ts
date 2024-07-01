import { defineDb } from 'astro:db';

// https://astro.build/db/config

const ExampleTable = defineTable({
    columns: {
      ID: columnNumber({
        optional: false,

      
      }),
      ItemName: column.text()
    }
})

export default defineDb({
  tables: {
    ExampleTable
  },
});
