const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Package = require("./models/Package");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected for seeding"))
  .catch((err) => console.log(err));

const seedPackages = async () => {
  try {
    // Delete all existing packages
    await Package.deleteMany({});

    console.log("🗑 Old packages removed");

    await Package.insertMany([
      {
        name: "Starter",
        minAmount: 300,
        maxAmount: 100000,
        duration: 7,
        roi: 15,
        isActive: true,
      },
      {
        name: "Bronze",
        minAmount: 550,
        maxAmount: 200000,
        duration: 10,
        roi: 20,
        isActive: true,
      },
      {
        name: "Silver",
        minAmount: 1000,
        maxAmount: 500000,
        duration: 15,
        roi: 30,
        isActive: true,
      },
      {
        name: "Gold",
        minAmount: 3000,
        maxAmount: 1000000,
        duration: 20,
        roi: 40,
        isActive: true,
      },
      {
        name: "Platinum",
        minAmount: 10000,
        maxAmount: 5000000,
        duration: 30,
        roi: 60,
        isActive: true,
      },
    ]);

    console.log("✅ Packages seeded successfully");

    process.exit(0);

  } catch (err) {
    console.log("Seed error:", err);
    process.exit(1);
  }
};

seedPackages();