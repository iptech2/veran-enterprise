// const mongoose = require("mongoose");

// const TransactionSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     type: {
//       type: String,
//       enum: [
//         "deposit",
//         "withdrawal",
//         "investment",
//         "profit",
//         "referral", // NEW
//       ],
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "completed",
//         "failed",
//         "approved",
//         "rejected",
//       ],
//       default: "pending",
//     },

//     reference: {
//       type: String,
//       sparse: true,
//       unique: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Transaction", TransactionSchema);

const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "deposit",
        "withdrawal",
        "investment",
        "profit",
        "referral",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "failed",
        "approved",
        "rejected",
      ],
      default: "pending",
    },

    // M-Pesa Receipt or Internal Reference
    reference: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Phone used during payment
    phone: {
      type: String,
      default: "",
    },

    // CheckoutRequestID returned by Safaricom
    checkoutRequestID: {
      type: String,
      default: "",
    },

    // MerchantRequestID returned by Safaricom
    merchantRequestID: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);