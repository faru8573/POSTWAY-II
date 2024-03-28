import express from "express";
import PostController from "./post.controller.js";
import upload from "../middlewares/fileUpload.middleware.js";
import jwtAuth from "../middlewares/jwtAuth.js";
const postRouter = express.Router();
const postController = new PostController();

postRouter.post("/", jwtAuth, upload.single("imageUrl"), (req, res) => {
  postController.addPost(req, res);
});

postRouter.get("/", jwtAuth, (req, res) => {
  postController.getPosts(req, res);
});

postRouter.get("/all", jwtAuth, (req, res) => {
  postController.getAllPosts(req, res);
});
postRouter.get("/:postId", (req, res) => {
  postController.getOnePost(req, res);
});

postRouter.delete("/:postId", jwtAuth, (req, res) => {
  postController.deletePost(req, res);
});

postRouter.put("/:postId", jwtAuth, upload.single("imageUrl"), (req, res) => {
  postController.updatePost(req, res);
});

export default postRouter;
