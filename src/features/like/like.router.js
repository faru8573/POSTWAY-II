// Routes for handling likes
import express from "express";
import LikeController from "./like.controller.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const likeRouter = express.Router();
const likeController = new LikeController();
// Get likes for a specific post or comment
likeRouter.get("/:id", (req, res) => {
  likeController.getLikes(req, res);
});

// Toggle like on a post or comment
likeRouter.get("/toggle/:id", jwtAuth, (req, res) => {
  likeController.toggleLike(req, res);
});
export default likeRouter;
