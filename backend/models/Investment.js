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

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    roi: {
      type: Number,
      required: true,
      min: 0,
    },

    profit: {
      type: Number,
      required: true,
      min: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
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