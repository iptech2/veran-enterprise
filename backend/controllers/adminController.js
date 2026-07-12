const User = require("../models/User");
const Investment = require("../models/Investment");
const Transaction = require("../models/Transaction");
const Withdrawal = require("../models/Withdrawal");

/* ===========================
   DASHBOARD STATS
=========================== */

exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();

    const investments = await Investment.countDocuments();

    const activeInvestments = await Investment.countDocuments({
      status: "active",
    });

    const completedInvestments = await Investment.countDocuments({
      status: "completed",
    });

    const transactions = await Transaction.countDocuments();

    /* ======================
       TOTAL DEPOSITS
    ====================== */

    const deposits = await Transaction.aggregate([
      {
        $match: {
          type: "deposit",
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    /* ======================
       USER BALANCE
    ====================== */

    const totalBalance = await User.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$balance",
          },
        },
      },
    ]);

    /* ======================
       TOTAL INVESTED
    ====================== */

    const invested = await Investment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    /* ======================
       ACTIVE CAPITAL
    ====================== */

    const activeCapital = await Investment.aggregate([
      {
        $match: {
          status: "active",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    /* ======================
       COMPLETED CAPITAL
    ====================== */

    const completedCapital = await Investment.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    /* ======================
       TOTAL PROFIT
    ====================== */

    const profitPaid = await Investment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$profit",
          },
        },
      },
    ]);

    /* ======================
       WITHDRAWALS
    ====================== */

    const pendingWithdrawals =
      await Withdrawal.countDocuments({
        status: "pending",
      });

    const approvedWithdrawals =
      await Withdrawal.countDocuments({
        status: "approved",
      });

    res.json({
      users,
      investments,
      activeInvestments,
      completedInvestments,
      transactions,

      totalDeposits: deposits[0]?.total || 0,
      totalBalance: totalBalance[0]?.total || 0,

      totalInvested: invested[0]?.total || 0,
      activeCapital: activeCapital[0]?.total || 0,
      completedCapital:
        completedCapital[0]?.total || 0,
      totalProfit: profitPaid[0]?.total || 0,

      pendingWithdrawals,
      approvedWithdrawals,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   USERS
=========================== */

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   INVESTMENTS
=========================== */

exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate("user")
      .populate("package")
      .sort({ createdAt: -1 });

    res.json(investments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   TRANSACTIONS
=========================== */

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE USER ROLE
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
