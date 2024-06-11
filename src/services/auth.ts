import { Lucia, TimeSpan } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db, Session, User } from 'astro:db';
const adapter = new DrizzleSQLiteAdapter(db as any, Session, User);

const { PROD, TIME_TO_LIVE, TIME_TO_LIVE_UNIT, SESSION_SAME_SITE, SESSION_DOMAIN } = import.meta.env;
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: PROD, // set to `true` when using HTTPS
      sameSite: SESSION_SAME_SITE,
      domain: SESSION_DOMAIN,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      email: attributes.email,
    };
  },
  sessionExpiresIn: new TimeSpan(TIME_TO_LIVE, TIME_TO_LIVE_UNIT),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
interface DatabaseUserAttributes {
  email: string;
}
