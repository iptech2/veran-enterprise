
// const cron = require("node-cron");
// const { randomUUID } = require("crypto");

// const Investment = require("../models/Investment");
// const User = require("../models/User");
// const Transaction = require("../models/Transaction");
// const sendEmail = require("../utils/sendEmail");

// console.log("✅ Investment Cron Started...");

// // Testing: every minute
// // Production: 0 0 * * *
// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();

//     // =====================================================
//     // PART 1: PROCESS LOCKED-PROFIT INVESTMENTS
//     // =====================================================

//     const lockedProfitInvestments =
//       await Investment.find({
//         status: "active",
//         principalLocked: true,
//       }).populate("package");

//     for (const investment of lockedProfitInvestments) {
//       try {
//         if (!investment.package) {
//           continue;
//         }

//         // =================================================
//         // ONLY PROCESS LOCKED-PROFIT PACKAGES
//         // =================================================

//               // const investmentType =
//               //   investment.package.investmentType ===
//               //   "locked_profit"
//               //     ? "locked_profit"
//               //     : "standard";

//               // if (investmentType !== "locked_profit") {
//               //   continue;
//               // }
//               const isLockedProfit =
//             investment.package.investmentType ===
//             "locked_profit";

//              if (!isLockedProfit) {
//                  continue;
//                    }

//         const startDate = new Date(
//           investment.startDate
//         );

//         const endDate = new Date(
//           investment.endDate
//         );

//         // =================================================
//         // CALCULATE COMPLETED DAYS
//         // =================================================

//         const elapsedMilliseconds =
//           now.getTime() -
//           startDate.getTime();

//         let completedDays = Math.floor(
//           elapsedMilliseconds /
//             (1000 * 60 * 60 * 24)
//         );

//         completedDays = Math.max(
//           0,
//           Math.min(
//             completedDays,
//             Number(investment.duration)
//           )
//         );

//         // =================================================
//         // CALCULATE PROFIT EARNED
//         // =================================================

//         const dailyProfit =
//           Number(investment.dailyProfit) || 0;

//         const totalProfit =
//           Number(investment.profit) || 0;

//         const earnedProfit = Math.min(
//           dailyProfit * completedDays,
//           totalProfit
//         );

//         investment.daysCompleted =
//           completedDays;

//         investment.profitEarned =
//           Number(
//             earnedProfit.toFixed(2)
//           );

//         // =================================================
//         // GET PACKAGE WITHDRAWAL CHECKPOINTS
//         // =================================================

//         let withdrawalDays =
//           Array.isArray(
//             investment.package.profitWithdrawalDays
//           )
//             ? investment.package.profitWithdrawalDays
//                 .map(Number)
//                 .filter(
//                   (day) =>
//                     !isNaN(day) &&
//                     day > 0 &&
//                     day <=
//                       Number(
//                         investment.duration
//                       )
//                 )
//                 .sort((a, b) => a - b)
//             : [];

//         // Fallback for locked-profit packages
//         // created before the new configuration existed.
//         if (withdrawalDays.length === 0) {
//           withdrawalDays = [
//             10,
//             20,
//             30,
//           ].filter(
//             (day) =>
//               day <=
//               Number(investment.duration)
//           );
//         }

//         // =================================================
//         // FIND LATEST REACHED CHECKPOINT
//         // =================================================

//         let reachedCheckpoint = 0;

//         for (const day of withdrawalDays) {
//           if (completedDays >= day) {
//             reachedCheckpoint = day;
//           }
//         }

//         // =================================================
//         // MAKE ACCUMULATED PROFIT AVAILABLE
//         // =================================================

//         if (reachedCheckpoint > 0) {
//           const alreadyWithdrawn =
//             Number(
//               investment.profitWithdrawn || 0
//             );

//           const availableProfit =
//             Math.max(
//               0,
//               earnedProfit -
//                 alreadyWithdrawn
//             );

