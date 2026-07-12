const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminMiddleware");

/* ===========================
   CONTROLLERS
=========================== */

const {
  getStats,
  getUsers,
  getInvestments,
  getTransactions,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

const {
  getAllWithdrawals,
  updateWithdrawalStatus,
} = require("../controllers/withdrawalController");

const {
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");

const {
  getReferralStats,
} = require("../controllers/adminReferralController");

const {
  getDeposits,
} = require("../controllers/depositController");

/* ===========================
   DASHBOARD
=========================== */

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getStats
);

/* ===========================
   USERS
=========================== */

// Get all users
router.get(
  "/users",
  protect,
  adminOnly,
  getUsers
);

// Update user role
router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

// Delete user
router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

/* ===========================
   INVESTMENTS
=========================== */

router.get(
  "/investments",
  protect,
  adminOnly,
  getInvestments
);

/* ===========================
   TRANSACTIONS
=========================== */

router.get(
  "/transactions",
  protect,
  adminOnly,
  getTransactions
);
/* ===========================
   DEPOSITS
=========================== */
router.get(
  "/deposits",
  protect,
  adminOnly,
  getDeposits
);
/* ===========================
   WITHDRAWALS
=========================== */

router.get(
  "/withdrawals",
  protect,
  adminOnly,
  getAllWithdrawals
);

router.put(
  "/withdrawals/:id",
  protect,
  adminOnly,
  updateWithdrawalStatus
);

/* ===========================
   PACKAGE MANAGEMENT
=========================== */

// Get all packages
router.get(
  "/packages",
  protect,
  adminOnly,
  getAllPackages
);

// Create package
router.post(
  "/packages",
  protect,
  adminOnly,
  createPackage
);

// Update package
router.put(
  "/packages/:id",
  protect,
  adminOnly,
  updatePackage
);

// Delete package
router.delete(
  "/packages/:id",
  protect,
  adminOnly,
  deletePackage
);

router.get(
  "/referrals",
  protect,
  adminOnly,
  getReferralStats
);

module.exports = router;