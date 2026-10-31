const mongoose = require("mongoose");
require("dotenv").config();

const Investment = require("./models/Investment");
const User = require("./models/User");
const Package = require("./models/Package");

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    const investments = await Investment.find();

    let deleted = 0;

    for (const investment of investments) {
      let remove = false;

      // --------------------------
      // Invalid User
      // --------------------------
      const user = await User.findById(investment.user);

      if (!user) {
        console.log(`❌ Missing user: ${investment._id}`);
        remove = true;
      }

      // --------------------------
      // Invalid Package
      // --------------------------
      if (
        !investment.package ||
        typeof investment.package === "string"
      ) {
        console.log(`❌ Invalid package: ${investment._id}`);
        remove = true;
      } else {
        const pkg = await Package.findById(investment.package);

        if (!pkg) {
          console.log(`❌ Package not found: ${investment._id}`);
          remove = true;
        }
      }

      // --------------------------
      // Missing Profit
      // --------------------------
      if (
        investment.profit === undefined ||
        investment.profit === null
      ) {
        console.log(`❌ Missing profit: ${investment._id}`);
        remove = true;
      }

      // --------------------------
      // Missing ROI
      // --------------------------
      if (
        investment.roi === undefined ||
        investment.roi === null
      ) {
        console.log(`❌ Missing ROI: ${investment._id}`);
        remove = true;
      }

      if (remove) {
        await Investment.findByIdAndDelete(investment._id);

        console.log(`🗑 Deleted ${investment._id}`);

        deleted++;
      }
    }

    console.log(`\n==========================`);
    console.log(`Cleanup Complete`);
    console.log(`Deleted: ${deleted}`);
    console.log(`==========================`);

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanup();