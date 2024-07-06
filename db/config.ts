import { defineDb, defineTable, column, } from 'astro:db';
import { createId } from '@paralleldrive/cuid2'
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { Buffer } from 'buffer'

// model EmailLog {
//   id String @id @default(uuid())
//   body String @unique
//   created At DateTime @default(now())
// }
const EmailLog = defineTable({
  columns: {
    Id: column.text({optional: false, primaryKey: true, default: createId() }),
    body: column.text(),
    created: column.date({default: new Date()})
  }
})


export default defineDb({
  tables: {
    EmailLog
  },
});

export const encryptBody = (body: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from( process.env.SECRET_KEY || '____this_is_a_top_secret_key____'), iv);
  let encrypted = cipher.update(body);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString();
};

