import nodemailer from 'nodemailer';
import { logger } from './logger.js';

export const sendEmail = async ({ to, subject, html, text }) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      logger.info(`Attempting to send email via Resend API to ${to}...`);
      
      // Resend free tier onboarding domain requires sending from 'onboarding@resend.dev'
      // If a custom sender domain is set in env, use that, otherwise default to onboarding@resend.dev
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Interview AI <${fromEmail}>`,
          to,
          subject,
          html,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Resend API returned an error');
      }

      logger.info(`✅ OTP Email delivered successfully via Resend to ${to} (ID: ${data.id})`);
      return { success: true, messageId: data.id };
    } catch (error) {
      logger.error(`❌ Failed to deliver OTP email via Resend to ${to}:`, error.message);
      logger.info('Falling back to Nodemailer SMTP...');
    }
  }

  try {
    const emailUser = process.env.EMAIL_HOST_USER || 'anshdhulesiya@gmail.com';
    const emailPass = process.env.EMAIL_HOST_PASSWORD || process.env.EMAIL_PASS || process.env.APP_PASSWORD || 'pqxnkifhebotovgb';

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false, // Avoid SSL handshake failure issues on local networks
      },
    });

    const mailOptions = {
      from: `"Interview AI" <${emailUser}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`✅ OTP Email delivered successfully via SMTP to ${to} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`❌ Failed to deliver OTP email via SMTP to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};
