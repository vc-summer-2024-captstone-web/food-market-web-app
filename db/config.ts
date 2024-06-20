import { column, defineDb, defineTable } from 'astro:db';

const ExampleTable = defineTable({
  columns:{
    Id: column.number({
      optional: false,
    }),
    ItemName: column.text()
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    ExampleTable
  },
});
