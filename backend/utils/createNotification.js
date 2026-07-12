const Notification = require("../models/Notification");

const createNotification = async (
  user,
  title,
  message,
  type = "system"
) => {
  try {
    await Notification.create({
      user,
      title,
      message,
      type,
    });
  } catch (err) {
    console.log("Notification Error:", err.message);
  }
};

module.exports = createNotification;