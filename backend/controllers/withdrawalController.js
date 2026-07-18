const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { randomUUID } = require("crypto");
const sendEmail = require("../utils/sendEmail");

/*
====================================
CREATE WITHDRAWAL
====================================
*/
exports.createWithdrawal = async (req, res) => {
  try {
    const { amount, phone } = req.body;

    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return res.status(400).json({
        message: "Invalid withdrawal amount.",
      });
    }

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.balance < withdrawAmount) {
      return res.status(400).json({
        message: "Insufficient wallet balance.",
      });
    }

    // Deduct wallet immediately
    user.balance -= withdrawAmount;
    await user.save();

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount: withdrawAmount,
      phone,
      status: "pending",
    });

    await Transaction.create({
      user: user._id,
      type: "withdrawal",
      amount: withdrawAmount,
      status: "pending",
      reference: randomUUID(),
      description: "Withdrawal request",
    });
// adding my own
//     await sendEmail(
//   user.email,
//   "Withdrawal Request Received",
//   `
//     <h2>Withdrawal Request Received</h2>

//     <p>Hello <strong>${user.fullName}</strong>,</p>

//     <p>Your withdrawal request has been received successfully.</p>

//     <table border="1" cellpadding="8" cellspacing="0">
//       <tr>
//         <td><strong>Amount</strong></td>
//         <td>KES ${withdrawAmount.toLocaleString()}</td>
//       </tr>

//       <tr>
//         <td><strong>Phone</strong></td>
//         <td>${phone}</td>
//       </tr>

//       <tr>
//         <td><strong>Status</strong></td>
//         <td>Pending Review</td>
//       </tr>
//     </table>

//     <br>

//     <p>
//       We will notify you once the request has been processed.
//     </p>

//     <br>

//     <p>Veran Investment Platform</p>
//   `
// );
sendEmail(
  user.email,
  "Withdrawal Request Received",
  `
    <h2>Withdrawal Request Received</h2>

    <p>Hello <strong>${user.fullName}</strong>,</p>

    <p>Your withdrawal request has been received successfully.</p>

    <table border="1" cellpadding="8" cellspacing="0">
      <tr>
        <td><strong>Amount</strong></td>
        <td>KES ${withdrawAmount.toLocaleString()}</td>
      </tr>

      <tr>
        <td><strong>Phone</strong></td>
        <td>${phone}</td>
      </tr>

      <tr>
        <td><strong>Status</strong></td>
        <td>Pending Review</td>
      </tr>
    </table>

    <br>

    <p>
      We will notify you once the request has been processed.
    </p>

    <br>

    <p>Veran Investment Platform</p>
  `
).catch((err) => {
  console.error("Withdrawal request email failed:", err.message);
});


    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully.",
      withdrawal,
      walletBalance: user.balance,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
====================================
USER WITHDRAWALS
====================================
*/
exports.getUserWithdrawals = async (req, res) => {
  try {

    const withdrawals = await Withdrawal.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(withdrawals);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
====================================
ADMIN GET ALL WITHDRAWALS
====================================
*/
exports.getAllWithdrawals = async (req, res) => {
  try {

    const withdrawals = await Withdrawal.find()
      .populate("user", "fullName email phone")
      .sort({ createdAt: -1 });

    res.json(withdrawals);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
====================================
ADMIN APPROVE / REJECT
====================================
*/
exports.updateWithdrawalStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      status,
      remarks,
      reference,
    } = req.body;

    const withdrawal = await Withdrawal.findById(id);

    if (!withdrawal) {
      return res.status(404).json({
        message: "Withdrawal not found.",
      });
    }

    // Prevent updating twice
    if (
      withdrawal.status === "paid" ||
      withdrawal.status === "rejected"
    ) {
      return res.status(400).json({
        message: "Withdrawal already processed.",
      });
    }

    withdrawal.status = status;

    if (remarks) {
      withdrawal.remarks = remarks;
    }

    if (reference) {
      withdrawal.reference = reference;
    }

    await withdrawal.save();

    const user = await User.findById(withdrawal.user);

if (status === "paid") {

   sendEmail(
    user.email,
    "Withdrawal Paid",
    `
      <h2>Withdrawal Successful</h2>

      <p>Hello <strong>${user.fullName}</strong>,</p>

      <p>Your withdrawal has been processed successfully.</p>

      <table border="1" cellpadding="8">
        <tr>
          <td><strong>Amount</strong></td>
          <td>KES ${withdrawal.amount.toLocaleString()}</td>
        </tr>

        <tr>
          <td><strong>M-Pesa Reference</strong></td>
          <td>${withdrawal.reference}</td>
        </tr>

        <tr>
          <td><strong>Remarks</strong></td>
          <td>${withdrawal.remarks}</td>
        </tr>
      </table>

      <br>

      <p>Thank you for investing with Veran.</p>
    `
  ).catch((err) => {
  console.error("Paid withdrawal email failed:", err.message);
});
}
// adding 
if (status === "rejected") {

 sendEmail(
    user.email,
    "Withdrawal Request Rejected",
    `
      <h2>Withdrawal Request Rejected</h2>

      <p>Hello <strong>${user.fullName}</strong>,</p>

      <p>
        Unfortunately your withdrawal request has been rejected.
      </p>

      <table border="1" cellpadding="8">
        <tr>
          <td><strong>Amount</strong></td>
          <td>KES ${withdrawal.amount.toLocaleString()}</td>
        </tr>

        <tr>
          <td><strong>Reason</strong></td>
          <td>${withdrawal.remarks}</td>
        </tr>
      </table>

      <br>

      <p>
        If you believe this is an error, please contact support.
      </p>
    `
).catch((err) => {
  console.error("Rejected withdrawal email failed:", err.message);
});

}

    // Update matching transaction
    const transaction = await Transaction.findOne({
      user: withdrawal.user,
      type: "withdrawal",
      amount: withdrawal.amount,
      status: "pending",
    }).sort({ createdAt: -1 });

    if (transaction) {

      transaction.description = remarks || transaction.description;

      if (reference) {
        transaction.reference = reference;
      }

      if (
        status === "approved" ||
        status === "paid"
      ) {
        transaction.status = "completed";
      }

      if (status === "rejected") {
        transaction.status = "rejected";
      }

      await transaction.save();
    }

    // Refund wallet if rejected
    if (status === "rejected") {

      const user = await User.findById(withdrawal.user);

      if (user) {
        user.balance += withdrawal.amount;
        await user.save();
      }
    }

    res.json({
      success: true,
      message: `Withdrawal ${status} successfully.`,
      withdrawal,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};