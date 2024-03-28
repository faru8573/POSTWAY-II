import express from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import CommentController from "./comment.controller.js";
const commentRouter = express.Router();
const commentController = new CommentController();

commentRouter.get("/:postId", jwtAuth, (req, res) => {
  commentController.getComments(req, res);
});

commentRouter.post("/:postId", jwtAuth, (req, res) => {
  commentController.addComments(req, res);
});

commentRouter.put("/:commentId", jwtAuth, (req, res) => {
  commentController.updateComment(req, res);
});

commentRouter.delete("/:commentId", jwtAuth, (req, res) => {
  commentController.deleteComment(req, res);
});

export default commentRouter;
