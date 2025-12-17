import express, { Router } from "express";
import {editProfile,profileInfo, toggleFollow,} from "../controller/user.controller.js";
import { getSuggestedUsers } from "../controller/user.controller.js";
import auth from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/profile/:username", auth, profileInfo);
userRouter.post(
  "/profile/update-profile",
  auth,
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  editProfile
);
userRouter.post("/profile/follow/:userId", auth, toggleFollow);
userRouter.get("/suggested", auth, getSuggestedUsers);

export default userRouter;
