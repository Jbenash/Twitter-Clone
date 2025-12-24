import notificationsModel from "../model/notifications.model.js";

const notified = async ({ from, to, type, postId = null }) => {

  await notificationsModel.create({
    from,
    to,
    type,
    postId,
  });
};

export default notified;
