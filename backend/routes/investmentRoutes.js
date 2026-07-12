const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  createInvestment,
  getInvestments,
} = require("../controllers/investmentController");

// GET MY INVESTMENTS
router.get("/", protect, getInvestments);

// CREATE INVESTMENT
router.post("/create", protect, createInvestment);

module.exports = router;