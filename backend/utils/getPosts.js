import postModel from "../model/posts.model.js";

export const getPosts = async (filter, res) => {
  try {
    const posts = await postModel
      .find(filter)
      .sort({ createAt: -1 })
      .populate("user", "username profileImg")
      .populate("comments.user", "username,profileImg");
    if (posts.length == 0)
      return res
        .status(400)
        .json({ success: false, message: "NO posts available " });
    return res.status(200).json({ success: false, posts });
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
