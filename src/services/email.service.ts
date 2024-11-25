import 'dotenv/config';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailSender {
  private transporter: Transporter;
  private static instance: EmailSender;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER ?? '',
        pass: process.env.SMTP_PASS ?? '',
      },
    } as SMTPConfig);
  }

  public static getInstance(): EmailSender {
    if (!EmailSender.instance) {
      EmailSender.instance = new EmailSender();
    }
    return EmailSender.instance;
  }

  async sendEmail(to: string, subject: string, text: string, html: string, from?: string): Promise<boolean> {
    try {
      const defaultFrom = `"Todo App" <support@${process.env.EMAIL_DOMAIN }>`;
      const mailOptions: SendMailOptions = {
        from: from || process.env.SMTP_FROM || defaultFrom,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}