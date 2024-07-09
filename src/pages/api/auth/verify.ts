import type { APIContext } from 'astro';
import { db, eq, EmailVerification, User, and } from 'astro:db';
import { generateVerificationCode, sendVerifyEmail } from '@services';
import { createDate, TimeSpan } from 'oslo';

export async function POST(context: APIContext) {
  return new Response(null, {
    status: 405,
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function PUT(context: APIContext) {
  const user = context.locals.user;
  if (!user) {
    return new Response(null, { status: 401 });
  }
  const existingToken = await db.select().from(EmailVerification).where(eq(EmailVerification.userId, user.id));

  let { token, expiresAt } = existingToken[0] ?? { token: null, expiresAt: null };

  if (!token || (expiresAt && new Date().valueOf() > expiresAt)) {
    await db
      .delete(EmailVerification)
      .where(and(eq(EmailVerification.userId, user.id), eq(EmailVerification.token, token)));
    token = await generateVerificationCode(user.id);
    await db.insert(EmailVerification).values({
      userId: user.id,
      token: token,
      expiresAt: new Date(createDate(new TimeSpan(1, 's'))).valueOf(),
    });
  }
  await sendVerifyEmail({
    email: user.email,
    name: user.name,
    token,
  });
  return new Response(
    JSON.stringify({
      message: 'Verification email sent',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/json',
      },
    }
  );
}
