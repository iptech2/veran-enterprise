const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Transaction = require("../models/Transaction");

router.post("/callback", async (req, res) => {
  try {
    console.log("==================================");
    console.log("MPESA CALLBACK RECEIVED");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("==================================");

    const callback = req.body.Body.stkCallback;

    const checkoutRequestID = callback.CheckoutRequestID;

    // Find pending transaction
    const transaction = await Transaction.findOne({
      reference: checkoutRequestID,
    });

    if (!transaction) {
      console.log("Transaction not found:", checkoutRequestID);

      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    // Prevent duplicate callback processing
    if (transaction.status === "completed") {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Already processed",
      });
    }

    if (callback.ResultCode === 0) {

      const metadata = callback.CallbackMetadata.Item;

      const amount =
        metadata.find(i => i.Name === "Amount")?.Value || 0;

      const receipt =
        metadata.find(i => i.Name === "MpesaReceiptNumber")?.Value || "";

      const phone =
        metadata.find(i => i.Name === "PhoneNumber")?.Value || "";

      const user = await User.findById(transaction.user);

      if (!user) {
        console.log("User not found");

        return res.json({
          ResultCode: 0,
          ResultDesc: "User not found",
        });
      }

      // Credit wallet
      user.balance += Number(amount);

      await user.save();

      // Update transaction
      transaction.status = "completed";

      transaction.reference = receipt;

      transaction.phone = String(phone);

      transaction.checkoutRequestID = checkoutRequestID;

      transaction.description = `M-Pesa Deposit (${receipt})`;

      await transaction.save();

      console.log("==================================");
      console.log("Wallet Credited");
      console.log("User:", user.fullName);
      console.log("Amount:", amount);
      console.log("Receipt:", receipt);
      console.log("==================================");

    } else {

      transaction.status = "failed";

      await transaction.save();

      console.log("Payment cancelled or failed");

    }

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: err.message,
    });

  }
});

module.exports = router;