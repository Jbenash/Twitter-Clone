import postModel from "../model/posts.model.js";

export const getPosts = async (filter, res) => {
  try {
    const posts = await postModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "username fullname profileImg")
      .populate("comments.user", "username fullname profileImg");
    if (posts.length == 0)
      return res.status(200).json({ success: true, posts: [] });
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
