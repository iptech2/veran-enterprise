const Investment = require("../models/Investment");
const Package = require("../models/Package");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const crypto = require("crypto");

// ==============================
// CREATE INVESTMENT
// ==============================
exports.createInvestment = async (req, res) => {
  try {
    const { packageId, amount } = req.body;

    const investAmount = Number(amount);

    if (!packageId) {
      return res.status(400).json({
        message: "Please select an investment package.",
      });
    }

    if (isNaN(investAmount) || investAmount <= 0) {
      return res.status(400).json({
        message: "Invalid investment amount.",
      });
    }

    // Find package
    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        message: "Investment package not found.",
      });
    }

    // Validate package limits
    if (
      investAmount < pkg.minAmount ||
      investAmount > pkg.maxAmount
    ) {
      return res.status(400).json({
        message: `Investment amount must be between KES ${pkg.minAmount} and KES ${pkg.maxAmount}.`,
      });
    }

    // Find user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Check balance
    if (user.balance < investAmount) {
      return res.status(400).json({
        message: "Insufficient wallet balance.",
      });
    }

    const roi = Number(pkg.roi);
    const duration = Number(pkg.duration);

    if (isNaN(roi)) {
      return res.status(400).json({
        message: "Package ROI is invalid.",
      });
    }

    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({
        message: "Package duration is invalid.",
      });
    }

    // Deduct wallet
    user.balance -= investAmount;
    await user.save();

    // Calculate profit
    const profit = (investAmount * roi) / 100;

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + duration);

    // Create investment
    const investment = await Investment.create({
      user: user._id,
      package: pkg._id,
      amount: investAmount,
      roi,
      profit,
      startDate,
      endDate,
      status: "active",
    });

    // Investment transaction
    await Transaction.create({
      user: user._id,
      type: "investment",
      amount: investAmount,
      status: "completed",
      reference: crypto.randomUUID(),
      description: `Investment in ${pkg.name}`,
    });

    // ============================================
    // REFERRAL COMMISSION (5%)
    // ============================================

    // ============================================
// REFERRAL COMMISSION (FIRST INVESTMENT ONLY)
// ============================================

if (user.referredBy && !user.referralRewardPaid) {

  const referrer = await User.findById(user.referredBy);

  if (referrer) {

    const commission = investAmount * 0.05;

    // Credit referrer
    referrer.balance += commission;
    referrer.referralEarnings += commission;
    referrer.referralCount += 1;

    await referrer.save();

    // Mark reward as paid so it won't happen again
    user.referralRewardPaid = true;
    await user.save();

    // Record referral transaction
    await Transaction.create({
      user: referrer._id,
      type: "referral",
      amount: commission,
      status: "completed",
      reference: crypto.randomUUID(),
      description: `Referral bonus from ${user.fullName}'s first investment`,
    });

  }

}

    return res.status(201).json({
      success: true,
      message: "Investment created successfully.",
      investment,
      walletBalance: user.balance,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message: err.message,
    });

  }
};

// ==============================
// GET USER INVESTMENTS
// ==============================
exports.getInvestments = async (req, res) => {
  try {

    const investments = await Investment.find({
      user: req.user.id,
    })
      .populate("package")
      .sort({ createdAt: -1 });

    res.json(investments);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};
