// const cron = require("node-cron");
// const Investment = require("../models/Investment");
// const User = require("../models/User");
// const Transaction = require("../models/Transaction");
// const sendEmail = require("../utils/sendEmail");

// console.log("✅ Investment Cron Started...");

// // Every minute (testing)
// // Production: 0 0 * * *
// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();

//     const investments = await Investment.find({
//       status: "active",
//       endDate: { $lte: now },
//     }).populate("package");

//     if (!investments.length) {
//       console.log("Investment Cron: No completed investments.");
//       return;
//     }

//     for (const investment of investments) {
//       try {
//         const user = await User.findById(investment.user);

//         if (!user) {
//           console.log(`User not found for ${investment._id}`);
//           continue;
//         }

//         // Prevent duplicate processing
//         investment.status = "completed";
//         await investment.save();

//         // Return principal + profit
//         user.balance += investment.amount + investment.profit;
//         await user.save();

//         // emails
//         await sendEmail(
//   user.email,
//   "Investment Completed Successfully",
//   `
//     <h2>Congratulations!</h2>

//     <p>Hello <strong>${user.fullName}</strong>,</p>

//     <p>Your investment has matured successfully.</p>

//     <table border="1" cellpadding="8">
//       <tr>
//         <td><strong>Package</strong></td>
//         <td>${investment.package?.name || "Investment"}</td>
//       </tr>

//       <tr>
//         <td><strong>Capital Returned</strong></td>
//         <td>KES ${investment.amount.toLocaleString()}</td>
//       </tr>

//       <tr>
//         <td><strong>Profit Earned</strong></td>
//         <td>KES ${investment.profit.toLocaleString()}</td>
//       </tr>

//       <tr>
//         <td><strong>Total Credited</strong></td>
//         <td>KES ${(investment.amount + investment.profit).toLocaleString()}</td>
//       </tr>

//       <tr>
//         <td><strong>Wallet Balance</strong></td>
//         <td>KES ${user.balance.toLocaleString()}</td>
//       </tr>
//     </table>

//     <br>

//     <p>Your wallet has been credited automatically.</p>

//     <p>Thank you for investing with Veran Investment.</p>
//   `
// );

//         // Principal transaction
//         await Transaction.create({
//           user: user._id,
//           type: "investment",
//           amount: investment.amount,
//           status: "completed",
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
//           description: `Profit from ${
//             investment.package?.name || "Investment"
//           }`,
//         });

//         console.log(
//           `✔ ${user.fullName} received KES ${investment.amount} principal and KES ${investment.profit} profit`
//         );
//       } catch (err) {
//         console.log(
//           `Error processing investment ${investment._id}`,
//           err.message
//         );
//       }
//     }

//     console.log(
//       `Investment Cron: ${investments.length} investment(s) processed`
//     );
//   } catch (err) {
//     console.error("Investment Cron Error:", err);
//   }
// });

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
        const user = await User.findById(investment.user);

        if (!user) {
          console.log(`❌ User not found for investment ${investment._id}`);
          continue;
        }

        // Prevent duplicate processing
        investment.status = "completed";
        await investment.save();

        // Return principal + profit
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
          description: `Principal returned from ${
            investment.package?.name || "Investment"
          }`,
        });

        // Profit transaction
        await Transaction.create({
          user: user._id,
          type: "profit",
          amount: investment.profit,
          status: "completed",
          reference: randomUUID(),
          description: `Profit from ${
            investment.package?.name || "Investment"
          }`,
        });

        // Email notification
        await sendEmail(
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
                <td>${investment.package?.name || "Investment"}</td>
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
                <td><strong>Current Wallet Balance</strong></td>
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
        );

        console.log(
          `✔ ${user.fullName} credited KES ${totalPayout.toLocaleString()}`
        );

      } catch (err) {
        console.log(
          `❌ Error processing investment ${investment._id}:`,
          err.message
        );
      }
    }

    console.log(
      `✅ Investment Cron: ${investments.length} investment(s) processed.`
    );

  } catch (err) {
    console.error("Investment Cron Error:", err);
  }
});