//           investment.profitAvailable =
//             Number(
//               availableProfit.toFixed(2)
//             );

//           // Find the next checkpoint after
//           // the latest reached checkpoint.
//           const nextCheckpoint =
//             withdrawalDays.find(
//               (day) =>
//                 day >
//                 reachedCheckpoint
//             );

//           investment.nextProfitWithdrawalDay =
//             nextCheckpoint || 0;
//         }

//         // =================================================
//         // DAY OF MATURITY
//         // =================================================

//         if (
//           completedDays >=
//             Number(investment.duration) ||
//           now >= endDate
//         ) {
//           investment.daysCompleted =
//             Number(investment.duration);

//           investment.profitEarned =
//             Number(
//               totalProfit.toFixed(2)
//             );

//           const alreadyWithdrawn =
//             Number(
//               investment.profitWithdrawn || 0
//             );

//           investment.profitAvailable =
//             Number(
//               Math.max(
//                 0,
//                 totalProfit -
//                   alreadyWithdrawn
//               ).toFixed(2)
//             );

//           investment.status =
//             "completed";

//           // IMPORTANT:
//           // Locked-profit principal NEVER
//           // returns to the wallet.
//           investment.principalLocked =
//             true;

//           investment.nextProfitWithdrawalDay =
//             0;
//         }

//         await investment.save();

//         console.log(
//           `📈 Locked Profit ${investment._id}: Day ${completedDays}/${investment.duration} | Profit earned: KES ${investment.profitEarned} | Available: KES ${investment.profitAvailable}`
//         );
//       } catch (err) {
//         console.error(
//           `❌ Locked-profit processing error ${investment._id}:`,
//           err.message
//         );
//       }
//     }

//     // =====================================================
//     // PART 2: EXISTING NORMAL INVESTMENT MATURITY
//     // =====================================================

//     // IMPORTANT:
//     // Existing standard packages keep their
//     // original maturity behavior.
//     //
//     // Principal + profit -> wallet

//     const investments =
//       await Investment.find({
//         status: "active",
//         endDate: { $lte: now },

//         // Exclude locked principal investments
//         $or: [
//           {
//             principalLocked: {
//               $ne: true,
//             },
//           },
//           {
//             principalLocked: {
//               $exists: false,
//             },
//           },
//         ],
//       })
//         .populate("package")
//         .limit(10);

//     if (investments.length === 0) {
//       console.log(
//         "Investment Cron: No matured normal investments."
//       );

//       return;
//     }

//     console.log(
//       `🔄 Processing ${investments.length} matured normal investment(s)...`
//     );

//     for (const investment of investments) {
//       try {
//         // =================================================
//         // 1. VALIDATE PACKAGE
//         // =================================================

//         if (!investment.package) {
//           console.log(
//             `❌ Missing package: ${investment._id}`
//           );

//           investment.status =
//             "completed";

//           await investment.save();

//           continue;
//         }

//         // =================================================
//         // 2. VALIDATE ROI / PROFIT
//         // =================================================

//         if (
//           investment.roi == null ||
//           investment.profit == null ||
//           Number(investment.profit) < 0
//         ) {
//           console.log(
//             `❌ Invalid ROI/profit: ${investment._id}`
//           );

//           investment.status =
//             "completed";

//           await investment.save();

//           continue;
//         }

//         // =================================================
//         // 3. FIND USER
//         // =================================================

//         const user =
//           await User.findById(
//             investment.user
//           );

//         if (!user) {
//           console.log(
//             `❌ Missing user: ${investment._id}`
//           );

//           investment.status =
//             "completed";

//           await investment.save();

//           continue;
//         }

//         // =================================================
//         // 4. PREVENT DUPLICATE PROCESSING
//         // =================================================

//         const lockedInvestment =
//           await Investment.findOneAndUpdate(
//             {
//               _id: investment._id,

//               status: "active",

