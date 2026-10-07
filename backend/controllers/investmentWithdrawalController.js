const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const crypto = require("crypto");

// =====================================================
// WITHDRAW LOCKED-PROFIT INVESTMENT PROFIT
// =====================================================

exports.withdrawProfit = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // FIND INVESTMENT
    // =====================================================

    const investment = await Investment.findOne({
      _id: id,
      user: req.user.id,
    }).populate("package");

    if (!investment) {
      return res.status(404).json({
        message: "Investment not found.",
      });
    }

    // =====================================================
    // CHECK INVESTMENT TYPE
    // =====================================================

const isLockedProfit =
  investment.package?.investmentType === "locked_profit";

if (!isLockedProfit) {
      return res.status(400).json({
        message:
          "Profit withdrawal is only available for locked-profit investments.",
      });
    }

    // =====================================================
    // GET CONFIGURED WITHDRAWAL CHECKPOINTS
    // =====================================================

    let withdrawalDays = Array.isArray(
      investment.package?.profitWithdrawalDays
    )
      ? investment.package.profitWithdrawalDays
          .map(Number)
          .filter(
            (day) =>
              !isNaN(day) &&
              day > 0 &&
              day <= Number(investment.duration)
          )
          .sort((a, b) => a - b)
      : [];

    // Fallback for older locked-profit packages
    if (withdrawalDays.length === 0) {
      withdrawalDays = [10, 20, 30].filter(
        (day) => day <= Number(investment.duration)
      );
    }

    // =====================================================
    // CALCULATE CURRENT COMPLETED DAYS
    // =====================================================

    const now = new Date();

    const startDate = new Date(investment.startDate);
    const endDate = new Date(investment.endDate);

    const elapsed =
      now.getTime() -
      startDate.getTime();

    let completedDays = Math.floor(
      elapsed /
        (1000 * 60 * 60 * 24)
    );

    completedDays = Math.max(
      0,
      Math.min(
        completedDays,
        Number(investment.duration)
      )
    );

    // =====================================================
    // DETERMINE LATEST REACHED CHECKPOINT
    // =====================================================

    let allowedDay = 0;

    for (const day of withdrawalDays) {
      if (completedDays >= day) {
        allowedDay = day;
      }
    }

    // =====================================================
    // CHECK WHETHER PROFIT IS AVAILABLE
    // =====================================================

    if (allowedDay === 0) {
      const firstDay =
        withdrawalDays[0] || 10;

      return res.status(400).json({
        message:
          `Profit withdrawal is not yet available. Your first withdrawal becomes available on Day ${firstDay}.`,
        completedDays,
        nextWithdrawalDay: firstDay,
      });
    }

    // =====================================================
    // CHECK PREVIOUS WITHDRAWAL
    // =====================================================

    const lastWithdrawalDay =
      Number(
        investment.lastProfitWithdrawalDay || 0
      );

    if (lastWithdrawalDay >= allowedDay) {
      const nextWithdrawalDay =
        withdrawalDays.find(
          (day) => day > lastWithdrawalDay
        ) || 0;

      return res.status(400).json({
        message:
          "Profit for this withdrawal checkpoint has already been processed.",
        lastWithdrawalDay,
        nextWithdrawalDay,
      });
    }

    // =====================================================
    // CALCULATE PROFIT
    // =====================================================

    const dailyProfit =
      Number(investment.dailyProfit) || 0;

    const totalProfit =
      Number(investment.profit) || 0;

    const earnedProfit = Math.min(
      dailyProfit * completedDays,
      totalProfit
    );

    const alreadyWithdrawn =
      Number(investment.profitWithdrawn) || 0;

    // =====================================================
    // CALCULATE REMAINING PROFIT
    // =====================================================

    const withdrawableProfit = Math.max(
      0,
      earnedProfit - alreadyWithdrawn
    );

    if (withdrawableProfit <= 0) {
      return res.status(400).json({
        message:
          "No profit is currently available for withdrawal.",
        profitEarned:
          Number(earnedProfit.toFixed(2)),
        profitWithdrawn:
          Number(alreadyWithdrawn.toFixed(2)),
        profitAvailable: 0,
      });
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // =====================================================
    // FINAL WITHDRAWAL AMOUNT
    // =====================================================

    const withdrawalAmount =
      Number(
        withdrawableProfit.toFixed(2)
      );

    // =====================================================
    // CREDIT PROFIT TO WALLET
    // =====================================================

    user.balance =
      (Number(user.balance) || 0) +
      withdrawalAmount;

    user.totalProfitEarned =
      (Number(user.totalProfitEarned) || 0) +
      withdrawalAmount;

    await user.save();

    // =====================================================
    // UPDATE INVESTMENT
    // =====================================================

    investment.profitEarned =
      Number(earnedProfit.toFixed(2));

    investment.profitWithdrawn =
      Number(
        (
          alreadyWithdrawn +
          withdrawalAmount
        ).toFixed(2)
      );

    investment.profitAvailable = 0;

    investment.lastProfitWithdrawalDay =
      allowedDay;

    // =====================================================
    // NEXT WITHDRAWAL CHECKPOINT
    // =====================================================

    const nextWithdrawalDay =
      withdrawalDays.find(
        (day) => day > allowedDay
      ) || 0;

    investment.nextProfitWithdrawalDay =
      nextWithdrawalDay;

    // =====================================================
    // PRINCIPAL ALWAYS REMAINS LOCKED
    // =====================================================

    investment.principalLocked = true;

    // =====================================================
    // MAKE SURE COMPLETED INVESTMENT STAYS COMPLETED
    // =====================================================

    if (
      completedDays >=
        Number(investment.duration) ||
      now >= endDate
    ) {
      investment.status = "completed";

      investment.daysCompleted =
        Number(investment.duration);

      investment.profitEarned =
        Number(totalProfit.toFixed(2));

      investment.profitAvailable =
        Number(
          Math.max(
            0,
            totalProfit -
              investment.profitWithdrawn
          ).toFixed(2)
        );

      investment.nextProfitWithdrawalDay = 0;
    }

    await investment.save();

    // =====================================================
    // RECORD PROFIT TRANSACTION
    // =====================================================

    await Transaction.create({
      user: user._id,

      type: "profit",

      amount: withdrawalAmount,

      status: "completed",

      reference: crypto.randomUUID(),

      description:
        `${investment.package.name} profit withdrawal - Day ${allowedDay}`,
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.json({
      success: true,

      message:
        `KES ${withdrawalAmount.toFixed(
          2
        )} profit credited to your wallet.`,

      amount: withdrawalAmount,

      withdrawalDay: allowedDay,

      completedDays,

      profitEarned:
        Number(
          investment.profitEarned.toFixed(2)
        ),

      totalProfit:
        Number(totalProfit.toFixed(2)),

      profitWithdrawn:
        Number(
          investment.profitWithdrawn.toFixed(2)
        ),

      profitAvailable:
        Number(
          investment.profitAvailable.toFixed(2)
        ),

      principalLocked: true,

      nextProfitWithdrawalDay:
        investment.nextProfitWithdrawalDay,

      status: investment.status,

      walletBalance:
        Number(user.balance.toFixed(2)),

      investment,
    });
  } catch (error) {
    console.error(
      "❌ LOCKED-PROFIT WITHDRAWAL ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process profit withdrawal.",
      error: error.message,
    });
  }
};
