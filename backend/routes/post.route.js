import express from "express";
import {
  createPost,
  deletePost,
  getMyPosts,
  getFeedPosts,
  getUserPosts
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
postRouter.get("/feed", auth,getFeedPosts );
postRouter.get("/user/:id", auth, getUserPosts);


// postRouter.get("/comment/:id", auth, viewPosts);
// postRouter.get("/like/:id", auth, viewPosts);

postRouter.delete("/delete/:id", auth, deletePost);

export default postRouter;
