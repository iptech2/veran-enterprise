
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
   PHONE NUMBER SEARCH VARIANTS
   SUPPORTS KENYAN FORMATS
========================= */
const getPhoneSearchVariants = (input) => {
  let digits = String(input || "").replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  const variants = new Set();

  if (!digits) return [];

  variants.add(digits);
  variants.add(`+${digits}`);

  // 0712345678
  if (digits.startsWith("0") && digits.length === 10) {
    const nationalNumber = digits.slice(1);

    variants.add(nationalNumber);
    variants.add(`254${nationalNumber}`);
    variants.add(`+254${nationalNumber}`);
  }

  // 254712345678
  else if (digits.startsWith("254") && digits.length === 12) {
    const nationalNumber = digits.slice(3);

    variants.add(nationalNumber);
    variants.add(`0${nationalNumber}`);
    variants.add(`+254${nationalNumber}`);
  }

  // 712345678
  else if (digits.length === 9) {
    variants.add(`0${digits}`);
    variants.add(`254${digits}`);
    variants.add(`+254${digits}`);
  }

  return [...variants];
};

/* =========================
   CANONICAL PHONE NUMBER
   KENYAN NUMBERS STORED AS
   254712345678
========================= */
const normalizePhoneNumber = (input) => {
  let digits = String(input || "").replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  if (digits.length === 9) {
    return `254${digits}`;
  }

  // Preserve international numbers in normalized format.
  return digits;
};

/* =========================
   REGISTER
   EMAIL VERIFICATION DISABLED
   EMAIL AND PHONE MUST BE UNIQUE
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

    const normalizedName = String(fullName).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = normalizePhoneNumber(phone);

    if (!normalizedName) {
      return res.status(400).json({
        message: "Full name is required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const phoneVariants = getPhoneSearchVariants(phone);

    if (!phoneVariants.length || !normalizedPhone) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    /* =========================
       CHECK EMAIL UNIQUENESS
    ========================= */

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "This email address is already registered. Please use another email.",
      });
    }

    /* =========================
       CHECK PHONE UNIQUENESS
       CHECKS OLD FORMATS TOO
    ========================= */

    const existingPhone = await User.findOne({
      phone: { $in: phoneVariants },
    });

    if (existingPhone) {
      return res.status(409).json({
        message: "This phone number is already registered. Please use another number.",
      });
    }

    /* =========================
       OPTIONAL REFERRAL
    ========================= */

    let referrer = null;

    if (referralCode && String(referralCode).trim()) {
      referrer = await User.findOne({
        referralCode: String(referralCode).trim().toUpperCase(),
      });

      if (!referrer) {
        return res.status(400).json({
          message: "Invalid referral code",
        });
      }
    }

    /* =========================
       HASH PASSWORD
    ========================= */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* =========================
       GENERATE UNIQUE REFERRAL
       CODE
    ========================= */

    let myReferralCode;
    let existsCode = true;

    while (existsCode) {
      myReferralCode = generateReferralCode();

      existsCode = await User.exists({
        referralCode: myReferralCode,
      });
    }

    /* =========================
       CREATE ACCOUNT
       NO EMAIL VERIFICATION
    ========================= */

    const user = await User.create({
      fullName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,

      referralCode: myReferralCode,
      referredBy: referrer ? referrer._id : null,

      isVerified: true,
      emailVerificationToken: null,
    });

    /* =========================
       WELCOME NOTIFICATION
    ========================= */

    try {
      await createNotification(
        user._id,
        "Welcome to Veran Enterprise",
        "Your account has been created successfully. You can now log in using your phone number or email address.",
        "system"
      );
    } catch (notificationError) {
      console.error(
        "WELCOME NOTIFICATION ERROR:",
        notificationError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. You can now log in using your phone number or email address.",
    });

  } catch (error) {
    console.error("REGISTRATION ERROR:", error);

    /* =========================
       HANDLE DATABASE DUPLICATES
    ========================= */

    if (error.code === 11000) {
      const duplicateField = Object.keys(
        error.keyPattern || {}
      )[0];

      if (duplicateField === "email") {
        return res.status(409).json({
          message: "This email address is already registered.",
        });
      }

      if (duplicateField === "phone") {
        return res.status(409).json({
          message: "This phone number is already registered.",
        });
      }

      if (duplicateField === "referralCode") {
        return res.status(409).json({
          message: "Please try registering again.",
        });
      }

      return res.status(409).json({
        message: "An account with these details already exists.",
      });
    }

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
};

/* =========================
   VERIFY EMAIL
   RETAINED FOR OLD ACCOUNTS
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
    console.error("EMAIL VERIFICATION ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   LOGIN USING EMAIL OR PHONE
   PHONE NUMBER IS PRIMARY
========================= */
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        message: "Phone number or email address and password are required",
      });
    }

    let user;
    let loginIdentifier;

    // Email login
    if (email) {
      loginIdentifier = String(email).trim().toLowerCase();

      user = await User.findOne({
        email: loginIdentifier,
      }).lean();
    }

    // Phone login
    else {
      loginIdentifier = String(phone).trim();

      const phoneVariants = getPhoneSearchVariants(loginIdentifier);

      if (!phoneVariants.length) {
        return res.status(400).json({
          message: "Please enter a valid phone number",
        });
      }

      user = await User.findOne({
        phone: { $in: phoneVariants },
      }).lean();
    }

    if (!user) {
      return res.status(400).json({
        message: "Invalid phone number, email address or password",
      });
    }

    /* =========================
       CHECK PASSWORD
    ========================= */

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid phone number, email address or password",
      });
    }

    /* =========================
       CHECK ACCOUNT STATUS
    ========================= */

    if (
      user.status === "suspended" ||
      user.status === "blocked"
    ) {
      return res.status(403).json({
        message: "Your account has been suspended or blocked. Please contact support.",
      });
    }

    /* =========================
       GENERATE JWT
    ========================= */

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
      success: true,
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
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

/* =========================
   FORGOT PASSWORD
   EMAIL RESET RETAINED
========================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

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

    sendEmail(
      normalizedEmail,
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
    console.error("FORGOT PASSWORD ERROR:", error);

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

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    if (
      !user.passwordResetExpires ||
      user.passwordResetExpires < Date.now()
    ) {
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
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
