import type { APIContext } from 'astro';
import { db, EmailLog } from 'astro:db';

import { encryptBody } from '@services';

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const message = formData.get('message') as string;
  const encryptedMessage = encryptBody(message);

  try {
    await db.insert(EmailLog).values({
      body: encryptedMessage,
    });
    return new Response(JSON.stringify({ message: '' }), { status: 200 });
  } catch (error: unknown) {
    const err = error as unknown as Error;
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
