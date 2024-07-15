import type { APIContext } from 'astro';
import { db, ContactFormLog } from 'astro:db';

import { encryptBody, decipherBody } from '@services';
import { response } from '@utilities';
import { createId } from '@paralleldrive/cuid2';

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const name = formData.get('name') as string;
  const message = formData.get('message') as string;
  const email = formData.get('email') as string;
  const emailBody = JSON.stringify({
    name,
    email,
    message,
  });
  const encryptedMessage = encryptBody(emailBody);

  try {
    await db.insert(ContactFormLog).values({
      Id: createId(),
      body: encryptedMessage,
      created: new Date(),
    });

    return response({ message: 'Message sent' }, 200);
  } catch (error: unknown) {
    const err = error as unknown as Error;
    console.error(err);
    return response({ error: err.message }, 500);
  }
}

export async function GET(context: APIContext): Promise<Response> {
  const messages = await db.select().from(ContactFormLog).all();
  if (messages.length === 0) {
    return response({ message: 'No messages found' }, 404);
  }
  const decryptedMessages = messages.map((message: any) => {
    const { body, created } = message;
    return { content: decipherBody(body), created };
  });
  return response(decryptedMessages, 200);
}
