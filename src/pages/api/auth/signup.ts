import type { APIContext } from 'astro';
import { db, EmailVerification, eq, User } from 'astro:db';
import { generateId, Scrypt } from 'lucia';
import { lucia, generateVerificationCode, sendVerifyEmail } from '@services';
import { createDate, TimeSpan } from 'oslo';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const { VERIFICATION_TOKEN_TTL, VERIFICATION_TOKEN_TTL_UNIT } = import.meta.env;

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm');

  if (!name || !email || !password || !confirmPassword) {
    return new Response('Missing required fields', { status: 400 });
  }

  if (password !== confirmPassword) {
    return new Response('Passwords do not match', { status: 400 });
  }

  if (typeof password !== 'string' || !passwordRegex.test(password)) {
    return new Response('Password must be at least 8 characters long and include at least one letter and one number', {
      status: 400,
    });
  }

  if (typeof email !== 'string' || !emailRegex.test(email)) {
    return new Response('Invalid email format', { status: 400 });
  }

  if (typeof name !== 'string' || name.length < 1) {
    return new Response('Name must be at least 2 characters long', { status: 400 });
  }

  const existingUser = await db
    .select()
    .from(User)
    .where(eq(User.email, email))
    .then((res) => {
      return !!res.length;
    });

  if (existingUser) {
    return new Response('User Already Exists');
  }
  const hashPass = await new Scrypt().hash(password);
  const userId = generateId(15);

  try {
    await db.insert(User).values({
      id: userId,
      email: email.toLowerCase().trim(),
      name: name,
      password: hashPass,
      verified: false,
    });
    await handleVerification({ userId, email, name });
  } catch (e) {
    console.error(e);
    return new Response('Error sending verification email', { status: 500 });
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return context.redirect('/');
}