//               endDate: {
//                 $lte: now,
//               },

//               $or: [
//                 {
//                   principalLocked: {
//                     $ne: true,
//                   },
//                 },
//                 {
//                   principalLocked: {
//                     $exists: false,
//                   },
//                 },
//               ],
//             },
//             {
//               $set: {
//                 status: "completed",
//               },
//             },
//             {
//               new: true,
//             }
//           );

//         if (!lockedInvestment) {
//           console.log(
//             `⚠️ Investment already processed: ${investment._id}`
//           );

//           continue;
//         }

//         // =================================================
//         // 5. CALCULATE PAYOUT
//         // =================================================

//         const principal =
//           Number(investment.amount) || 0;

//         const profit =
//           Number(investment.profit) || 0;

//         const totalPayout =
//           principal + profit;

//         // =================================================
//         // 6. CREDIT WALLET
//         // =================================================

//         user.balance =
//           (Number(user.balance) || 0) +
//           totalPayout;

//         user.totalProfitEarned =
//           (Number(
//             user.totalProfitEarned
//           ) || 0) + profit;

//         await user.save();

//         // =================================================
//         // 7. PRINCIPAL TRANSACTION
//         // =================================================

//         await Transaction.create({
//           user: user._id,

//           type: "investment",

//           amount: principal,

//           status: "completed",

//           reference: randomUUID(),

//           description:
//             `Principal returned from ${investment.package.name}`,
//         });

//         // =================================================
//         // 8. PROFIT TRANSACTION
//         // =================================================

//         await Transaction.create({
//           user: user._id,

//           type: "profit",

//           amount: profit,

//           status: "completed",

//           reference: randomUUID(),

//           description:
//             `Profit from ${investment.package.name}`,
//         });

//         // =================================================
//         // 9. SEND EMAIL
//         // =================================================

//         sendEmail(
//           user.email,
//           "Investment Completed Successfully",
//           `
//           <h2>Investment Completed</h2>

//           <p>Hello <strong>${user.fullName}</strong>,</p>

//           <p>Your investment has matured successfully.</p>

//           <p>
//             <strong>Package:</strong>
//             ${investment.package.name}
//           </p>

//           <p>
//             <strong>Capital:</strong>
//             KES ${principal.toLocaleString()}
//           </p>

//           <p>
//             <strong>Profit:</strong>
//             KES ${profit.toLocaleString()}
//           </p>

//           <p>
//             <strong>Total Payout:</strong>
//             KES ${totalPayout.toLocaleString()}
//           </p>

//           <p>
//             <strong>Wallet Balance:</strong>
//             KES ${Number(
//               user.balance
//             ).toLocaleString()}
//           </p>

//           <br>

//           <p>
//             Thank you for investing with Veran Enterprise.
//           </p>
//           `
//         ).catch((err) => {
//           console.error(
//             `📧 Email failed for ${user.email}:`,
//             err.message
//           );
//         });

//         // =================================================
//         // 10. SUCCESS LOG
//         // =================================================

//         console.log(
//           `✅ ${user.fullName} credited KES ${totalPayout.toLocaleString()}`
//         );

//         console.log(
//           `📦 Package: ${investment.package.name}`
//         );

//         console.log(
//           `💰 Profit: KES ${profit.toLocaleString()}`
//         );
//       } catch (err) {
//         console.error(
//           `❌ Error processing investment ${investment._id}:`,
//           err.message
//         );
//       }
//     }

