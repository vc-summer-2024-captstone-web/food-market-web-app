import type { APIContext } from 'astro';
import { db, eq, User } from 'astro:db';
import { Scrypt } from 'lucia';
import { lucia } from '@libs/auth.ts';

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return new Response('Missing required fields', { status: 400 });
  }

  if (typeof email !== 'string') {
    return new Response('Invalid email format', { status: 400 });
  }

  if (typeof password !== 'string') {
    return new Response('Invalid password format', { status: 400 });
  }

  const user = await db
    .select()
    .from(User)
    .where(eq(User.email, email))
    .then((res) => {
      return res[0];
    });

  if (!user) {
    return new Response('Invalid email or password', { status: 401 });
  }

  const validPassword = await new Scrypt().verify(user.password, password);
  if (!validPassword) {
    return new Response('Invalid email or password', { status: 401 });
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return context.redirect('/');
}
