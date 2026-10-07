const Investment = require("../models/Investment");
const Package = require("../models/Package");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const crypto = require("crypto");

// =====================================================
// CREATE INVESTMENT
// =====================================================
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

    // =====================================================
    // FIND PACKAGE
    // =====================================================

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        message: "Investment package not found.",
      });
    }

    // =====================================================
    // CHECK PACKAGE AVAILABILITY
    // =====================================================

    if (!pkg.isActive) {
      return res.status(400).json({
        message:
          "This investment package is currently unavailable.",
      });
    }

    // =====================================================
    // VALIDATE PACKAGE LIMITS
    // =====================================================

    if (
      investAmount < Number(pkg.minAmount) ||
      investAmount > Number(pkg.maxAmount)
    ) {
      return res.status(400).json({
        message: `Investment amount must be between KES ${Number(
          pkg.minAmount
        ).toLocaleString()} and KES ${Number(
          pkg.maxAmount
        ).toLocaleString()}.`,
      });
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // =====================================================
    // CHECK WALLET BALANCE
    // =====================================================

    if (
      Number(user.balance || 0) <
      investAmount
    ) {
      return res.status(400).json({
        message:
          "Insufficient wallet balance. Please deposit funds before investing.",
      });
    }

    // =====================================================
    // PACKAGE ROI / DURATION
    // =====================================================

    const roi = Number(pkg.roi);
    const duration = Number(pkg.duration);

    if (isNaN(roi) || roi < 0) {
      return res.status(400).json({
        message: "Package ROI is invalid.",
      });
    }

    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({
        message: "Package duration is invalid.",
      });
    }

    // =====================================================
    // DETERMINE INVESTMENT TYPE
    // =====================================================

    // Existing packages without investmentType are treated
    // as standard packages.
            // const investmentType =
            //   pkg.investmentType === "locked_profit"
            //     ? "locked_profit"
            //     : "standard";
                
            // const isLockedProfit =
            //   investmentType === "locked_profit";
            
      const isLockedProfit =
  pkg.investmentType === "locked_profit";

    // =====================================================
    // PROFIT WITHDRAWAL CHECKPOINTS
    // =====================================================

    let withdrawalDays = [];

    if (isLockedProfit) {
      withdrawalDays = Array.isArray(
        pkg.profitWithdrawalDays
      )
        ? pkg.profitWithdrawalDays
            .map(Number)
            .filter(
              (day) =>
                !isNaN(day) &&
                day > 0 &&
                day <= duration
            )
            .sort((a, b) => a - b)
        : [];

      // If no checkpoints were configured,
      // use the default 10 / 20 / 30 schedule.
      if (withdrawalDays.length === 0) {
        withdrawalDays = [10, 20, 30].filter(
          (day) => day <= duration
        );
      }
    }

    // =====================================================
    // CALCULATE TOTAL PROFIT
    // =====================================================

    const profit =
      (investAmount * roi) / 100;

    // Locked-profit packages earn profit daily.
    // Standard packages keep their existing maturity behavior.
    const dailyProfit = isLockedProfit
      ? profit / duration
      : 0;

    // =====================================================
    // FIRST WITHDRAWAL CHECKPOINT
    // =====================================================

    const firstWithdrawalDay =
      isLockedProfit &&
      withdrawalDays.length > 0
        ? withdrawalDays[0]
        : 0;

    // =====================================================
    // INVESTMENT DATES
    // =====================================================

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setDate(
      startDate.getDate() + duration
    );

    // =====================================================
    // DEDUCT WALLET
    // =====================================================

    user.balance =
      Number(user.balance || 0) -
      investAmount;

    // =====================================================
    // UPDATE USER STATISTICS
    // =====================================================

    user.totalInvested =
      Number(user.totalInvested || 0) +
      investAmount;

    user.lastInvestment = new Date();

    await user.save();

    // =====================================================
    // CREATE INVESTMENT
    // =====================================================

    const investment = await Investment.create({
      user: user._id,

      package: pkg._id,

      amount: investAmount,

      roi,

      profit,

      // =================================================
      // PROFIT TRACKING
      // =================================================

      profitEarned: 0,

      profitWithdrawn: 0,

      profitAvailable: 0,

      dailyProfit,

      // =================================================
      // DURATION
      // =================================================

      duration,

      startDate,

      endDate,

      daysCompleted: 0,

      // =================================================
      // PRINCIPAL
      // =================================================

      // Existing packages:
      // false → normal maturity behavior
      //
      // Locked-profit packages:
      // true → principal remains locked
      principalLocked: isLockedProfit,

      // =================================================
      // PROFIT WITHDRAWAL CHECKPOINTS
      // =================================================

      lastProfitWithdrawalDay: 0,

      nextProfitWithdrawalDay:
        firstWithdrawalDay,

      status: "active",
    });

    // =====================================================
    // INVESTMENT TRANSACTION
    // =====================================================

    await Transaction.create({
      user: user._id,

      type: "investment",

      amount: investAmount,

      status: "completed",

      reference: crypto.randomUUID(),

      description:
        `Investment in ${pkg.name}`,
    });

    // =====================================================
    // REFERRAL COMMISSION
    // FIRST INVESTMENT ONLY
    // =====================================================

    if (
      user.referredBy &&
      !user.referralRewardPaid
    ) {
      const referrer =
        await User.findById(
          user.referredBy
        );

      if (referrer) {
        const commission =
          investAmount * 0.05;

        // Credit referrer
        referrer.balance =
          Number(referrer.balance || 0) +
          commission;

        referrer.referralEarnings =
          Number(
            referrer.referralEarnings || 0
          ) + commission;

        referrer.referralCount =
          Number(
            referrer.referralCount || 0
          ) + 1;

        await referrer.save();

        // Mark referral reward as paid
        user.referralRewardPaid = true;

        await user.save();

        // Referral transaction
        await Transaction.create({
          user: referrer._id,

          type: "referral",

          amount: commission,

          status: "completed",

          reference: crypto.randomUUID(),

          description:
            `Referral bonus from ${user.fullName}'s first investment`,
        });
      }
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message: isLockedProfit
        ? "Locked-profit investment created successfully."
        : "Investment created successfully.",

      investment,

      walletBalance: user.balance,
    });
  } catch (err) {
    console.error(
      "CREATE INVESTMENT ERROR:",
      err
    );

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================================
// GET USER INVESTMENTS
// =====================================================
exports.getInvestments = async (
  req,
  res
) => {
  try {
    const investments =
      await Investment.find({
        user: req.user.id,
      })
        .populate("package")
        .sort({ createdAt: -1 });

    return res.json(investments);
  } catch (err) {
    console.error(
      "GET INVESTMENTS ERROR:",
      err
    );

    return res.status(500).json({
      message: err.message,
    });
  }
};