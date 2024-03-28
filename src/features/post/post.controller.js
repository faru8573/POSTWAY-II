import sharp from "sharp";
import fs from "fs";
import ApplicationError from "../../error-handler/applicationError.js";
import PostRepository from "./post.repository.js";
import path from "path";

export default class PostController {
  constructor() {
    this.postRepo = new PostRepository();
  }

  async addPost(req, res) {
    try {
      let reqfilePath = "";
      if (req.file && req.file.path) {
        reqfilePath = req.file.path;
      }

      const userId = req.userId;
      console.log("userId", userId);
      if (!userId) {
        return res.status(401).json({ status: false, msg: "Unauthorized" });
      }
      const result = await this.postRepo.createPost(
        userId,
        reqfilePath,
        req.body
      );
      if (!result) {
        return res.status(500).send("Something went wrong");
      }
      return res.status(201).json({ status: "success", post: result });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOnePost(req, res) {
    const postId = req.params.postId;
    try {
      const result = await this.postRepo.getPostById(postId);
      if (!result) {
        return res.status(500).send("Something went wrong");
      }

      return res.status(200).json({ status: "success", post: result });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPosts(req, res) {
    const userId = req.userId;
    console.log("userId:", userId);
    try {
      const result = await this.postRepo.getUserPosts(userId);
      return res.status(200).json({ status: "success", posts: result });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ status: "error", message: error.message });
    }
  }

  async getAllPosts(req, res) {
    try {
      const result = await this.postRepo.getAllPost();
      if (!result) {
        return res.status(500).send("Something went wrong");
      }
      return res.status(200).json({ status: "success", posts: result });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deletePost(req, res) {
    const postId = req.params.postId;
    const userId = req.userId;
    console.log("delete post controller called");
    try {
      const result = await this.postRepo.deletePost(userId, postId);
      if (!result) {
        return res.status(500).send("Something went wrong");
      }
      return res.status(200).json({ status: "success" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this post",
      });
    }
  }

  async updatePost(req, res) {
    const postId = req.params.postId;
    console.log("req file", req.file);
    console.log("req body", req.body);

    try {
      let imageUrl = "";
      if (req.file && req.file.path) {
        imageUrl = req.file.path;
      }
      let content = { imageUrl: imageUrl, caption: req.body.caption };
      const result = await this.postRepo.updatePost(postId, content);
      if (!result) {
        return res.status(500).send("Something went wrong");
      }

      return res.status(200).json({ status: "success", post: result });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
