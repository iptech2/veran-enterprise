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
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // Port 587 uses STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ Mail server error:", err);
  } else {
    console.log("✅ Brevo SMTP Ready");
  }
});

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email Error:", err);
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