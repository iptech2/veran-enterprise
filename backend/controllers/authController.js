const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const createNotification = require("../utils/createNotification");

/* =========================
   GENERATE REFERRAL CODE
========================= */
const generateReferralCode = () => {
  return (
    "VERAN" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
};

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      referralCode,
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Optional referral
    let referrer = null;

    if (referralCode) {
      referrer = await User.findOne({
        referralCode,
      });

      if (!referrer) {
        return res.status(400).json({
          message: "Invalid referral code",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    // Generate unique referral code
    let myReferralCode;
    let existsCode = true;

    while (existsCode) {
      myReferralCode = generateReferralCode();

      existsCode = await User.findOne({
        referralCode: myReferralCode,
      });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,

      referralCode: myReferralCode,
      referredBy: referrer ? referrer._id : null,

      emailVerificationToken: token,
      isVerified: false,
    });
    
    await createNotification(
  user._id,
  "Welcome to Veran Enterprise",
  "Your account has been created successfully. Please verify your email.",
  "system"
);

    const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

sendEmail(
  email,
  "Verify Your Account",
  `
  <div style="font-family:Arial;padding:20px">

    <h2>Welcome to Veran Enterprise</h2>

    <p>Please verify your email to activate your account.</p>

    <a
      href="${verifyLink}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#198754;
        color:white;
        text-decoration:none;
        border-radius:5px;
      "
    >
      Verify Email
    </a>

  </div>
  `
).catch((err) => {
  console.error("Verification email failed:", err.message);
});
    return res.status(201).json({
      success: true,
      message: "Registration successful. Check your email.",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   VERIFY EMAIL
========================= */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }

    if (user.isVerified) {
      return res.json({
        success: true,
        message: "Email already verified",
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = null;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "Email or phone and password required",
      });
    }

    const user = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null,
      ].filter(Boolean),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        isVerified: user.isVerified,
        referralCode: user.referralCode,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000;

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // await sendEmail(
    //   email,
    //   "Password Reset",
    //   `
    //   <h2>Password Reset Request</h2>

    //   <a href="${resetLink}">
    //     Reset Password
    //   </a>
    //   `
    // );
sendEmail(
  email,
  "Password Reset",
  `
  <div style="font-family:Arial;padding:20px">

    <h2>Password Reset</h2>

    <p>Click the button below to reset your password.</p>

    <a
      href="${resetLink}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#0d6efd;
        color:white;
        text-decoration:none;
        border-radius:5px;
      "
    >
      Reset Password
    </a>

  </div>
  `
).catch((err) => {
  console.error("Password reset email failed:", err.message);
});
    return res.json({
      message: "Password reset email sent",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    if (user.passwordResetExpires < Date.now()) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    return res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
