const User = require("../models/User");

exports.getReferralStats = async (req, res) => {
  try {
    // Top referrers sorted by earnings
    const users = await User.find({
      referralCount: { $gt: 0 },
    })
      .select(
        "fullName email referralCode referralCount referralEarnings"
      )
      .sort({ referralEarnings: -1 });

    // Users who were referred
    const referredUsers = await User.find({
      referredBy: { $ne: null },
    })
      .populate("referredBy", "fullName email")
      .select(
        "fullName email referredBy createdAt"
      )
      .sort({ createdAt: -1 });

    // Totals
    const totalCommission = users.reduce(
      (sum, user) => sum + (user.referralEarnings || 0),
      0
    );

    const totalReferrals = users.reduce(
      (sum, user) => sum + (user.referralCount || 0),
      0
    );

    res.json({
      totalCommission,
      totalReferrals,
      topReferrers: users,
      referredUsers,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};