import CommentRepository from "./comment.repository.js";

export default class CommentController {
  constructor() {
    this.CommentRepository = new CommentRepository();
  }
  async getComments(req, res) {
    console.log("getComments function called");
    const postId = req.params.postId;
    try {
      const result = await this.CommentRepository.getComments(postId);
      if (!result) {
        return res
          .status(404)
          .json({ status: "error", message: "Comments not found" });
      }
      return res.status(200).json({ status: "success", comments: result });
    } catch (error) {
      console.error("Error getting comment:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async addComments(req, res) {
    const postId = req.params.postId;
    const userId = req.userId;
    const { content } = req.body;
    try {
      const result = await this.CommentRepository.addComment(
        userId,
        content,
        postId
      );
      return res.status(201).json({ status: "success", comment: result });
    } catch (error) {
      console.error("Error adding comment:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async updateComment(req, res) {
    console.log("userId on controller", req.userId);
    const commentId = req.params.commentId;
    const { content } = req.body;
    const userId = req.userId;
    console.log("log:", commentId, content);

    try {
      const result = await this.CommentRepository.updateComment(
        userId,
        commentId,
        content
      );
      if (!result) {
        return res
          .status(404)
          .json({ status: "error", message: "Comment not found" });
      }
      return res
        .status(200)
        .json({ status: "success", updatedComment: result });
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(401).json({ error });
    }
  }

  async deleteComment(req, res) {
    const commentId = req.params.commentId;
    const userId = req.userId;

    try {
      const result = await this.CommentRepository.deleteComment(
        userId,
        commentId
      );
      if (!result) {
        return res
          .status(404)
          .json({ status: "error", message: "Comment not found" });
      }
      return res
        .status(200)
        .json({ status: "success", updatedComment: result });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
}
