const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const completeInvestments = async () => {
  try {
    const investments = await Investment.find({
      status: "active",
      endDate: { $lte: new Date() },
    });

    for (const investment of investments) {
      investment.status = "completed";
      await investment.save();

      const user = await User.findById(investment.user);

      if (user) {
        user.balance += investment.amount + investment.profit;
        await user.save();

        await Transaction.create({
          user: user._id,
          type: "profit",
          amount: investment.profit,
          status: "completed",
          description: `Profit from investment`,
        });

        await Transaction.create({
          user: user._id,
          type: "capital",
          amount: investment.amount,
          status: "completed",
          description: `Capital returned`,
        });
      }
    }

    console.log(`${investments.length} investments completed`);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = completeInvestments;