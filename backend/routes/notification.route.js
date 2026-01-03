import express from "express";
import {
  viewNotification,
  deleteNotification,
  deleteAllNotification,
  markNotificationRead,
  markAllNotificationRead,
} from "../controller/notification.controller.js";
import auth from "../middleware/auth.js";

const notificationRouter = express.Router();

notificationRouter.get("/view", auth, viewNotification);
notificationRouter.get("/view/:id", auth, viewNotification);
notificationRouter.delete("/delete", auth, deleteAllNotification);
notificationRouter.delete("/delete/:id", auth, deleteNotification);
notificationRouter.patch("/:id/read", auth, markNotificationRead);
notificationRouter.patch("/read-all", auth, markAllNotificationRead);

export default notificationRouter;
