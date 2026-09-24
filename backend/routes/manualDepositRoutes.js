import express from "express";

import {
  createManualDeposit,
  getMyManualDeposits,
  getPendingManualDeposits,
  approveManualDeposit,
  rejectManualDeposit,
} from "../controllers/manualDepositController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

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

export default router;