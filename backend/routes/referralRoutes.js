const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  getMyReferrals,
} = require("../controllers/referralController");

/* ===========================
   MY REFERRALS
=========================== */

router.get(
  "/",
  protect,
  getMyReferrals
);

module.exports = router;