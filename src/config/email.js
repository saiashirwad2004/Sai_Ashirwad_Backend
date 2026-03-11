const nodemailer = require('nodemailer');

let transporter;

const createTransporter = () => {
  // Check if SMTP is configured
  if (
    !process.env.SMTP_USER ||
    process.env.SMTP_USER === 'your_email@gmail.com'
  ) {
    console.log('⚠️  Email (SMTP) not configured — email features will be disabled');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify connection
  transporter.verify((error) => {
    if (error) {
      console.log('⚠️  Email transporter verification failed:', error.message);
    } else {
      console.log('✅ Email transporter ready');
    }
  });

  return transporter;
};

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

module.exports = { getTransporter, createTransporter };
