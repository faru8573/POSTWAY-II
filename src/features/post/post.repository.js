import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
const { ObjectId } = mongoose;

const PostModel = mongoose.model("Post", postSchema);

export default class PostRepository {
  async createPost(userId, imageUrl, content) {
    const { caption } = content;
    try {
      const newPost = new PostModel({ imageUrl, caption, author: userId });
      await newPost.save();
      return newPost;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPostById(postId) {
    try {
      return await PostModel.findById(postId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllPost() {
    try {
      return await PostModel.find();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUserPosts(userId) {
    try {
      const posts = await PostModel.find({ author: userId });
      if (!posts || posts.length === 0) {
        throw new Error("No posts found");
      }
      return posts;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deletePost(userId, postId) {
    console.log("delete post repository called");
    try {
      const post = await PostModel.findOne({
        _id: postId,
        author: userId,
      });
      console.log("delete post", post);
      if (!post) {
        throw new Error("Post not found");
      }

      const deletedPost = await PostModel.deleteOne({ _id: postId });
      console.log("deleted post", deletedPost);
      if (!deletedPost) {
        throw new Error("Post not found");
      }

      return deletedPost;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updatePost(postId, content) {
    console.log("update post repository called");
    const { caption, imageUrl } = content;
    try {
      const post = await PostModel.findById(postId);
      console.log("updated post", post);
      post.caption = caption;
      post.imageUrl = imageUrl;
      await post.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
