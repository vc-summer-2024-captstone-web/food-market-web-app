import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config

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

const Market = defineTable({
  columns: {
    Id: column.number({optional: false, unique: true}),
    Name: column.text({optional: false}),
    Location: column.json({}) //TODO: See if there is another way to add this that is not an untyped json code
  
  }
})

const Products = defineTable({
  columns: { 
    Id: column.number({optional: false, unique: true}),
    MarketID: column.number({optional: false, references: () => Market.columns.Id}),
    Price: column.number({optional: false}),
    Description: column.text({optional: false})
  }
})

export default defineDb({
  tables: {
    User,
    Session,
    EmailVerification,
    Market,
    Products
  },
});
