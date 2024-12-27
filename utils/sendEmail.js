const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const EMAIL_CONFIG = {
  noreply: {
    from: `No Reply <noreply@havenova.de>`,
  },
  info: {
    from: `Info <info@havenova.de>`,
  },
  contact: {
    from: `Contact <contact@havenova.de>`,
  },
};

const sendEmail = async ({ email, subject, html, fromAccount = 'noreply' }) => {
  try {
    const config = EMAIL_CONFIG[fromAccount];
    if (!config) {
      throw new Error(`The email account "${fromAccount}" is not configured`);
    }

    const msg = {
      to: email, 
      from: config.from, 
      subject: subject, 
      html: html, 
    };

    
    await sgMail.send(msg);
    console.log(`Email sent successfully from ${fromAccount}`);
  } catch (error) {
    console.error(`Error sending email from ${fromAccount}:`, error.response ? error.response.body : error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
