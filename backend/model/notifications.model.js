import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['follow', 'like', 'comment', 'retweet'],
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",

    },
    isRead: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })


const notificationModel = mongoose.model("Notification", notificationSchema)

export default notificationModel