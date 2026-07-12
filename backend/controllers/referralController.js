const User = require("../models/User");

/* ===========================
   MY REFERRAL DASHBOARD
=========================== */

exports.getMyReferrals = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const referrals = await User.find({
      referredBy: req.user.id,
    }).select(
      "fullName email phone balance createdAt"
    );

    res.json({
      referralCode: user.referralCode || "",

      referralLink: user.referralCode
        ? `${process.env.CLIENT_URL}/register?ref=${user.referralCode}`
        : "",

      totalReferrals: referrals.length,

      referralEarnings: user.referralEarnings || 0,

      referrals,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};