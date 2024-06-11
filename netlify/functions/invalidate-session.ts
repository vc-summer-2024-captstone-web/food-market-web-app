import { lucia } from '@services'
export default async () => {
  await lucia.deleteExpiredSessions();
}
