import express from "express";
import {
  createPost,
  deletePost,
  updatePosts,
  viewPosts,
} from "../controller/posts.controller.js";
import auth from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const postRouter = express.Router();

postRouter.get("/my-posts", auth, viewPosts);
postRouter.post(
  "/create",
  auth,
  upload.fields([{ name: "image" }]),
  createPost
);

postRouter.get("/:id", auth, viewPosts);
postRouter.get("/comment/:id", auth, viewPosts);
postRouter.get("/like/:id", auth, viewPosts);

postRouter.post("/update", auth, updatePosts);
postRouter.delete("/delete/:id", auth, deletePost);

export default postRouter;
