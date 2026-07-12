const Transaction = require("../models/Transaction");

// =======================================
// GET ALL DEPOSITS
// =======================================
exports.getDeposits = async (req, res) => {
  try {
    const deposits = await Transaction.find({
      type: "deposit",
    })
      .populate(
        "user",
        "fullName email phone"
      )
      .sort({ createdAt: -1 });

    // Dashboard statistics
    const totalDeposits = deposits.reduce(
      (sum, d) => sum + d.amount,
      0
    );

    const completedDeposits = deposits.filter(
      (d) => d.status === "completed"
    );

    const pendingDeposits = deposits.filter(
      (d) => d.status === "pending"
    );

    const failedDeposits = deposits.filter(
      (d) =>
        d.status === "failed" ||
        d.status === "rejected"
    );

    res.json({
      deposits,

      stats: {
        totalDeposits,

        totalTransactions: deposits.length,

        completedTransactions:
          completedDeposits.length,

        pendingTransactions:
          pendingDeposits.length,

        failedTransactions:
          failedDeposits.length,

        completedAmount:
          completedDeposits.reduce(
            (sum, d) => sum + d.amount,
            0
          ),

        pendingAmount:
          pendingDeposits.reduce(
            (sum, d) => sum + d.amount,
            0
          ),

        failedAmount:
          failedDeposits.reduce(
            (sum, d) => sum + d.amount,
            0
          ),
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};