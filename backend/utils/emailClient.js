const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    text,
    html,
  };

  await sendgrid.send(msg);
};

module.exports = { sendEmail };