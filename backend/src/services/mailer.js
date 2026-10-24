const axios = require('axios');
const nodemailer = require('nodemailer');
const {
  smtpHost,
  smtpPort,
  smtpUser,
  smtpPass,
  mailFrom,
  frontendUrl,
  brevoApiKey,
} = require('../config/env');

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  // Port 465 is implicit TLS; everything else (587, MailHog's 1025, ...) starts plain and
  // upgrades via STARTTLS, which nodemailer handles on its own when secure is false.
  secure: smtpPort === 465,
  auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// "Name <address>" -> { name, email } as the Brevo API expects it.
function parseSender(from) {
  const match = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(from);
  return match ? { name: match[1] || undefined, email: match[2] } : { email: from.trim() };
}

async function deliver({ to, subject, text, html }) {
  if (brevoApiKey) {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: parseSender(mailFrom),
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      },
      { headers: { 'api-key': brevoApiKey }, timeout: 15000 },
    );
    return;
  }
  await transporter.sendMail({ from: mailFrom, to, subject, text, html });
}

async function sendConfirmationEmail(email, token) {
  const confirmUrl = `${frontendUrl.replace(/\/$/, '')}/confirm/${token}`;

  await deliver({
    to: email,
    subject: 'Confirm your account',
    text: `Confirm your account by visiting: ${confirmUrl}`,
    html: `
      <p>Welcome! Confirm your account to start building your dashboard.</p>
      <p><a href="${confirmUrl}">Confirm my account</a></p>
      <p>Or copy this link: ${confirmUrl}</p>
    `,
  });
}

module.exports = { sendConfirmationEmail };
