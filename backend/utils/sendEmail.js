console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS
    ? process.env.EMAIL_PASS.substring(0, 8) + "..."
    : "Missing"
);


const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendEmail(to, subject, html) {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    sendSmtpEmail.sender = {
      name: "Veran Enterprise",
      email: "koskeybaphin1@gmail.com",
    };

    sendSmtpEmail.to = [
      {
        email: to,
      },
    ];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent:", result.body);

    return result.body;

  } catch (err) {
    console.error("❌ Brevo Email Error:", err.response?.body || err.message);
    throw err;
  }
}

module.exports = sendEmail;


// resend 
// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async (to, subject, html) => {
//   try {
//     const response = await resend.emails.send({
//       from: "Veran Enterprise <onboarding@resend.dev>",
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ Email sent:", response);

//     return response;
//   } catch (err) {
//     console.error("❌ Email Error:", err);

//     throw err;
//   }
// };

// module.exports = sendEmail;



// const transporter = require("../config/mail");

// const sendEmail = async (to, subject, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Veran Enterprise" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ Email sent:", info.response);

//     return info;
//   } catch (err) {
//     console.error("❌ Email Error:", err);

//     throw err;
//   }
// };

// module.exports = sendEmail;


// const nodemailer = require("nodemailer");