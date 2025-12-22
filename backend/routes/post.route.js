import express from "express";
import {
  createPost,
  deletePost,
  getMyPosts,
  getFeedPosts,
  getUserPosts,
  toggleLikeUnlike,
  postComment,
} from "../controller/posts.controller.js";
import auth from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const postRouter = express.Router();

postRouter.get("/my-posts", auth, getMyPosts);
postRouter.post(
  "/create",
  auth,
  upload.fields([{ name: "image" }]),
  createPost
);
postRouter.get("/feed", auth, getFeedPosts);
postRouter.get("/user/:id", auth, getUserPosts);

postRouter.get("/:id/comment", auth, postComment);
postRouter.get("/:id/like", auth, toggleLikeUnlike);

postRouter.delete("/delete/:id", auth, deletePost);

export default postRouter;
