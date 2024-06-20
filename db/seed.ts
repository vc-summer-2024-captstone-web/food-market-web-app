import { db, ExampleTable } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
  // TODO
  await db.insert(ExampleTable).values({
    Id: 1,
    ItemName: 'Burger'
  })
}
