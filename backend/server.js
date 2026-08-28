
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

// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// /* START CRON JOBS */
// require("./utils/investmentCron");

// const app = express();

// /* ==========================
//    MIDDLEWARE
// ========================== */

// app.use(cors());
// app.use(express.json());

// /* ==========================
//    DATABASE
// ========================== */

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.log("❌ DB Error:", err));

// /* ==========================
//    ROUTES
// ========================== */

// const authRoutes = require("./routes/authRoutes");
// const walletRoutes = require("./routes/walletRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const mpesaRoutes = require("./routes/mpesaRoutes");
// const investmentRoutes = require("./routes/investmentRoutes");
// const packageRoutes = require("./routes/packageRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const transactionRoutes = require("./routes/transactionRoutes");
// const withdrawalRoutes = require("./routes/withdrawalRoutes");
// const referralRoutes = require("./routes/referralRoutes");
// const userRoutes = require("./routes/userRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");

// app.use("/api/auth", authRoutes);
// app.use("/api/wallet", walletRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/mpesa", mpesaRoutes);
// app.use("/api/packages", packageRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/withdrawals", withdrawalRoutes);
// app.use("/api/investments", investmentRoutes);
// app.use("/api/referrals", referralRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/notifications", notificationRoutes);
// /* ==========================
//    HEALTH CHECK
// ========================== */

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "🚀 Veran Enterprise API Running",
//   });
// });

// /* ==========================
//    START SERVER
// ========================== */

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// // });

// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// /* START CRON JOBS */
// require("./utils/investmentCron");

// const app = express();

// /* ==========================
//    MIDDLEWARE
// ========================== */

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://veran-enterprise.vercel.app",
//     ],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /* ==========================
//    DATABASE
// ========================== */

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ Mongo Error:", err));

// /* ==========================
//    ROUTES
// ========================== */

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/wallet", require("./routes/walletRoutes"));
// app.use("/api/admin", require("./routes/adminRoutes"));
// app.use("/api/packages", require("./routes/packageRoutes"));
// app.use("/api/dashboard", require("./routes/dashboardRoutes"));
// app.use("/api/transactions", require("./routes/transactionRoutes"));
// app.use("/api/withdrawals", require("./routes/withdrawalRoutes"));
// app.use("/api/investments", require("./routes/investmentRoutes"));
// app.use("/api/referrals", require("./routes/referralRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/notifications", require("./routes/notificationRoutes"));

// /* ==========================
//    MPESA ROUTES
// ========================== */

// app.use("/api/mpesa", require("./routes/mpesaRoutes"));

// /* ==========================
//    HEALTH CHECK
// ========================== */

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "🚀 Veran Enterprise Backend Running",
//     environment: process.env.NODE_ENV || "development",
//   });
// });

// /* ==========================
//    404
// ========================== */

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// /* ==========================
//    ERROR HANDLER
// ========================== */

// app.use((err, req, res, next) => {
//   console.error(err);

//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// /* ==========================
//    START SERVER
// ========================== */

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
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