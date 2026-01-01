import notificationModel from "../model/notifications.model.js";

const viewNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await notificationModel
      .find({ to: userId })
      .populate("from", "username profileImg ")
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
  } catch (error) {
    console.error(error);
  }
};

const markNotificationRead = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await notificationModel.findOneAndDelete({
      id,
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
