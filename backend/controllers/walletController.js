const User = require("../models/User");
const Transaction = require("../models/Transaction");
const mpesa = require("../services/mpesa");
const crypto = require("crypto");

/* =====================================
   GET WALLET BALANCE
===================================== */
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      balance: user.balance || 0,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =====================================
   DEPOSIT (STK PUSH)
===================================== */
exports.deposit = async (req, res) => {
  try {
    let { amount, phone } = req.body;

    amount = Number(amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    phone = phone.trim();

    // Convert 07XXXXXXXX to 2547XXXXXXXX
    const formattedPhone = phone.startsWith("0")
      ? "254" + phone.substring(1)
      : phone;

    console.log("========== STK PUSH ==========");
    console.log({
      phone: formattedPhone,
      amount,
    });

    // Send STK Push
    const response = await mpesa.stkPush(
      formattedPhone,
      amount
    );

    console.log("========== SAFARICOM RESPONSE ==========");
    console.log(response);

    // Save pending transaction
    await Transaction.create({
      user: req.user.id,
      type: "deposit",
      amount,
      status: "pending",
      reference:
        response.CheckoutRequestID ||
        crypto.randomUUID(),
      description: "M-Pesa Wallet Deposit",
    });

    return res.json({
      success: true,
      message: "STK Push sent successfully.",
      checkoutRequestID: response.CheckoutRequestID,
    });

  } catch (err) {

    console.log("========== MPESA ERROR ==========");

    if (err.response) {
      console.log(err.response.data);

      return res.status(500).json({
        message:
          err.response.data.errorMessage ||
          err.response.data.errorCode ||
          err.message,
      });
    }

    console.log(err);

    return res.status(500).json({
      message: err.message,
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

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // Deduct balance immediately
    user.balance -= amount;
    await user.save();

    // Record withdrawal
    const transaction = await Transaction.create({
      user: user._id,
      type: "withdrawal",
      amount,
      status: "pending",
      reference: crypto.randomUUID(),
      description: "Withdrawal Request",
    });

    return res.json({
      success: true,
      message: "Withdrawal request submitted successfully.",
      balance: user.balance,
      transaction,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};