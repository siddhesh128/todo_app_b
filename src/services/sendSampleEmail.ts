import EmailService from "./email.service";

async function sendTestEmail() {
    const emailService = new EmailService();
    
    try {
        await emailService.sendEmail(
            'siddheshj0815@gmail.com',
            'Test Email',
            'This is a test email from the TODO app.',
            '<h1>Test Email</h1><p>This is a test email sent from the TODO app using HTML.</p>'
        );
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Failed to send test email:', error);
        process.exit(1); // Exit with error code
    }
}

// Execute the test
sendTestEmail();