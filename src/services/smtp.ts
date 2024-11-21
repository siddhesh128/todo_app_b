import 'dotenv/config';
import nodemailer, {  Transporter, SendMailOptions } from 'nodemailer';
interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

import dotenv from 'dotenv';
dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
  },
} as SMTPConfig);

// Setup email data
const mailOptions: SendMailOptions = {
	from: '"Sid" <MS_ymNWTZ@trial-pr9084z7p5egw63d.mlsender.net>', 
	to: 'siddheshj039@gmail.com',
	subject: 'Welcome! Your free trial is ready.', 
	text: 'Hey there!',
	html: `
    <p>Hey there!</p>
    <p>Welcome to Our todo app!</p>
   
  `, 
};

// Send email
transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo) => {
	if (error) {
		return console.log(error);
	}
	console.log('Message sent: %s', info.messageId);
});
