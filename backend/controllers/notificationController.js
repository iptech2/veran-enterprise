const Notification = require("../models/Notification");

/*
=================================
GET USER NOTIFICATIONS
=================================
*/
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
=================================
GET UNREAD COUNT
=================================
*/
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.json({
      success: true,
      unread: count,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
=================================
MARK ONE AS READ
=================================
*/
exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read.",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
=================================
MARK ALL AS READ
=================================
*/
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
      message: "All notifications marked as read.",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
=================================
DELETE ONE NOTIFICATION
=================================
*/
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully.",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
=================================
DELETE ALL NOTIFICATIONS
=================================
*/
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user.id,
    });

    res.json({
      success: true,
      message: "All notifications deleted successfully.",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};