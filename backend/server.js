import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import connectDB from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";
import notificationRouter from "./routes/notification.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRouter);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
  connectDB();
});
