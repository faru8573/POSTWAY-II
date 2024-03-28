import mongoose from "mongoose";

import { postSchema } from "../post/post.schema.js";
import { commentSchema } from "../comment/comment.schema.js";

const PostModel = mongoose.model("Post", postSchema);
const CommentModel = mongoose.model("Comment", commentSchema);
export default class LikeRepo {
  async getLikes(itemId) {
    try {
      const post = await PostModel.findById(itemId);
      if (post) {
        return post.likes;
      }
      const comment = await CommentModel.findById(itemId);
      if (comment) {
        return comment.likes;
      }

      return [];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async toggleLike(itemId, itemType, userId) {
    let itemModel;
    try {
      if (itemType == "Comment") {
        itemModel = CommentModel;
      } else if (itemType == "Post") {
        itemModel = PostModel;
      } else {
        throw new Error("Item type is not correct");
      }

      const item = await itemModel.findById(itemId);
      console.log("item:::", item);

      if (!item) {
        throw new Error("Item not found");
      }

      const userLiked = await item.likes.includes(userId);
      if (userLiked) {
        item.likes = item.likes.filter((id) => id.toString() !== userId);
        await item.save();
        return false;
      } else {
        item.likes.push(userId);
        await item.save();
        return true;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
