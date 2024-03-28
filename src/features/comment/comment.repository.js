import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { postSchema } from "../post/post.schema.js";

const CommentModel = mongoose.model("Comment", commentSchema);
const PostModel = mongoose.model("Post", postSchema);

export default class CommentRepository {
  async getComments(postId) {
    try {
      const post = await PostModel.findOne({ _id: postId }).populate(
        "comments"
      );
      console.log("post:", post);
      const comments = post.comments;
      return comments;
    } catch (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
  }

  async addComment(userId, content, postId) {
    try {
      const newComment = new CommentModel({
        content: content,
        user: userId,
        post: postId,
      });

      // Save the new comment
      const savedComment = await newComment.save();

      // Find the corresponding post and update its comments array
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { $push: { comments: savedComment._id } },
        { new: true }
      );

      return savedComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }

  async deleteComment(userId, commentId) {
    try {
      const comment = await CommentModel.findById({ _id: commentId });
      if (!comment) {
        throw new Error("Comment not found");
      }
      console.log("comment", comment);
      console.log(" user", userId);
      console.log("Comment owner", comment.user);
      const commentOwner = comment.user;
      if (userId === commentOwner.toString()) {
        await comment.deleteOne({ _id: commentId });
        return true;
      } else {
        throw {
          status: false,
          message: "Not authorized to delete the comment",
        };
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }

  async updateComment(userId, commentId, updateData) {
    try {
      const comment = await CommentModel.findById(commentId);
      console.log("comment", comment);
      console.log("comment ka author in repo", comment.user);
      const commentOwner = comment.user;
      if (userId === commentOwner.toString()) {
        comment.content = updateData;
        await comment.save();
        return comment;
      } else {
        throw {
          success: false,
          message: "Not authorized to update the comment",
        };
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  }
}
