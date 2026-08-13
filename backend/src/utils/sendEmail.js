import nodemailer from 'nodemailer';
import { logger } from './logger.js';

export const sendEmail = async ({ to, subject, html, text }) => {
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
    logger.info(`✅ OTP Email delivered successfully to ${to} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`❌ Failed to deliver OTP email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};
