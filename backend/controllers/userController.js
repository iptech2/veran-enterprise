const User = require("../models/User");
const bcrypt = require("bcryptjs");

/*
=================================
GET PROFILE
=================================
*/
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
=================================
UPDATE PROFILE
=================================
*/
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent duplicate email
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });

      if (exists) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }

      user.email = email;
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/*
=================================
CHANGE PASSWORD
=================================
*/
exports.changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};