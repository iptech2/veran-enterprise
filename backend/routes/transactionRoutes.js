const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const {
  getMyTransactions,
} = require("../controllers/transactionController");

// GET USER TRANSACTIONS
router.get("/", protect, getMyTransactions);

module.exports = router;