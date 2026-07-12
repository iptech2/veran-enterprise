const Transaction = require("../models/Transaction");
const Investment = require("../models/Investment");
const User = require("../models/User");

exports.getReports = async (req, res) => {
  try {

    // ==========================
    // Monthly Deposits
    // ==========================

    const monthlyDeposits = await Transaction.aggregate([
      {
        $match: {
          type: "deposit",
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ==========================
    // Monthly Withdrawals
    // ==========================

    const monthlyWithdrawals = await Transaction.aggregate([
      {
        $match: {
          type: "withdrawal",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ==========================
    // Investment Packages
    // ==========================

    const packageStats = await Investment.aggregate([
      {
        $lookup: {
          from: "packages",
          localField: "package",
          foreignField: "_id",
          as: "package",
        },
      },
      {
        $unwind: "$package",
      },
      {
        $group: {
          _id: "$package.name",
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    // ==========================
    // User Growth
    // ==========================

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    res.json({
      monthlyDeposits,
      monthlyWithdrawals,
      packageStats,
      userGrowth,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};