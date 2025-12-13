import notificationsModel from "../model/notifications.model.js";

const notified = async ({ from, to, type, postId = null }) => {
    if (from.toString() === to.toString()) return

     await notificationsModel.create({
        from,
        to,
        type,
        postId
    })
}

export default notified