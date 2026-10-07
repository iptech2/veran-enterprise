// const mongoose = require("mongoose");

// const InvestmentSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     package: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Package",
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//       min: 1,
//     },

//     roi: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     profit: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     startDate: {
//       type: Date,
//       default: Date.now,
//     },

//     endDate: {
//       type: Date,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["active", "completed"],
//       default: "active",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Investment", InvestmentSchema);

const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    // Principal invested
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    // Total ROI percentage for the package
    // Example: 50 means 50% total profit over the investment period
    roi: {
      type: Number,
      required: true,
      min: 0,
    },

    // Total profit expected when investment completes
    profit: {
      type: Number,
      required: true,
      min: 0,
    },

    // Profit earned so far
    profitEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Profit already withdrawn by the user
    profitWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Profit currently available for withdrawal
    profitAvailable: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Amount of profit earned per day
    dailyProfit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Number of days the investment runs
    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // Number of complete investment days
    daysCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Principal remains locked during the investment
    principalLocked: {
      type: Boolean,
      default: true,
    },

    // Withdrawal checkpoints
    lastProfitWithdrawalDay: {
      type: Number,
      default: 0,
      min: 0,
    },

    nextProfitWithdrawalDay: {
      type: Number,
      default: 10,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Investment", InvestmentSchema);