const express = require("express");

const {
  createManualDeposit,
  getMyManualDeposits,
  getPendingManualDeposits,
  approveManualDeposit,
  rejectManualDeposit,
} = require("../controllers/manualDepositController");

const authMiddleware = require("../middleware/protect");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// USER ROUTES
// ==========================================

router.post(
  "/",
  authMiddleware,
  createManualDeposit
);

router.get(
  "/my",
  authMiddleware,
  getMyManualDeposits
);

// ==========================================
// ADMIN ROUTES
// ==========================================

router.get(
  "/admin/pending",
  authMiddleware,
  adminMiddleware,
  getPendingManualDeposits
);

router.put(
  "/admin/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveManualDeposit
);

router.put(
  "/admin/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectManualDeposit
);

module.exports = router;