//     console.log(
//       "✅ Investment Cron cycle completed."
//     );
//   } catch (err) {
//     console.error(
//       "❌ Investment Cron Error:",
//       err.message
//     );
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

    // =====================================================
    // PART 1: PROCESS LOCKED-PROFIT INVESTMENTS
    // =====================================================

    const lockedProfitInvestments =
      await Investment.find({
        status: "active",
        principalLocked: true,
      }).populate("package");

    for (const investment of lockedProfitInvestments) {
      try {
        if (!investment.package) {
          continue;
        }

        // =================================================
        // ONLY PROCESS LOCKED-PROFIT PACKAGES
        // =================================================

        const isLockedProfit =
          investment.package.investmentType ===
          "locked_profit";

        if (!isLockedProfit) {
          continue;
        }

        const startDate = new Date(
          investment.startDate
        );

        const endDate = new Date(
          investment.endDate
        );

        // =================================================
        // CALCULATE COMPLETED DAYS
        // =================================================

        const elapsedMilliseconds =
          now.getTime() -
          startDate.getTime();

        let completedDays = Math.floor(
          elapsedMilliseconds /
            (1000 * 60 * 60 * 24)
        );

        completedDays = Math.max(
          0,
          Math.min(
            completedDays,
            Number(investment.duration)
          )
        );

        // =================================================
        // CALCULATE PROFIT EARNED
        // =================================================

        const dailyProfit =
          Number(investment.dailyProfit) || 0;

        const totalProfit =
          Number(investment.profit) || 0;

        const earnedProfit = Math.min(
          dailyProfit * completedDays,
          totalProfit
        );

        investment.daysCompleted =
          completedDays;

        investment.profitEarned =
          Number(
            earnedProfit.toFixed(2)
          );

        // =================================================
        // GET PACKAGE WITHDRAWAL CHECKPOINTS
        // =================================================

        let withdrawalDays =
          Array.isArray(
            investment.package.profitWithdrawalDays
          )
            ? investment.package.profitWithdrawalDays
                .map(Number)
                .filter(
                  (day) =>
                    !isNaN(day) &&
                    day > 0 &&
                    day <=
                      Number(
                        investment.duration
                      )
                )
                .sort((a, b) => a - b)
            : [];

        // Fallback for older locked-profit packages
        if (withdrawalDays.length === 0) {
          withdrawalDays = [
            10,
            20,
            30,
          ].filter(
            (day) =>
              day <=
              Number(investment.duration)
          );
        }

        // =================================================
        // FIND LATEST REACHED CHECKPOINT
        // =================================================

        let reachedCheckpoint = 0;

        for (const day of withdrawalDays) {
          if (completedDays >= day) {
            reachedCheckpoint = day;
          }
        }

        // =================================================
        // MAKE ACCUMULATED PROFIT AVAILABLE
        // =================================================

        if (reachedCheckpoint > 0) {
          const alreadyWithdrawn =
            Number(
              investment.profitWithdrawn || 0
            );

          const availableProfit =
            Math.max(
              0,
              earnedProfit -
                alreadyWithdrawn
            );

          investment.profitAvailable =
            Number(
              availableProfit.toFixed(2)
            );

          // Find next checkpoint
          const nextCheckpoint =
            withdrawalDays.find(
              (day) =>
                day >
                reachedCheckpoint
            );

          investment.nextProfitWithdrawalDay =
            nextCheckpoint || 0;
        }

        // =================================================
        // DAY OF MATURITY
        // =================================================

        if (
          completedDays >=
            Number(investment.duration) ||
          now >= endDate
        ) {
          // -----------------------------------------------
          // COMPLETE INVESTMENT
          // -----------------------------------------------

          investment.daysCompleted =
            Number(investment.duration);

          investment.profitEarned =
            Number(
              totalProfit.toFixed(2)
            );

          const alreadyWithdrawn =
            Number(
              investment.profitWithdrawn || 0
            );

          investment.profitAvailable =
            Number(
              Math.max(
                0,
                totalProfit -
                  alreadyWithdrawn
              ).toFixed(2)
            );

          // -----------------------------------------------
          // FIND USER
          // -----------------------------------------------

          const user =
            await User.findById(
              investment.user
            );

          if (!user) {
            console.log(
              `❌ User not found for locked investment: ${investment._id}`
            );

            continue;
          }

          // -----------------------------------------------
          // RETURN PRINCIPAL TO WALLET
          // -----------------------------------------------

          const principal =
            Number(investment.amount) || 0;

          // IMPORTANT:
          // principalLocked === true means the principal
          // has not yet been released.
          //
          // We return it exactly once here.

          user.balance =
            (Number(user.balance) || 0) +
            principal;

          await user.save();

          // -----------------------------------------------
          // CREATE PRINCIPAL TRANSACTION
          // -----------------------------------------------

          await Transaction.create({
            user: user._id,

            type: "investment",

            amount: principal,

            status: "completed",

            reference: randomUUID(),

            description:
              `Principal returned from ${investment.package.name} after maturity`,
          });

          // -----------------------------------------------
          // UNLOCK PRINCIPAL
          // -----------------------------------------------

          investment.principalLocked =
            false;

          investment.status =
            "completed";

          investment.nextProfitWithdrawalDay =
            0;

          await investment.save();

          // -----------------------------------------------
          // SEND MATURITY EMAIL
          // -----------------------------------------------

          sendEmail(
            user.email,
            "Investment Completed Successfully",
            `
            <h2>Investment Completed</h2>

            <p>
              Hello <strong>${user.fullName}</strong>,
            </p>

            <p>
              Your locked-profit investment has
              matured successfully.
            </p>

            <p>
              <strong>Package:</strong>
              ${investment.package.name}
            </p>

            <p>
              <strong>Principal Returned:</strong>
              KES ${principal.toLocaleString()}
            </p>

            <p>
              <strong>Total Profit Earned:</strong>
              KES ${totalProfit.toLocaleString()}
            </p>

            <p>
              <strong>Profit Available:</strong>
              KES ${Number(
                investment.profitAvailable
              ).toLocaleString()}
            </p>

            <p>
              Your principal has been returned to
              your wallet and can now be used for
              another investment.
            </p>

            <p>
              <strong>Wallet Balance:</strong>
              KES ${Number(
                user.balance
              ).toLocaleString()}
            </p>

            <br>

            <p>
              Thank you for investing with
              Veran Enterprise.
            </p>
            `
          ).catch((err) => {
            console.error(
              `📧 Email failed for ${user.email}:`,
              err.message
            );
          });

          // -----------------------------------------------
          // SUCCESS LOGS
          // -----------------------------------------------

          console.log(
            `✅ Locked-profit investment completed: ${investment._id}`
          );

          console.log(
            `👤 User: ${user.fullName}`
          );

          console.log(
            `📦 Package: ${investment.package.name}`
          );

          console.log(
            `🔓 Principal returned: KES ${principal.toLocaleString()}`
          );

          console.log(
            `💰 Total profit earned: KES ${totalProfit.toLocaleString()}`
          );

          console.log(
            `💵 Profit available: KES ${Number(
              investment.profitAvailable
            ).toLocaleString()}`
          );

          console.log(
            `💳 New wallet balance: KES ${Number(
              user.balance
            ).toLocaleString()}`
          );

          continue;
        }

        // =================================================
        // SAVE ACTIVE LOCKED-PROFIT INVESTMENT
        // =================================================

        await investment.save();

        console.log(
          `📈 Locked Profit ${investment._id}: Day ${completedDays}/${investment.duration} | Profit earned: KES ${investment.profitEarned} | Available: KES ${investment.profitAvailable}`
        );
      } catch (err) {
        console.error(
          `❌ Locked-profit processing error ${investment._id}:`,
          err.message
        );
      }
    }

    // =====================================================
    // PART 2: EXISTING NORMAL INVESTMENT MATURITY
    // =====================================================

    // Standard packages keep their original behavior:
    //
    // Principal + profit -> wallet
    //
    // Locked-profit investments are excluded above because
    // they are processed separately.

    const investments =
      await Investment.find({
        status: "active",
        endDate: { $lte: now },

        $or: [
          {
            principalLocked: {
              $ne: true,
            },
          },
          {
            principalLocked: {
              $exists: false,
            },
          },
        ],
      })
        .populate("package")
        .limit(10);

    if (investments.length === 0) {
      console.log(
        "Investment Cron: No matured normal investments."
      );

      return;
    }

    console.log(
      `🔄 Processing ${investments.length} matured normal investment(s)...`
    );

    for (const investment of investments) {
      try {
        // =================================================
        // 1. VALIDATE PACKAGE
        // =================================================

        if (!investment.package) {
          console.log(
            `❌ Missing package: ${investment._id}`
          );

          investment.status =
            "completed";

          await investment.save();

          continue;
        }

        // =================================================
        // 2. VALIDATE ROI / PROFIT
        // =================================================

        if (
          investment.roi == null ||
          investment.profit == null ||
          Number(investment.profit) < 0
        ) {
          console.log(
            `❌ Invalid ROI/profit: ${investment._id}`
          );

          investment.status =
            "completed";

          await investment.save();

          continue;
        }

        // =================================================
        // 3. FIND USER
        // =================================================

        const user =
          await User.findById(
            investment.user
          );

        if (!user) {
          console.log(
            `❌ Missing user: ${investment._id}`
          );

          investment.status =
            "completed";

          await investment.save();

          continue;
        }

        // =================================================
        // 4. PREVENT DUPLICATE PROCESSING
        // =================================================

        const lockedInvestment =
          await Investment.findOneAndUpdate(
            {
              _id: investment._id,

              status: "active",

              endDate: {
                $lte: now,
              },

              $or: [
                {
                  principalLocked: {
                    $ne: true,
                  },
                },
                {
                  principalLocked: {
                    $exists: false,
                  },
                },
              ],
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

        if (!lockedInvestment) {
          console.log(
            `⚠️ Investment already processed: ${investment._id}`
          );

          continue;
        }

        // =================================================
        // 5. CALCULATE PAYOUT
        // =================================================

        const principal =
          Number(investment.amount) || 0;

        const profit =
          Number(investment.profit) || 0;

        const totalPayout =
          principal + profit;

        // =================================================
        // 6. CREDIT WALLET
        // =================================================

        user.balance =
          (Number(user.balance) || 0) +
          totalPayout;

        user.totalProfitEarned =
          (Number(
            user.totalProfitEarned
          ) || 0) + profit;

        await user.save();

        // =================================================
        // 7. PRINCIPAL TRANSACTION
        // =================================================

        await Transaction.create({
          user: user._id,

          type: "investment",

          amount: principal,

          status: "completed",

          reference: randomUUID(),

          description:
            `Principal returned from ${investment.package.name}`,
        });

        // =================================================
        // 8. PROFIT TRANSACTION
        // =================================================

        await Transaction.create({
          user: user._id,

          type: "profit",

          amount: profit,

          status: "completed",

          reference: randomUUID(),

          description:
            `Profit from ${investment.package.name}`,
        });

        // =================================================
        // 9. SEND EMAIL
        // =================================================

        sendEmail(
          user.email,
          "Investment Completed Successfully",
          `
          <h2>Investment Completed</h2>

          <p>
            Hello <strong>${user.fullName}</strong>,
          </p>

          <p>
            Your investment has matured successfully.
          </p>

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
            KES ${Number(
              user.balance
            ).toLocaleString()}
          </p>

          <br>

          <p>
            Thank you for investing with
            Veran Enterprise.
          </p>
          `
        ).catch((err) => {
          console.error(
            `📧 Email failed for ${user.email}:`,
            err.message
          );
        });

        // =================================================
        // 10. SUCCESS LOG
        // =================================================

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

    console.log(
      "✅ Investment Cron cycle completed."
    );
  } catch (err) {
    console.error(
      "❌ Investment Cron Error:",
      err.message
    );
  }
});