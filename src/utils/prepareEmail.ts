interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
  from: string;
}

const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || 'cloudtechnosoftsolutions.in';

export const prepareEmail = {
  welcomeEmail: (username: string): EmailTemplate => ({
    from: `welcome@${EMAIL_DOMAIN}`,
    subject: 'Welcome to Todo App!',
    text: `Hi ${username}, Welcome to our Todo App! Your registration was successful.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Todo App!</h2>
        <p>Hi ${username},</p>
        <p>Thank you for registering with our Todo App. Your account has been successfully created.</p>
        <p>You can now start using our application to manage your tasks efficiently.</p>
        <p>Best regards,<br>Todo App Team</p>
      </div>
    `
  }),

  verificationEmail: (username: string, verificationLink: string): EmailTemplate => ({
    from: `verify@${EMAIL_DOMAIN}`,
    subject: 'Verify Your Email Address',
    text: `Hi ${username}, Please verify your email by clicking: ${verificationLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Hi ${username},</p>
        <p>Please click the link below to verify your email address:</p>
        <p>
          <a href="${verificationLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link: ${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `
  })
};