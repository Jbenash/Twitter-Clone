import postModel from "../model/posts.model.js";
import notified from "../utils/createNotification.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";
import { getPosts } from "../utils/getPosts.js";
import userModel from "../model/user.model.js";
import mongoose from "mongoose";

const getMyPosts = async (req, res) => {
  try {
    return getPosts({ user: req.user._id }, res);
  } catch (error) {
    console.error("Error in getMyPosts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }
    return getPosts({ user: id }, res);
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("following");
    const users = [...user.following, user._id];

    return getPosts({ user: { $in: users } }, res);
  } catch (error) {
    console.error("Error in getFeedPosts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { content } = req.body;

    // Require at least text content OR an image
    const imageFile = req.files?.image?.[0];

    if (!content && !imageFile)
      return res
        .status(400)
        .json({ status: false, message: "content or image is required" });

    const newPost = { user: userId };
    if (content) newPost.content = content;

    //upload the image to the cloudinary
    if (imageFile) {
      const result = await uploadToCloudinary(
        imageFile.buffer,
        "twitter_clone/posts"
      );
      newPost.image = result.secure_url;
    }

    const post = await postModel.create(newPost);

    if (!post)
      return res
        .status(500)
        .json({ status: false, message: "Failed to create post in DB" });
    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    console.log("Delete request - Post ID:", postId, "User ID:", userId);

    // Validate ObjectId format
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }

    const post = await postModel.findById(postId);
    console.log("Post found:", post);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.user.toString() !== userId.toString())
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });

    if (post.image) {
      const publicId = post.image.split("/").slice(-1)[0].split(".")[0];
      console.log("Deleting image with public ID:", publicId);
      await cloudinary.uploader.destroy(`twitter_clone/posts/${publicId}`);
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePost:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const toggleLikeUnlike = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await postModel.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const liked = post.likes.some((id) => id.toString() === userId.toString());

    if (!liked) {
      post.likes.push(userId);
    } else {
      post.likes.pull(userId);
    }

    await post.save();

    if (post.user.toString() === userId.toString())
      await notified({
        from: userId,
        to: post.user,
        type: "like",
      });

    return res.status(200).json({
      success: true,
      message: liked ? "successfully unliked" : "successfully liked",
      liked: !liked,
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyLikedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    return getPosts({ likes: userId }, res);
  } catch (error) {
    console.error("Error in getMyLikedPosts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid userid" });

    return getPosts({ likes: userId }, res);
  } catch (error) {
    console.error("Error in getUserLikedPosts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPostComments = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await postModel
      .findById(postId)
      .populate("comments.user", "username profileImg");

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post is not available " });

    res.status(200).json({ success: true, comments: post.comments });
  } catch (error) {
    console.error("Error in getPostComment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId, commentId } = req.params;

    const post = await postModel.findById(postId);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post is not available " });

    const comment = post.comments.id(commentId); //.id() It is a Mongoose subdocument helper method which helps to find the id and fetch the comment

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment is not available " });

    const isCommentOwner = comment.user.toString() === userId.toString();
    const isPostOwner = post.user.toString() === userId.toString();

    if (!isCommentOwner && !isPostOwner)
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });

    comment.deleteOne();
    await post.save();

    return res
      .status(200)
      .json({ success: true, message: "comment deleted succesfully " });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim())
      return res
        .status(400)
        .json({ success: false, message: "Comment text is needed" });

    if (text.length > 280)
      return res
        .status(400)
        .json({ success: false, message: "Comment text is too long" });

    const post = await postModel.findById(postId);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post is not available " });

    post.comments.push({
      user: userId,
      text,
    });

    await post.save();

    if (post.user.toString() === userId.toString())
      await notified({
        from: userId,
        to: post.user,
        type: "comment",
      });

    return res
      .status(200)
      .json({ success: true, message: "Comment added succesfully" });
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  getMyPosts,
  getUserPosts,
  getFeedPosts,
  deletePost,
  createPost,
  toggleLikeUnlike,
  getMyLikedPosts,
  getUserLikedPosts,
  getPostComments,
  deleteComment,
  addComment,
};
