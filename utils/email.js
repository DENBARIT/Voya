// ---------- previous version: nodemailer over SMTP (blocked on this network) ----------
// const nodemailer = require('nodemailer');
//
// const sendEmail = async (options) => {
//   // 1)create Transporter
//   const transporter = nodemailer.createTransport({
//     // service: 'Gmail',
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//       // Activate in gmail "less secure app" option
//     },
//   });
//   // 2)define email options
//   const mailOptions = {
//     from: 'Leul <leulethiopia@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     //html
//   };
//   // 3)actually send the email
//   await transporter.sendMail(mailOptions);
// };

// ---------- current version: Mailtrap HTTP API ----------
// SMTP ports are blocked on this network, so we send through Mailtrap's HTTP API (port 443) instead of nodemailer
const sendEmail = async (options) => {
  // 1)build the request to the Mailtrap sandbox inbox
  const url = `https://sandbox.api.mailtrap.io/api/send/${process.env.MAILTRAP_INBOX_ID}`;
  // 2)define email options
  const mailOptions = {
    from: { email: 'leulethiopia@gmail.com', name: 'Leul' },
    to: [{ email: options.email }],
    subject: options.subject,
    text: options.message,
    //html
  };
  // 3)actually send the email (fail after 10s instead of hanging)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MAILTRAP_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mailOptions),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    // here if the response is not ok,we throw an error and also we convert the response to text  which is asynchronous so we wait
    throw new Error(`Mailtrap API error ${res.status}: ${await res.text()}`);
  }
};

module.exports = sendEmail;
