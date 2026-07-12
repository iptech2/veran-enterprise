const express = require("express");
const router = express.Router();

const {
  getBalance,
  deposit,
  withdraw,
} = require("../controllers/walletController");

const protect = require("../middleware/protect");

router.get("/balance", protect, getBalance);
router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);

module.exports = router;