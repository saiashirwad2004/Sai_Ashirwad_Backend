const { getTransporter } = require('../config/email');

const sendEmail = async ({ to, subject, html, type = 'info' }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('Email not sent because transporter is not configured.');
    return;
  }

  let fromEmail = 'info@saiashirwad.online';
  if (type === 'auth') fromEmail = 'auth@saiashirwad.online';
  else if (type === 'newsletter') fromEmail = 'newsletter@saiashirwad.online';

  // Make sure we format the from string to look nice
  const from = `"Sai Ashirwad" <${fromEmail}>`;

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent successfully to ${to} (from ${fromEmail})`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

/**
 * HTML Email Templates
 */
const templates = (() => {
  const logoHeader = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://saiashirwad.online/logo.png" alt="Sai Ashirwad Logo" style="width: 50px; height: 50px; object-fit: contain; border-radius: 12px;" />
    </div>
  `;

  return {
    getContactTemplate: (name, email, message) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        ${logoHeader}
        <h2 style="color: #3b82f6;">New Contact Message Received</h2>
        <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 15px;">
          <p style="margin: 0; line-height: 1.5;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
      </div>
    `,

    getAutoReplyTemplate: (name) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        ${logoHeader}
        <h2 style="color: #3b82f6;">Thank you for reaching out, ${name}!</h2>
        <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
          We have received your message and will get back to you as soon as possible.
        </p>
        <p style="color: #4b5563; font-size: 16px;">
          Best Regards,<br />
          <strong>Sai Ashirwad Team</strong>
        </p>
      </div>
    `,

    getInviteTemplate: (inviteUrl) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 10px;">
        ${logoHeader}
        <h2 style="color: #3b82f6;">You've been invited to Sai Ashirwad Admin Panel!</h2>
        <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
          You have been invited to join the Sai Ashirwad dashboard. Please set up your password to activate your account.
        </p>
        <a href="${inviteUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0;">
          Accept Invitation & Set Password
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
          This link is valid for 24 hours. If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `,

    getForgotPasswordTemplate: (resetUrl) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 10px;">
        ${logoHeader}
        <h2 style="color: #3b82f6;">Password Reset Request</h2>
        <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
    
    getNewsletterConfirmationTemplate: () => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 10px;">
        ${logoHeader}
        <h2 style="color: #3b82f6;">Welcome to the Sai Ashirwad Newsletter!</h2>
        <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
          Thank you for subscribing! You'll now receive updates about our newest blog posts, projects, and insights.
        </p>
      </div>
    `,
    
    getNewBlogPostTemplate: (title, url) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 10px;">
        ${logoHeader}
        <h2 style="color: #3b82f6;">New Post: ${title}</h2>
        <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
          We just published a new article on our blog!
        </p>
        <a href="${url}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0;">
          Read the Article
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
          You're receiving this because you subscribed to the Sai Ashirwad newsletter.
        </p>
      </div>
    `,
  };
})();

module.exports = { sendEmail, templates };
