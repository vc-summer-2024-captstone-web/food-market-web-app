import { db, eq, Role } from 'astro:db';

export async function getDefaultUserRole() {
  const userRole = await db.select().from(Role).where(eq(Role.name, 'User'));
  return userRole[0].id;
}
