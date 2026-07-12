
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("./utils/investmentCron");
// const app = express();

// /* MIDDLEWARE */
// app.use(cors());
// app.use(express.json());

// /* DATABASE */
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected")) 
//   .catch((err) => console.log("DB Error:", err));

// /* ROUTES */
// const authRoutes = require("./routes/authRoutes");
// const walletRoutes = require("./routes/walletRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const mpesaRoutes = require("./routes/mpesaRoutes");
// const investmentRoutes = require("./routes/investmentRoutes"); // ✅ FIXED ADDED
// // const investmentRoutes = require("./routes/investmentRoutes");
// const packageRoutes = require("./routes/packageRoutes");//added
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const transactionRoutes = require("./routes/transactionRoutes");
// const withdrawalRoutes = require("./routes/withdrawalRoutes");


// app.use("/api/auth", authRoutes);
// app.use("/api/wallet", walletRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/mpesa", mpesaRoutes);
// app.use("/api/packages", packageRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/withdrawals", withdrawalRoutes);

// /* ✅ FIXED INVESTMENT ROUTE */
// app.use("/api/investments", investmentRoutes);

// /* HEALTH CHECK */
// app.get("/", (req, res) => {
//   res.json({ message: "Veran Enterprise API Running 🚀" });
// });

// /* START SERVER */
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

/* START CRON JOBS */
require("./utils/investmentCron");

const app = express();

/* ==========================
   MIDDLEWARE
========================== */

app.use(cors());
app.use(express.json());

/* ==========================
   DATABASE
========================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err));

/* ==========================
   ROUTES
========================== */

const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const packageRoutes = require("./routes/packageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const referralRoutes = require("./routes/referralRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
/* ==========================
   HEALTH CHECK
========================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Veran Enterprise API Running",
  });
});

/* ==========================
   START SERVER
========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});