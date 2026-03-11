const { getTransporter } = require('../config/email');

/**
 * Send an email using Nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} [options.text] - Plain text fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log('⚠️  Email not sent (SMTP not configured):', { to, subject });
    // In development, log the email content for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email content preview:');
      console.log('   To:', to);
      console.log('   Subject:', subject);
      console.log('   Body:', text || html);
    }
    return { success: true, preview: true };
  }

  const mailOptions = {
    from: `"AnandVerse" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Email sent:', info.messageId);
  return { success: true, messageId: info.messageId };
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0e1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background: #111827; border-radius: 16px; padding: 40px; border: 1px solid #1e293b; }
        .logo { font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #60a5fa, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        h1 { color: #f8fafc; font-size: 24px; margin: 24px 0 16px; }
        p { color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 24px 0; }
        .url { color: #60a5fa; word-break: break-all; font-size: 14px; }
        .footer { text-align: center; margin-top: 32px; color: #475569; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo">AnandVerse</div>
          <h1>Password Reset Request</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>You requested a password reset for your AnandVerse account. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p class="url">${resetUrl}</p>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn't request this reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AnandVerse. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset — AnandVerse',
    html,
  });
};

/**
 * Send welcome email after admin setup
 */
const sendWelcomeEmail = async (email, userName) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0e1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background: #111827; border-radius: 16px; padding: 40px; border: 1px solid #1e293b; }
        .logo { font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #60a5fa, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        h1 { color: #f8fafc; font-size: 24px; margin: 24px 0 16px; }
        p { color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 24px 0; }
        .footer { text-align: center; margin-top: 32px; color: #475569; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo">AnandVerse</div>
          <h1>🎉 Welcome, ${userName}!</h1>
          <p>Your admin account has been created successfully. You're all set to manage your AnandVerse portfolio!</p>
          <a href="${loginUrl}" class="btn">Go to Dashboard</a>
          <p>If you have any issues, check your server logs or reach out for help.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AnandVerse. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to AnandVerse! 🚀',
    html,
  });
};

module.exports = { sendEmail, sendPasswordResetEmail, sendWelcomeEmail };
