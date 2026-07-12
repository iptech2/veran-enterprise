// const mongoose = require("mongoose");

// const WithdrawalSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "paid"],
//       default: "pending",
//     },

//     reference: {
//       type: String,
//       default: "",
//     },

//     remarks: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Withdrawal", WithdrawalSchema);

const mongoose = require("mongoose");

const WithdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "paid",
        "failed",
      ],
      default: "pending",
    },

    // Your internal reference
    reference: {
      type: String,
      default: "",
    },

    // Safaricom B2C IDs
    conversationID: {
      type: String,
      default: "",
    },

    originatorConversationID: {
      type: String,
      default: "",
    },

    // M-Pesa transaction receipt
    mpesaReceipt: {
      type: String,
      default: "",
    },

    remarks: {
      type: String,
      default: "",
    },

    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Withdrawal", WithdrawalSchema);