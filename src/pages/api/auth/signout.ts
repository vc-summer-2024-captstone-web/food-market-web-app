import {lucia} from "@libs/auth.ts";
import type { APIContext } from 'astro';

export async function POST(context: APIContext) {
  if (!context.locals.session) {
    return new Response(null, { status: 401 });
  }
  await lucia.invalidateSession(context.locals.session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
  return context.redirect("/");
}
