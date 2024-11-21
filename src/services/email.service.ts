import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

type EmailProvider = 'AZURE' | 'GOOGLE';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: any;
}

class EmailService {
  private transporter;
  private provider: EmailProvider;

  constructor() {
    this.provider = this.initializeProvider();
    this.validateEnvironmentVariables();
    const config = this.getEmailConfig();
    this.transporter = nodemailer.createTransport(config);
  }

  private initializeProvider(): EmailProvider {
    const provider = process.env.EMAIL_PROVIDER?.toUpperCase();
    if (!provider || !['AZURE', 'GOOGLE'].includes(provider)) {
      throw new Error('Invalid or missing EMAIL_PROVIDER in environment variables. Must be either "AZURE" or "GOOGLE"');
    }
    return provider as EmailProvider;
  }

  private validateEnvironmentVariables() {
    const requiredVars = this.getRequiredEnvVars();
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  private getRequiredEnvVars(): string[] {
    const commonVars = ['EMAIL_USER', 'EMAIL_FROM_NAME'];
    
    const providerVars = {
      'AZURE': [
        'AZURE_CLIENT_ID',
        'AZURE_CLIENT_SECRET',
        'AZURE_TENANT_ID',
        'AZURE_REFRESH_TOKEN'
      ],
      'GOOGLE': [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_REFRESH_TOKEN'
      ]
    };

    return [...commonVars, ...providerVars[this.provider]];
  }

  private getEmailConfig(): EmailConfig {
    const baseConfig = {
      host: this.provider === 'AZURE' ? 'smtp.office365.com' : 'smtp.gmail.com',
      port: 587,
      secure: false,
      tls: {
        ciphers: 'SSLv3'  // Add this for Azure
      }
    };

    const authConfig = this.getAuthConfig();
    
    return {
      ...baseConfig,
      auth: authConfig,
    };
  }

  private getAuthConfig() {
    if (this.provider === 'AZURE') {
      return {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        tenantId: process.env.AZURE_TENANT_ID,
        refreshToken: process.env.AZURE_REFRESH_TOKEN,
        accessToken: null,
        expires: null,
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        scope: 'https://outlook.office365.com/SMTP.Send offline_access'
      };
    } else {
      return {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      };
    }
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

export default EmailService;