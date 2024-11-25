import 'dotenv/config';
import { SendMailOptions } from 'nodemailer';
import { emailTransporter } from '../middleware/email.middleware';

export class EmailSender {
  private static instance: EmailSender;

  public static getInstance(): EmailSender {
    if (!EmailSender.instance) {
      EmailSender.instance = new EmailSender();
    }
    return EmailSender.instance;
  }

  async sendEmail(to: string, subject: string, text: string, html: string, from?: string): Promise<boolean> {
    try {
      const defaultFrom = `"Todo App" <support@${process.env.EMAIL_DOMAIN}>`;
      const mailOptions: SendMailOptions = {
        from: from || process.env.SMTP_FROM || defaultFrom,
        to,
        subject,
        text,
        html,
      };

      const info = await emailTransporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}