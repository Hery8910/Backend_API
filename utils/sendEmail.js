const nodemailer = require('nodemailer');

const {
  EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT,
  NOREPLY_EMAIL_USER,
  NOREPLY_EMAIL_PASSWORD,
  INFO_EMAIL_USER,
  INFO_EMAIL_PASSWORD,
  CONTACT_EMAIL_USER,
  CONTACT_EMAIL_PASSWORD
} = process.env

const EMAIL_CONFIG = {
  noreply: {
    host: EMAIL_SERVER_HOST,
    port: parseInt(EMAIL_SERVER_PORT, 10),
    secure: EMAIL_SERVER_PORT === 465, 
    auth: {
      user: NOREPLY_EMAIL_USER,
      pass: NOREPLY_EMAIL_PASSWORD,
    },
    from: `No Reply <noreply@havenova.de>`,
  },
  info: {
    host: EMAIL_SERVER_HOST,
    port: parseInt(EMAIL_SERVER_PORT, 10),
    secure: EMAIL_SERVER_PORT === 465,
    auth: {
      user: INFO_EMAIL_USER,
      pass: INFO_EMAIL_PASSWORD,
    },
    from: `Info <info@havenova.de>`,
  },
  contact: {
    host: EMAIL_SERVER_HOST,
    port: parseInt(EMAIL_SERVER_PORT, 10),
    secure: EMAIL_SERVER_PORT === 465,
    auth: {
      user: CONTACT_EMAIL_USER,
      pass: CONTACT_EMAIL_PASSWORD,
    },
    from: `Contact <contact@havenova.de>`,
  },
};

const sendEmail = async ({ email, subject, html, fromAccount = 'noreply' }) => {
  try {
    const config = EMAIL_CONFIG[fromAccount];
    if (!config) {
      throw new Error(`The email account "${fromAccount}" is not configured`);
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    const mailOptions = {
      from: config.from,
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully from ${fromAccount}`);
  } catch (error) {
    console.error(`Error sending email from ${fromAccount}:`, error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
