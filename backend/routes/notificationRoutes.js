const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);

router.get("/unread", protect, getUnreadCount);

router.put("/read-all", protect, markAllRead);

router.put("/:id/read", protect, markRead);

router.delete("/clear", protect, deleteAllNotifications);

router.delete("/:id", protect, deleteNotification);

module.exports = router;