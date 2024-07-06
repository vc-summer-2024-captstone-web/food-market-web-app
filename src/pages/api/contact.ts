import type { APIContext } from 'astro';
import { db, eq, EmailLog } from 'astro:db';

import { encryptBody } from '../../../db/config';



export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const message = formData.get('message') as string;
  const encryptedMessage = encryptBody(message);

  try {
    await db.insert(EmailLog).values({
      body: encryptedMessage
    })
    return new Response(JSON.stringify({message: ''}), { status: 200 });
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};