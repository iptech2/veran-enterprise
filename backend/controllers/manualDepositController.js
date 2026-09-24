const crypto = require("crypto");
const mongoose = require("mongoose");

const ManualDeposit = require("../models/ManualDeposit");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Veran Enterprise Buy Goods Till
const VERAN_TILL_NUMBER = "9207399";

// ==========================================
// USER: CREATE MANUAL DEPOSIT
// ==========================================
const createManualDeposit = async (req, res) => {
  try {
    const { amount, phone } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Enter a valid deposit amount.",
      });
    }

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required.",
      });
    }

    const reference = `MAN-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    const deposit = await ManualDeposit.create({
      user: req.user.id,
      amount: Number(amount),
      phone: phone.trim(),
      tillNumber: VERAN_TILL_NUMBER,
      reference,
      status: "pending",
    });

    return res.status(201).json({
      message:
        "Manual deposit submitted successfully. Your payment will be verified by an administrator.",
      deposit: {
        id: deposit._id,
        amount: deposit.amount,
        phone: deposit.phone,
        tillNumber: deposit.tillNumber,
        reference: deposit.reference,
        status: deposit.status,
        createdAt: deposit.createdAt,
      },
    });
  } catch (error) {
    console.error("Create manual deposit error:", error);

    return res.status(500).json({
      message: "Failed to submit manual deposit.",
    });
  }
};

// ==========================================
// USER: GET OWN MANUAL DEPOSITS
// ==========================================
const getMyManualDeposits = async (req, res) => {
  try {
    const deposits = await ManualDeposit.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(deposits);
  } catch (error) {
    console.error("Get manual deposits error:", error);

    return res.status(500).json({
      message: "Failed to load deposit requests.",
    });
  }
};

// ==========================================
// ADMIN: GET PENDING DEPOSITS
// ==========================================
const getPendingManualDeposits = async (req, res) => {
  try {
    const deposits = await ManualDeposit.find({
      status: "pending",
    })
      .populate("user", "name email phone balance")
      .sort({ createdAt: 1 });

    return res.json(deposits);
  } catch (error) {
    console.error("Get pending deposits error:", error);

    return res.status(500).json({
      message: "Failed to load pending deposits.",
    });
  }
};

// ==========================================
// ADMIN: APPROVE DEPOSIT
// ==========================================
const approveManualDeposit = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deposit = await ManualDeposit.findOne({
      _id: req.params.id,
      status: "pending",
    }).session(session);

    if (!deposit) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Deposit request not found or already processed.",
      });
    }

    const user = await User.findById(deposit.user).session(session);

    if (!user) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "User associated with this deposit was not found.",
      });
    }

    // ==========================================
    // INCREASE USER WALLET BALANCE
    // ==========================================

    user.balance =
      Number(user.balance || 0) + Number(deposit.amount);

    await user.save({ session });

    // ==========================================
    // UPDATE DEPOSIT STATUS
    // ==========================================

    deposit.status = "approved";
    deposit.approvedBy = req.user.id;
    deposit.approvedAt = new Date();

    await deposit.save({ session });

    // ==========================================
    // CREATE WALLET TRANSACTION
    // ==========================================

    await Transaction.create(
      [
        {
          user: user._id,
          type: "deposit",
          amount: deposit.amount,
          status: "completed",
          reference: deposit.reference,
          description: `Manual M-Pesa deposit via Till ${deposit.tillNumber}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.json({
      message:
        "Deposit approved and wallet credited successfully.",
      balance: user.balance,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error(
      "Approve manual deposit error:",
      error
    );

    return res.status(500).json({
      message: "Failed to approve deposit.",
    });
  } finally {
    session.endSession();
  }
};

// ==========================================
// ADMIN: REJECT DEPOSIT
// ==========================================
const rejectManualDeposit = async (req, res) => {
  try {
    const { adminNote } = req.body;

    const deposit = await ManualDeposit.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
      },
      {
        $set: {
          status: "rejected",
          adminNote:
            adminNote ||
            "Deposit rejected by administrator.",
          rejectedAt: new Date(),
          approvedBy: req.user.id,
        },
      },
      {
        new: true,
      }
    );

    if (!deposit) {
      return res.status(404).json({
        message:
          "Deposit request not found or already processed.",
      });
    }

    return res.json({
      message: "Deposit rejected successfully.",
      deposit,
    });
  } catch (error) {
    console.error(
      "Reject manual deposit error:",
      error
    );

    return res.status(500).json({
      message: "Failed to reject deposit.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createManualDeposit,
  getMyManualDeposits,
  getPendingManualDeposits,
  approveManualDeposit,
  rejectManualDeposit,
};