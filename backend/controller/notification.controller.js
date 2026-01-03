import notificationModel from "../model/notifications.model.js";

const viewNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await notificationModel
      .find({ to: userId })
      .populate("from", "username fullname profileImg ")
      .populate("postId", "content image")
      .sort({ createdAt: -1 });

    if (!notifications)
      return res
        .status(404)
        .json({ success: false, message: "No notifications to show" });

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error in viewNotifications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const markAllNotificationRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const marked = await notificationModel.updateMany(
      {
        to: userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );
    if (marked.matchedCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "No unread notifications found" });
    res.status(200).json({ success: true, marked });
  } catch (error) {
    console.error("markAllNotificationsAsRead error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const marked = await notificationModel.findOneAndUpdate(
      {
        _id: id,
        to: userId,
      },
      {
        isRead: true,
      },
      { new: true }
    );

    if (!marked)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    res.status(200).json({ success: true, marked });
  } catch (error) {
    console.error("markNotificationAsRead error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await notificationModel.findOneAndDelete({
      _id: id,
      to: userId,
    });

    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "notification not found" });

    return res.status(200).json({
      success: true,
      message: "notification got deleted successfully ",
    });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteAllNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    const notification = await notificationModel.deleteMany({ to: userId });
    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "notification not found" });

    return res.status(200).json({
      success: true,
      message: "notification got deleted successfully ",
    });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export {
  viewNotification,
  deleteNotification,
  deleteAllNotification,
  markAllNotificationRead,
  markNotificationRead,
};
