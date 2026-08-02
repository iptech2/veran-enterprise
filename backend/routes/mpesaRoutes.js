const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Transaction = require("../models/Transaction");

/* ==========================================
   MPESA CALLBACK
========================================== */
router.post("/callback", async (req, res) => {
  try {
    console.log("==================================");
    console.log("MPESA CALLBACK RECEIVED");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("==================================");

    const callback = req.body?.Body?.stkCallback;

    if (!callback) {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    const checkoutRequestID = callback.CheckoutRequestID;

    const transaction = await Transaction.findOne({
      checkoutRequestID,
    });

    if (!transaction) {
      console.log("Transaction not found:", checkoutRequestID);

      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    // Prevent duplicate processing
    if (transaction.status === "completed") {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Already processed",
      });
    }

    // Payment failed
    if (callback.ResultCode !== 0) {
      transaction.status = "failed";
      await transaction.save();

      console.log("Payment Failed");
      console.log(callback.ResultCode);
      console.log(callback.ResultDesc);

      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    // Successful payment
    const metadata = callback.CallbackMetadata?.Item || [];

    const amount =
      metadata.find((i) => i.Name === "Amount")?.Value || 0;

    const receipt =
      metadata.find((i) => i.Name === "MpesaReceiptNumber")?.Value || "";

    const phone =
      metadata.find((i) => i.Name === "PhoneNumber")?.Value || "";

    const user = await User.findById(transaction.user);

    if (!user) {
      console.log("User not found");

      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    // Credit wallet
    user.balance += Number(amount);
    user.totalDeposited += Number(amount);

    await user.save();

    // Update transaction
    transaction.status = "completed";
    transaction.phone = String(phone);
    transaction.reference = receipt;
    transaction.description = `M-Pesa Deposit (${receipt})`;

    await transaction.save();

    console.log("==================================");
    console.log("PAYMENT SUCCESS");
    console.log({
      user: user.fullName,
      amount,
      receipt,
      balance: user.balance,
    });
    console.log("==================================");

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });

  } catch (err) {

    console.log("CALLBACK ERROR");
    console.log(err);

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
});

module.exports = router;