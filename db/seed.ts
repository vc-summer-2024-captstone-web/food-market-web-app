import { db } from 'astro:db';
import prisma, { encryptBody } from './config';

// https://astro.build/db/seed
export default async function seed() {
  // TODO
}

async function main() {
  const emailLog = await prisma.emailLog.create({
    data: {
      body: encryptBody('Sample email body content here'),
    },
  });

  console.log({ emailLog });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });