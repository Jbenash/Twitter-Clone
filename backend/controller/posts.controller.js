import postModel from "../model/posts.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

const viewPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await postModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    if (posts.length === 0)
      return res
        .status(200)
        .json({ success: false, message: "posts not found" });
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error in viewPosts:", error);
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

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePosts = async (req, res) => {
  try {
    // code here
  } catch (error) {
    console.error(error);
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
    console.error("Error details:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { updatePosts, viewPosts, deletePost, createPost };
