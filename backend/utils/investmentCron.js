// // upadated 
// const cron = require("node-cron");
// const { randomUUID } = require("crypto");

// const Investment = require("../models/Investment");
// const User = require("../models/User");
// const Transaction = require("../models/Transaction");
// const sendEmail = require("../utils/sendEmail");

// console.log("✅ Investment Cron Started...");

// // Every minute (Testing)
// // // Production: 0 0 * * *

// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();

//     // Process only 10 matured investments at a time
//     const investments = await Investment.find({
//       status: "active",
//       endDate: { $lte: now },
//     })
//       .populate("package")
//       .limit(10);

//     if (investments.length === 0) {
//       console.log("Investment Cron: No matured investments.");
//       return;
//     }

//     console.log(
//       `🔄 Processing ${investments.length} matured investment(s)...`
//     );

//     for (const investment of investments) {
//       try {
//         // Skip if package missing
//         if (!investment.package) {
//           console.log(
//             `❌ Missing package: ${investment._id}`
//           );

//           investment.status = "cancelled";
//           await investment.save();
//           continue;
//         }

//         // Skip if ROI/profit invalid
//         if (
//           investment.roi == null ||
//           investment.profit == null
//         ) {
//           console.log(
//             `❌ Invalid ROI/profit: ${investment._id}`
//           );

//           investment.status = "cancelled";
//           await investment.save();
//           continue;
//         }

//         const user = await User.findById(investment.user);

//         if (!user) {
//           console.log(
//             `❌ Missing user: ${investment._id}`
//           );

//           investment.status = "cancelled";
//           await investment.save();
//           continue;
//         }

//         // Mark completed BEFORE crediting
//         investment.status = "completed";
//         await investment.save();

//         const totalPayout =
//           investment.amount + investment.profit;

//         // user.balance += totalPayout;
//         // await user.save();

//                 // Credit wallet
//         user.balance += totalPayout;

//         // Update statistics
//         user.totalProfitEarned += investment.profit;

//         await user.save();

//         await Transaction.create({
//           user: user._id,
//           type: "investment",
//           amount: investment.amount,
//           status: "completed",
//           reference: randomUUID(),
//           description: `Principal returned from ${investment.package.name}`,
//         });

//         await Transaction.create({
//           user: user._id,
//           type: "profit",
//           amount: investment.profit,
//           status: "completed",
//           reference: randomUUID(),
//           description: `Profit from ${investment.package.name}`,
//         });

//         sendEmail(
//           user.email,
//           "Investment Completed Successfully",
//           `
//           <h2>Investment Completed</h2>

//           <p>Hello <strong>${user.fullName}</strong>,</p>

//           <p>Your investment has matured successfully.</p>

//           <p><strong>Package:</strong> ${investment.package.name}</p>

//           <p><strong>Capital:</strong> KES ${investment.amount.toLocaleString()}</p>

//           <p><strong>Profit:</strong> KES ${investment.profit.toLocaleString()}</p>

//           <p><strong>Total:</strong> KES ${totalPayout.toLocaleString()}</p>

//           <p><strong>Wallet Balance:</strong> KES ${user.balance.toLocaleString()}</p>

//           <br>

//           <p>Thank you for investing with Veran Enterprise.</p>
//           `
//         ).catch(err =>
//           console.error(
//             `Email failed for ${user.email}:`,
//             err.message
//           )
//         );

//         console.log(
//           `✅ ${user.fullName} credited KES ${totalPayout.toLocaleString()}`
//         );

//       } catch (err) {
//         console.error(
//           `❌ Error processing investment ${investment._id}:`,
//           err.message
//         );
//       }
//     }

//     console.log("✅ Investment Cron cycle completed.");

//   } catch (err) {
//     console.error("Investment Cron Error:", err.message);
//   }
// });

const cron = require("node-cron");
const { randomUUID } = require("crypto");

const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const sendEmail = require("../utils/sendEmail");

console.log("✅ Investment Cron Started...");

