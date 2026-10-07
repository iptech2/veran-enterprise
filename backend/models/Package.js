const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    roi: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    minAmount: {
      type: Number,
      required: true,
    },

    maxAmount: {
      type: Number,
      required: true,
    },

    // =====================================
    // INVESTMENT TYPE
    // =====================================
    // Existing packages remain "standard"
    // New locked-profit packages use "locked_profit"
    investmentType: {
      type: String,
      enum: ["standard", "locked_profit"],
      default: "standard",
    },

    // =====================================
    // PROFIT WITHDRAWAL CHECKPOINTS
    // =====================================
    // Used only by locked-profit packages.
    //
    // Example:
    // [10, 20, 30]
    //
    // Existing standard packages ignore this.
    profitWithdrawalDays: {
      type: [Number],
      default: [10, 20, 30],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", PackageSchema);