// const express = require("express");
// const router = express.Router();

// const protect = require("../middleware/protect");

// const {
//   createInvestment,
//   getInvestments,
// } = require("../controllers/investmentController");

// // GET MY INVESTMENTS
// router.get("/", protect, getInvestments);

// // CREATE INVESTMENT
// router.post("/create", protect, createInvestment);

// module.exports = router;const express = require("express");

const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
  createInvestment,
  getInvestments,
} = require("../controllers/investmentController");

const {
  withdrawProfit,
} = require("../controllers/investmentWithdrawalController");

console.log("protect =", typeof protect);
console.log("createInvestment =", typeof createInvestment);
console.log("getInvestments =", typeof getInvestments);
console.log("withdrawProfit =", typeof withdrawProfit);

// GET MY INVESTMENTS
router.get("/", protect, getInvestments);

// CREATE INVESTMENT
router.post("/create", protect, createInvestment);

// WITHDRAW VERAN GROWTH PLUS PROFIT
router.post(
  "/:id/withdraw-profit",
  protect,
  withdrawProfit
);

module.exports = router;