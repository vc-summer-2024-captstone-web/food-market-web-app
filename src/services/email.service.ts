import sgMail from '@sendgrid/mail';
import Handlebars from 'handlebars';
import { VerifyEmail } from '@email-templates';

const { DEV, VITE_APP_NAME, SENDGRID_API_KEY, SMTP_EMAIL } = import.meta.env;

// Convert the file URL to a file path

export async function sendVerifyEmail({ email, name, token }: { email: string; name: string; token: string }) {
  const template = Handlebars.compile(VerifyEmail);

  const html = template({ name: name, token, appName: VITE_APP_NAME });

  const emailContent: EmailContent = {
    to: email,
    from: SMTP_EMAIL,
    subject: 'Verify your email address',
    text: stripHTML(html),
    html,
  };
  if (process.env.TEST) {
    console.log(emailContent);
    return;
  }
  return sendEmail(emailContent);
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
  return html.replace(/[<>]/g, '');
}
