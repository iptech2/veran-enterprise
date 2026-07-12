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