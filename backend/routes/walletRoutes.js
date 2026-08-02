const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  getBalance,
  deposit,
  withdraw,
} = require("../controllers/walletController");

// Wallet
router.get("/balance", protect, getBalance);
router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);

// Alias endpoint for frontend compatibility
router.post("/stkpush", protect, deposit);

module.exports = router;