// Testing: every minute
// Production: 0 0 * * *
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Get only matured active investments
    const investments = await Investment.find({
      status: "active",
      endDate: { $lte: now },
    })
      .populate("package")
      .limit(10);

    if (investments.length === 0) {
      console.log("Investment Cron: No matured investments.");
      return;
    }

    console.log(
      `🔄 Processing ${investments.length} matured investment(s)...`
    );

    for (const investment of investments) {
      try {
        // --------------------------------------------------
        // 1. Validate package
        // --------------------------------------------------
        if (!investment.package) {
          console.log(`❌ Missing package: ${investment._id}`);

          investment.status = "cancelled";
          await investment.save();

          continue;
        }

        // --------------------------------------------------
        // 2. Validate ROI and profit
        // --------------------------------------------------
        if (
          investment.roi == null ||
          investment.profit == null ||
          Number(investment.profit) < 0
        ) {
          console.log(
            `❌ Invalid ROI/profit: ${investment._id}`
          );

          investment.status = "cancelled";
          await investment.save();

          continue;
        }

        // --------------------------------------------------
        // 3. Find user
        // --------------------------------------------------
        const user = await User.findById(investment.user);

        if (!user) {
          console.log(`❌ Missing user: ${investment._id}`);

          investment.status = "cancelled";
          await investment.save();

          continue;
        }

        // --------------------------------------------------
        // 4. Prevent duplicate processing
        // --------------------------------------------------
        const lockedInvestment = await Investment.findOneAndUpdate(
          {
            _id: investment._id,
            status: "active",
            endDate: { $lte: now },
          },
          {
            $set: {
              status: "completed",
            },
          },
          {
            new: true,
          }
        );

        // Another cron/process already handled it
        if (!lockedInvestment) {
          console.log(
            `⚠️ Investment already processed: ${investment._id}`
          );

          continue;
        }

        // --------------------------------------------------
        // 5. Calculate payout
        // --------------------------------------------------
        const principal = Number(investment.amount) || 0;
        const profit = Number(investment.profit) || 0;

        const totalPayout = principal + profit;

        // --------------------------------------------------
        // 6. Credit wallet
        // --------------------------------------------------
        user.balance = (Number(user.balance) || 0) + totalPayout;

        user.totalProfitEarned =
          (Number(user.totalProfitEarned) || 0) + profit;

        await user.save();

        // --------------------------------------------------
        // 7. Principal transaction
        // --------------------------------------------------
        await Transaction.create({
          user: user._id,
          type: "investment",
          amount: principal,
          status: "completed",
          reference: randomUUID(),
          description: `Principal returned from ${investment.package.name}`,
        });

        // --------------------------------------------------
        // 8. Profit transaction
        // --------------------------------------------------
        await Transaction.create({
          user: user._id,
          type: "profit",
          amount: profit,
          status: "completed",
          reference: randomUUID(),
          description: `Profit from ${investment.package.name}`,
        });

        // --------------------------------------------------
        // 9. Send email
        // --------------------------------------------------
        sendEmail(
          user.email,
          "Investment Completed Successfully",
          `
          <h2>Investment Completed</h2>

          <p>Hello <strong>${user.fullName}</strong>,</p>

          <p>Your investment has matured successfully.</p>

          <p>
            <strong>Package:</strong>
            ${investment.package.name}
          </p>

          <p>
            <strong>Capital:</strong>
            KES ${principal.toLocaleString()}
          </p>

          <p>
            <strong>Profit:</strong>
            KES ${profit.toLocaleString()}
          </p>

          <p>
            <strong>Total Payout:</strong>
            KES ${totalPayout.toLocaleString()}
          </p>

          <p>
            <strong>Wallet Balance:</strong>
            KES ${Number(user.balance).toLocaleString()}
          </p>

          <br>

          <p>
            Thank you for investing with Veran Enterprise.
          </p>
          `
        ).catch((err) => {
          console.error(
            `📧 Email failed for ${user.email}:`,
            err.message
          );
        });

        // --------------------------------------------------
        // 10. Success log
        // --------------------------------------------------
        console.log(
          `✅ ${user.fullName} credited KES ${totalPayout.toLocaleString()}`
        );

        console.log(
          `📦 Package: ${investment.package.name}`
        );

        console.log(
          `💰 Profit: KES ${profit.toLocaleString()}`
        );

      } catch (err) {
        console.error(
          `❌ Error processing investment ${investment._id}:`,
          err.message
        );
      }
    }

    console.log("✅ Investment Cron cycle completed.");

  } catch (err) {
    console.error(
      "❌ Investment Cron Error:",
      err.message
    );
  }
});