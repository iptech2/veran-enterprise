// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   family: 4, // Force IPv4 (fixes ENETUNREACH on Render)

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },

//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// module.exports = transporter;






// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   family: 4, // Force IPv4 (helps on Render)

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((error) => {
//   if (error) {
//     console.log("❌ Mail Server Error:", error);
//   } else {
//     console.log("✅ Mail Server Ready");
//   }
// });

// module.exports = transporter;

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((err) => {
//   if (err) {
//     console.error("❌ Mail server error:", err);
//   } else {
//     console.log("✅ Gmail SMTP Ready");
//   }
// });

// module.exports = transporter;


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
});

transporter.verify((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("✅ Gmail Ready");
  }
});