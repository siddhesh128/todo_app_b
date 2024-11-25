import nodemailer, { Transporter } from 'nodemailer';

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailTransporter {
  private static instance: Transporter;

  private static createConfig(): SMTPConfig {
    return {
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER ?? '',
     
           pass: process.env.SMTP_PASS ?? '',
      },
    };
  }


  public static getInstance(): Transporter {
    if (!EmailTransporter.instance) {
      const config = this.createConfig();
      EmailTransporter.instance = nodemailer.createTransport(config);
    }
    return EmailTransporter.instance;
  }
}

export const emailTransporter = EmailTransporter.getInstance();
