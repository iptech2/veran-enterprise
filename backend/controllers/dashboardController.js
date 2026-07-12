const User = require("../models/User");
const Investment = require("../models/Investment");
const Transaction = require("../models/Transaction");
const Package = require("../models/Package");

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const packages = await Package.find({
      isActive: true,
    }).sort({ minAmount: 1 });

    const investments = await Investment.find({
      user: req.user.id,
    })
      .populate("package")
      .sort({ createdAt: -1 });

    const transactions = await Transaction.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      walletBalance: user.balance,
      packages,
      investments,
      transactions,
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalInvestments = await Investment.countDocuments();

    const totalPackages = await Package.countDocuments({
      isActive: true,
    });

    const totalTransactions = await Transaction.countDocuments();

    res.json({
      totalUsers,
      totalInvestments,
      totalPackages,
      totalTransactions,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// controllers/
// adminController.js
// dashboardController.js
// investmentController.js
// mpesaController.js
// mpesaCallbackController.j
// packageController.js
// profitController.js
// transactionController.js
// userController.js
// walletController.js
// withdrawalController.js
// authController.js

// routes/
// adminRoutes.js
// authRoutes.js
// dashboardRoutes.js
// investmentRoutes.js
// mpesaRoutes.js
// packageRoutes.js
// profitRoutes.js
// transactionRoutes.js
// walletRoutes.js
// userRoutes.js
// withdrawalRoutes.js


// middleware/
// auth.js
// protect.js
// authMiddleware.js
// adminMiddleware.js

// models/
// Investment.js
// Package.js
// Transaction.js
// User.js
// Withdrawal.js

// services/
// mpesa.js
// profitCron.js

// utils/
// investmentCron.js
// mpesa.js
// sendEmail.js