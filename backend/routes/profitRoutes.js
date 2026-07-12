const express = require("express");
const router = express.Router();

const { initiatePayment } = require("../controllers/mpesaController");
const protect = require("../middleware/authMiddleware");

router.post("/stkpush", protect, initiatePayment);

module.exports = router;