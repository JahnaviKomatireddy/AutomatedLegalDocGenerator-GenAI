// sendgrid-test.js
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config(); // Load variables from .env

// Log to confirm env values (you can remove this later)
console.log('🔍 SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);
console.log('📧 EMAIL_FROM:', process.env.EMAIL_FROM);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'yourpersonalemail@example.com', // your own email (not sender)
  from: process.env.EMAIL_FROM,       // must be verified sender
  subject: '✅ SendGrid Test Email',
  html: `<h3>This is a test email from AI Support Chatbot 🚀</h3>`,
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Test email sent successfully!');
  })
  .catch((error) => {
    console.error('Failed to send test email:', error.response?.body || error);
  });
