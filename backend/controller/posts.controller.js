import postModel from "../model/posts.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const viewPosts = async (req, res) => {
  try {
    // code here
  } catch (error) {
    console.error(error);
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

const deletePosts = async (req, res) => {
  try {
    // code here
  } catch (error) {
    console.error(error);
  }
};

export { updatePosts, viewPosts, deletePosts, createPost };
