import type { APIContext } from 'astro';
import { db, eq, User } from 'astro:db';
import { Scrypt } from 'lucia';
import { lucia } from '@services';
import { response } from '@utilities';

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return response({ message: 'Missing required fields' }, 400);
  }

  if (typeof email !== 'string') {
    return response({ message: 'Invalid email format' }, 400);
  }

  if (typeof password !== 'string') {
    return response({ message: 'Invalid password format' }, 400);
  }

  const user = await db
    .select()
    .from(User)
    .where(eq(User.email, email))
    .then((res) => {
      return res[0];
    });

  if (!user) {
    return response({ message: 'Invalid email or password' }, 401);
  }

  const validPassword = await new Scrypt().verify(user.password, password);
  if (!validPassword) {
    return response({ message: 'Invalid email or password' }, 401);
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return context.redirect('/');
}
