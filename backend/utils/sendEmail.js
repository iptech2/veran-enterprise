
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {


  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "Loaded" : "Missing"
);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST be Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
throw error;
  }
};

module.exports = sendEmail;