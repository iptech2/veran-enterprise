
// const cron = require("node-cron");
// const { randomUUID } = require("crypto");

// const Investment = require("../models/Investment");
// const User = require("../models/User");
// const Transaction = require("../models/Transaction");
// const sendEmail = require("../utils/sendEmail");

// console.log("✅ Investment Cron Started...");

// // Every minute (Testing)
// // Production: 0 0 * * *
// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();

//     const investments = await Investment.find({
//       status: "active",
//       endDate: { $lte: now },
//     }).populate("package");

//     if (!investments.length) {
//       console.log("Investment Cron: No matured investments.");
//       return;
//     }

//     for (const investment of investments) {
//       try {
//         const user = await User.findById(investment.user);

//         if (!user) {
//           console.log(`❌ User not found for investment ${investment._id}`);
//           continue;
//         }

//         // Prevent duplicate processing
//         investment.status = "completed";
//         await investment.save();

//         // Return principal + profit
//         const totalPayout =
//           investment.amount + investment.profit;

//         user.balance += totalPayout;

//         await user.save();

//         // Principal transaction
//         await Transaction.create({
//           user: user._id,
//           type: "investment",
//           amount: investment.amount,
//           status: "completed",
//           reference: randomUUID(),
//           description: `Principal returned from ${
//             investment.package?.name || "Investment"
//           }`,
//         });

//         // Profit transaction
//         await Transaction.create({
//           user: user._id,
//           type: "profit",
//           amount: investment.profit,
//           status: "completed",
//           reference: randomUUID(),
//           description: `Profit from ${
//             investment.package?.name || "Investment"
//           }`,
//         });

//         // Email notification
//         await sendEmail(
//           user.email,
//           "Investment Completed Successfully",
//           `
//             <h2>🎉 Investment Completed</h2>

//             <p>Hello <strong>${user.fullName}</strong>,</p>

//             <p>
//               Congratulations! Your investment has matured successfully.
//             </p>

//             <table border="1" cellpadding="8" cellspacing="0">

//               <tr>
//                 <td><strong>Package</strong></td>
//                 <td>${investment.package?.name || "Investment"}</td>
//               </tr>

//               <tr>
//                 <td><strong>Capital Returned</strong></td>
//                 <td>KES ${investment.amount.toLocaleString()}</td>
//               </tr>

//               <tr>
//                 <td><strong>Profit Earned</strong></td>
//                 <td>KES ${investment.profit.toLocaleString()}</td>
//               </tr>

//               <tr>
//                 <td><strong>Total Credited</strong></td>
//                 <td>KES ${totalPayout.toLocaleString()}</td>
//               </tr>

//               <tr>
//                 <td><strong>Current Wallet Balance</strong></td>
//                 <td>KES ${user.balance.toLocaleString()}</td>
//               </tr>

//             </table>

//             <br>

//             <p>
//               The funds have been credited automatically to your wallet.
//             </p>

//             <br>

//             <p>
//               Thank you for investing with
//               <strong> Veran Investment Platform.</strong>
//             </p>
//           `
//         );

//         console.log(
//           `✔ ${user.fullName} credited KES ${totalPayout.toLocaleString()}`
//         );

//       } catch (err) {
//         console.log(
//           `❌ Error processing investment ${investment._id}:`,
//           err.message
//         );
//       }
//     }

//     console.log(
//       `✅ Investment Cron: ${investments.length} investment(s) processed.`
//     );

//   } catch (err) {
//     console.error("Investment Cron Error:", err);
//   }
// });


// upadated 
const cron = require("node-cron");
const { randomUUID } = require("crypto");

const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const sendEmail = require("../utils/sendEmail");

console.log("✅ Investment Cron Started...");

// Every minute (Testing)
// Production: 0 0 * * *
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const investments = await Investment.find({
      status: "active",
      endDate: { $lte: now },
    }).populate("package");

    if (!investments.length) {
      console.log("Investment Cron: No matured investments.");
      return;
    }

    for (const investment of investments) {
      try {
        // Skip invalid package
        if (!investment.package) {
          console.log(
            `❌ Invalid package for investment ${investment._id}`
          );

          investment.status = "cancelled";
          await investment.save();

          continue;
        }

        // Skip invalid ROI / Profit
        if (
          investment.roi == null ||
          investment.profit == null
        ) {
          console.log(
            `❌ Invalid ROI/Profit for investment ${investment._id}`
          );

          investment.status = "cancelled";
          await investment.save();

          continue;
        }

        const user = await User.findById(investment.user);

        if (!user) {
          console.log(
            `❌ User not found for investment ${investment._id}`
          );

          investment.status = "cancelled";
          await investment.save();

          continue;
        }

        // Prevent duplicate processing
        investment.status = "completed";
        await investment.save();

        const totalPayout =
          investment.amount + investment.profit;

        user.balance += totalPayout;

        await user.save();

        // Principal transaction
        await Transaction.create({
          user: user._id,
          type: "investment",
          amount: investment.amount,
          status: "completed",
          reference: randomUUID(),
          description: `Principal returned from ${investment.package.name}`,
        });

        // Profit transaction
        await Transaction.create({
          user: user._id,
          type: "profit",
          amount: investment.profit,
          status: "completed",
          reference: randomUUID(),
          description: `Profit from ${investment.package.name}`,
        });

        // Send email without blocking cron
        sendEmail(
          user.email,
          "Investment Completed Successfully",
          `
          <h2>🎉 Investment Completed</h2>

          <p>Hello <strong>${user.fullName}</strong>,</p>

          <p>
            Congratulations! Your investment has matured successfully.
          </p>

          <table border="1" cellpadding="8" cellspacing="0">

            <tr>
              <td><strong>Package</strong></td>
              <td>${investment.package.name}</td>
            </tr>

            <tr>
              <td><strong>Capital Returned</strong></td>
              <td>KES ${investment.amount.toLocaleString()}</td>
            </tr>

            <tr>
              <td><strong>Profit Earned</strong></td>
              <td>KES ${investment.profit.toLocaleString()}</td>
            </tr>

            <tr>
              <td><strong>Total Credited</strong></td>
              <td>KES ${totalPayout.toLocaleString()}</td>
            </tr>

            <tr>
              <td><strong>Wallet Balance</strong></td>
              <td>KES ${user.balance.toLocaleString()}</td>
            </tr>

          </table>

          <br>

          <p>
            The funds have been credited automatically to your wallet.
          </p>

          <br>

          <p>
            Thank you for investing with
            <strong> Veran Investment Platform.</strong>
          </p>
          `
        ).catch((err) => {
          console.error(
            `❌ Investment completion email failed for ${user.email}:`,
            err.message
          );
        });

        console.log(
          `✔ ${user.fullName} credited KES ${totalPayout.toLocaleString()}`
        );

      } catch (err) {
        console.error(
          `❌ Error processing investment ${investment._id}:`,
          err.message
        );
      }
    }

    console.log(
      `✅ Investment Cron: ${investments.length} investment(s) processed.`
    );

  } catch (err) {
    console.error("❌ Investment Cron Error:", err.message);
  }
});

