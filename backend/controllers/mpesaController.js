const crypto = require("crypto");

const { stkPush } = require("../services/mpesa");
const Transaction = require("../models/Transaction");

/* =====================================
   INITIATE STK PUSH
===================================== */

exports.stkPushRequest = async (req, res) => {
  try {
    let { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone and amount are required.",
      });
    }

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount.",
      });
    }

    // Format phone
    phone = String(phone).trim();

    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    }

    if (phone.startsWith("+254")) {
      phone = phone.replace("+", "");
    }

    // Generate internal reference
    const reference =
      "DEP-" +
      Date.now() +
      "-" +
      crypto.randomBytes(3).toString("hex").toUpperCase();

    console.log("========== NEW DEPOSIT ==========");
    console.log({
      user: req.user._id,
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

    if (response.ResponseCode !== "0") {
      return res.status(400).json({
        success: false,
        message: response.ResponseDescription,
      });
    }

    // Save pending transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: "deposit",
      amount,
      phone,
      reference,
      merchantRequestID: response.MerchantRequestID,
      checkoutRequestID: response.CheckoutRequestID,
      status: "pending",
      description: "M-Pesa Deposit",
    });

    console.log("Transaction Saved");
    console.log(transaction);

    return res.status(200).json({
      success: true,
      message: "STK Push sent successfully.",
      transaction,
    });

  } catch (err) {
    console.log("========== MPESA CONTROLLER ERROR ==========");
    console.log(err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: err.response?.data?.errorMessage || err.message,
    });
  }
};