import { isWithinExpirationDate, createDate, TimeSpan } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { db, EmailVerification, eq } from 'astro:db';
import { sendVerifyEmail } from '@services';

const { TOKEN_LENGTH, VERIFICATION_TOKEN_TTL, VERIFICATION_TOKEN_TTL_UNIT } = import.meta.env;

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

export async function handleVerification({ userId, email, name }: { userId: string; email: string; name: string }) {
  const token = await generateVerificationCode(userId);
  await db
    .insert(EmailVerification)
    .values({
      userId,
      token,
      expiresAt: new Date(createDate(new TimeSpan(VERIFICATION_TOKEN_TTL, VERIFICATION_TOKEN_TTL_UNIT))).valueOf(),
    })
    .then(() => {
      return;
    });
  return sendVerifyEmail({ email, name, token });
}
