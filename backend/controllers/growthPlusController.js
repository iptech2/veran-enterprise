// const Investment = require("../models/Investment");

// // =====================================================
// // PROCESS LOCKED-PROFIT INVESTMENTS
// // =====================================================
// // This controller updates profit earned and available
// // profit based on the package's configured checkpoints.
// //
// // IMPORTANT:
// // Reaching a checkpoint DOES NOT mean the user has
// // withdrawn the profit.
// // lastProfitWithdrawalDay is only updated when the
// // user actually withdraws.
// // =====================================================

// exports.processGrowthPlusInvestments = async () => {
//   try {
//     const investments =
//       await Investment.find({
//         status: "active",
//         principalLocked: true,
//       }).populate("package");

//     if (!investments.length) {
//       console.log(
//         "Locked Profit: No active investments found."
//       );

//       return;
//     }

//     const now = new Date();

//     for (const investment of investments) {
//       try {
//         if (!investment.package) {
//           continue;
//         }

//         // -------------------------------------------------
//         // Only process locked-profit packages
//         // -------------------------------------------------

//         const investmentType =
//           investment.package.investmentType ===
//           "locked_profit"
//             ? "locked_profit"
//             : "standard";

//         if (
//           investmentType !==
//           "locked_profit"
//         ) {
//           continue;
//         }

//         const startDate =
//           new Date(
//             investment.startDate
//           );

//         const endDate =
//           new Date(
//             investment.endDate
//           );

//         const duration =
//           Number(
//             investment.duration
//           ) || 0;

//         // -------------------------------------------------
//         // Calculate completed days
//         // -------------------------------------------------

//         const elapsedMilliseconds =
//           now.getTime() -
//           startDate.getTime();

//         let completedDays =
//           Math.floor(
//             elapsedMilliseconds /
//               (1000 * 60 * 60 * 24)
//           );

//         completedDays = Math.max(
//           0,
//           Math.min(
//             completedDays,
//             duration
//           )
//         );

//         // -------------------------------------------------
//         // Calculate earned profit
//         // -------------------------------------------------

//         const dailyProfit =
//           Number(
//             investment.dailyProfit
//           ) || 0;

//         const totalProfit =
//           Number(
//             investment.profit
//           ) || 0;

//         const calculatedProfit =
//           dailyProfit *
//           completedDays;

//         const earnedProfit =
//           Math.min(
//             calculatedProfit,
//             totalProfit
//           );

//         investment.daysCompleted =
//           completedDays;

//         investment.profitEarned =
//           Number(
//             earnedProfit.toFixed(2)
//           );

//         // -------------------------------------------------
//         // Get withdrawal checkpoints
//         // -------------------------------------------------

//         let withdrawalDays =
//           Array.isArray(
//             investment.package
//               .profitWithdrawalDays
//           )
//             ? investment.package
//                 .profitWithdrawalDays
//                 .map(Number)
//                 .filter(
//                   (day) =>
//                     !isNaN(day) &&
//                     day > 0 &&
//                     day <= duration
//                 )
//                 .sort(
//                   (a, b) => a - b
//                 )
//             : [];

//         // Fallback for older packages
//         if (
//           withdrawalDays.length ===
//           0
//         ) {
//           withdrawalDays = [
//             10,
//             20,
//             30,
//           ].filter(
//             (day) =>
//               day <= duration
//           );
//         }

//         // -------------------------------------------------
//         // Find latest reached checkpoint
//         // -------------------------------------------------

//         let reachedCheckpoint = 0;

//         for (const day of withdrawalDays) {
//           if (
//             completedDays >= day
//           ) {
//             reachedCheckpoint =
//               day;
//           }
//         }

//         // -------------------------------------------------
//         // Make profit available
//         // -------------------------------------------------
//         // IMPORTANT:
//         // We DO NOT change lastProfitWithdrawalDay here.
//         // The user must actually withdraw before that
//         // value changes.
//         // -------------------------------------------------

//         if (
//           reachedCheckpoint > 0
//         ) {
//           const alreadyWithdrawn =
//             Number(
//               investment
//                 .profitWithdrawn ||
//                 0
//             );

//           const availableProfit =
//             Math.max(
//               0,
//               earnedProfit -
//                 alreadyWithdrawn
//             );

//           investment.profitAvailable =
//             Number(
//               availableProfit.toFixed(
//                 2
//               )
//             );

//           // Find the next checkpoint
//           // after the checkpoint currently reached.
//           const nextCheckpoint =
//             withdrawalDays.find(
//               (day) =>
//                 day >
//                 reachedCheckpoint
//             );

//           investment.nextProfitWithdrawalDay =
//             nextCheckpoint || 0;
//         }

//         // -------------------------------------------------
//         // Investment completion
//         // -------------------------------------------------

//         if (
//           completedDays >= duration ||
//           now >= endDate
//         ) {
//           investment.daysCompleted =
//             duration;

//           investment.profitEarned =
//             Number(
//               totalProfit.toFixed(2)
//             );

//           const alreadyWithdrawn =
//             Number(
//               investment
//                 .profitWithdrawn ||
//                 0
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

//           // Principal remains permanently locked.
//           investment.principalLocked =
//             true;

//           investment.nextProfitWithdrawalDay =
//             0;
//         }

//         await investment.save();

//         console.log(
//           `📈 Locked Profit ${investment._id}: Day ${completedDays}/${duration} | Earned: KES ${investment.profitEarned} | Available: KES ${investment.profitAvailable}`
//         );
//       } catch (investmentError) {
//         console.error(
//           `❌ Locked-profit processing failed for investment ${investment._id}:`,
//           investmentError.message
//         );
//       }
//     }

//     console.log(
//       "✅ Locked-profit investments processed successfully."
//     );
//   } catch (error) {
//     console.error(
//       "❌ Locked-profit processor error:",
//       error.message
//     );
//   }
// };

