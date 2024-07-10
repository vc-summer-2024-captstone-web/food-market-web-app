import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';

const { SECRET_KEY } = import.meta.env;

/**
 * Create an encrypted string that contains JSON Object data
 * @param body Stringified JSON Object.
*/
export const encryptBody = (body: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(
    'aes-256-cbc',
    Buffer.from(SECRET_KEY),
    iv
  );
  let encrypted = cipher.update(body);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}


/**
 * Decrypt and parse data
 * @param encryptedBody
 */
export const decipherBody =  (encryptedBody: string): string => {
  try {
    const bodyArr = encryptedBody.split(':');
    const ivString = bodyArr.shift();
    const encryptedTextString = bodyArr.shift();

    if (typeof ivString !== 'string' || typeof encryptedTextString !== 'string') {
      throw new Error('Invalid input: expected strings');
    }

    const iv = Buffer.from(ivString, 'hex');
    const encryptedText = Buffer.from(encryptedTextString, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
      return JSON.parse(decrypted.toString());
  } catch (error) {
    const err = error as unknown as Error
    console.error(err);
    throw new Error(err.message);
  }
}