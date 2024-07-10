import { isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { db, EmailVerification, eq } from 'astro:db';

const { TOKEN_LENGTH } = import.meta.env;

export async function generateVerificationCode(userId: string) {
  const existingToken = await db
    .select()
    .from(EmailVerification)
    .where(eq(EmailVerification.userId, userId))
    .then((result) => {
      return result[0];
    });
  if (existingToken && existingToken.token) {
    const expirationDate = new Date(existingToken.expiresAt);
    if (isWithinExpirationDate(expirationDate)) {
      return existingToken.token;
    }
  }
  return generateRandomString(TOKEN_LENGTH, alphabet('0-9', 'a-z', 'A-Z')) ?? null;
}
