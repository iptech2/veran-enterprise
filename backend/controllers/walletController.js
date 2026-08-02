const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { stkPush } = require("../services/mpesa");
const crypto = require("crypto");

/* =====================================
   GET WALLET BALANCE
===================================== */
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      balance: user.balance,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================
   DEPOSIT (M-PESA STK PUSH)
===================================== */
exports.deposit = async (req, res) => {
  try {

    let { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone and amount are required",
      });
    }

    amount = Number(amount);

    if (isNaN(amount) || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Format phone number
    phone = phone.toString().trim();

    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    }

    if (phone.startsWith("+254")) {
      phone = phone.replace("+", "");
    }

    // Internal reference
    const reference =
      "DEP-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    console.log("========== STK PUSH ==========");
    console.log({
      phone,
      amount,
      reference,
    });

    // Send STK Push
    const response = await stkPush(
      phone,
      amount,
      reference
    );

    console.log("========== SAFARICOM RESPONSE ==========");
    console.log(response);

    if (response.ResponseCode !== "0") {
      return res.status(400).json({
        success: false,
        message: response.ResponseDescription,
      });
    }

    // Save pending transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: "deposit",
      amount,
      status: "pending",

      reference,

      phone,

      checkoutRequestID: response.CheckoutRequestID,

      merchantRequestID: response.MerchantRequestID,

      description: "M-Pesa Deposit",
    });

    console.log("Transaction saved:");
    console.log(transaction);

    return res.json({
      success: true,
      message: "STK Push sent successfully.",
      checkoutRequestID: response.CheckoutRequestID,
      transactionId: transaction._id,
    });

  } catch (err) {

    console.log("========== MPESA ERROR ==========");
    console.log(err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message:
        err.response?.data?.errorMessage ||
        err.message,
    });
  }
};

/* =====================================
   WITHDRAW
===================================== */
exports.withdraw = async (req, res) => {
  try {

    let { amount } = req.body;

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    user.balance -= amount;
    user.totalWithdrawn += amount;

    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      type: "withdrawal",
      amount,
      status: "pending",
      reference:
        "WTH-" +
        crypto.randomBytes(4).toString("hex").toUpperCase(),
      description: "Withdrawal Request",
    });

    return res.json({
      success: true,
      message: "Withdrawal request submitted.",
      balance: user.balance,
      transaction,
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};