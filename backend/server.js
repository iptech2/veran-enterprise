
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

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://veran-enterprise.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================
   DATABASE
========================== */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

/* ==========================
   ROUTES
========================== */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/packages", require("./routes/packageRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/withdrawals", require("./routes/withdrawalRoutes"));
app.use("/api/investments", require("./routes/investmentRoutes"));
app.use("/api/referrals", require("./routes/referralRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

/* ==========================
   MPESA ROUTES
========================== */

app.use("/api/mpesa", require("./routes/mpesaRoutes"));


/* ==========================
   HEALTH CHECK
========================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Veran Enterprise Backend Running",
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

/* ==========================
   404
========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ==========================
   ERROR HANDLER
========================== */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ==========================
   START SERVER
========================== */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();