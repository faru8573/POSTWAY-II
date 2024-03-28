import express from "express";
import dotenv from "dotenv";
dotenv.config();

//----- import modules -----/////
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

/////----- import custom modules -----/////
import { connectUsingMongoose } from "./src/config/mongodb.js";
import ApplicationError from "./src/error-handler/applicationError.js";
import bodyParser from "body-parser";
const app = express();
const port = 8000;

/////----- middlewares -----/////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

////---- import routers ----/////
import userRouter from "./src/features/user/user.route.js";
import postRouter from "./src/features/post/post.route.js";
import commentRouter from "./src/features/comment/comment.router.js";
import likeRouter from "./src/features/like/like.router.js";
import friendshipRouter from "./src/features/friendship/friendship.router.js";
import otpRouter from "./src/features/otp/otp.router.js";
import loggerMiddleware from "./src/features/middlewares/logger.middleware.js";
loggerMiddleware;
/////----- path middleware ----////
app.use("/api/users", loggerMiddleware, userRouter);
app.use("/api/posts", loggerMiddleware, postRouter);
app.use("/api/comments", loggerMiddleware, commentRouter);
app.use("/api/likes", loggerMiddleware, likeRouter);
app.use("/api/friends", loggerMiddleware, friendshipRouter);

/////---- Additional features ----////
app.use("/api/otp", otpRouter);

/////----- default response -----/////
app.get("/", (req, res) => {
  res.send("Welcome to PostWay-II API");
});

/////----- custom error handler ----/////
app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  /////----- server error -----/////
  res.status(500).send("Something went wrong, please try later");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  connectUsingMongoose();
});
