import type { APIContext } from 'astro';
import { lucia } from '@services';
import { response } from '@utilities';

export async function POST(context: APIContext) {
  if (!context.locals.session) {
    return response(null, 401);
  }
  await lucia.invalidateSession(context.locals.session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return context.redirect('/');
}
