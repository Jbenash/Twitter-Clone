import express from "express";
import {
  createPost,
  deletePost,
  getMyPosts,
  getFeedPosts,
  getUserPosts,
  toggleLikeUnlike,
  getPostComments,
  addComment,
  deleteComment,
  likedMyPosts,
  likedUserPosts,
} from "../controller/posts.controller.js";
import auth from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const postRouter = express.Router();
//:id refers to postId
postRouter.get("/my-posts", auth, getMyPosts);
postRouter.post(
  "/create",
  auth,
  upload.fields([{ name: "image" }]),
  createPost
);
postRouter.get("/feed", auth, getFeedPosts);
postRouter.get("/user/:id", auth, getUserPosts);

postRouter.get("/:id/comment", auth, getPostComments);
postRouter.delete("/:id/comment/:commentId", auth, deleteComment);
postRouter.post("/:id/comment", auth, addComment);

postRouter.get("/:id/like", auth, toggleLikeUnlike);
postRouter.get("/likes/me", auth, likedMyPosts);
postRouter.get("/likes/:userId", auth, likedUserPosts);

postRouter.delete("/delete/:id", auth, deletePost);

export default postRouter;
