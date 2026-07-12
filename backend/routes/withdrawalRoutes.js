const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  createWithdrawal,
  getUserWithdrawals,
} = require("../controllers/withdrawalController");

/*
====================================
USER ROUTES
====================================
*/

// Create withdrawal request
router.post("/", protect, createWithdrawal);

// Get logged-in user's withdrawals
router.get("/", protect, getUserWithdrawals);

module.exports = router;