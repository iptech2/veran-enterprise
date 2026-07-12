const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getPackages,
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");

/* ===================================
   USER ROUTES
=================================== */

// Get active packages
router.get("/", getPackages);

/* ===================================
   ADMIN ROUTES
=================================== */

// Get all packages
router.get("/admin", protect, adminOnly, getAllPackages);

// Create package
router.post("/", protect, adminOnly, createPackage);

// Update package
router.put("/:id", protect, adminOnly, updatePackage);

// Delete package
router.delete("/:id", protect, adminOnly, deletePackage);

module.exports = router;