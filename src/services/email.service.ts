import { isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { db, EmailVerification, eq } from 'astro:db';
import sgMail from '@sendgrid/mail';
import Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const { DEV, TOKEN_LENGTH, VITE_APP_NAME, SENDGRID_API_KEY, SMTP_EMAIL } = import.meta.env;

export async function sendVerifyEmail({ email, name, token }: { email: string; name: string; token: string }) {
  const templatePath = resolve('src/_email-templates/verify-email.hbs');
  const templateSource = await readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);

  const html = template({ name: name, token, appName: VITE_APP_NAME });

  const emailContent: EmailContent = {
    to: email,
    from: SMTP_EMAIL,
    subject: 'Verify your email address',
    text: stripHTML(html),
    html,
  };

  return sendEmail(emailContent);
}

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

async function sendEmail(emailContent: EmailContent): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    if (DEV) {
      const nodemailer = await import('nodemailer');
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = import.meta.env;

      const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
      return transport.sendMail(emailContent, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info);
        }
      });
    }
    sgMail.setApiKey(SENDGRID_API_KEY);
    sgMail
      .send(emailContent)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

interface EmailContent {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}
function stripHTML(html: string) {
  return html.replace(/<|>/g, '');
}
