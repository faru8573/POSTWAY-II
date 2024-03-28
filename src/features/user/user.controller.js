import dotenv from "dotenv";
dotenv.config();
import ApplicationError from "../../error-handler/applicationError.js";
import UserRepository from "./user.repository.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import sharp from "sharp";
import path from "path";
export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async addUser(req, res) {
    console.log("add user function called");

    try {
      const result = await this.userRepository.addUser(req.body);
      return res.status(200).json({ status: "success", user: result });
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        return res
          .status(error.code)
          .json({ status: false, msg: error.message });
      } else {
        throw new ApplicationError(400, "something went wrong");
      }
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.userRepository.loginUser(email, password);
      console.log("controller user:", user);
      if (!user) {
        return res.status(400).send("Invalid credentials");
      } else {
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("jwtToken", token, { httpOnly: true });
        return res.status(200).json({ status: "success", token });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("jwtToken");
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDetails(req, res) {
    const userId = req.params.userId;
    try {
      const result = await this.userRepository.getUserDetails(userId);
      if (!result) {
        return res.status(404).json({ status: false, msg: "Invalid user" });
      }
      res.status(200).json({ status: "success", user: result });
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        return res
          .status(error.code)
          .json({ status: false, msg: error.message });
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async updateUserProfile(req, res) {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid user ID provided" });
    }
    try {
      const result = await this.userRepository.updateUserProfile(
        userId,
        req.body
      );
      if (!result) {
        return res.status(404).json({
          status: false,
          msg: "User not found!",
        });
      }

      res.status(200).json({ status: "success", user: result });
    } catch (error) {
      if (error instanceof ApplicationError) {
        return res
          .status(error.code)
          .json({ status: false, msg: error.message });
      } else {
        return res
          .status(500)
          .json({ status: false, msg: "Failed to update user profile" });
      }
    }
  }

  async avatarUpload(req, res) {
    console.log("req userId ", req.userId);
    const resizedImagePath = req.file.path;
    try {
      const resizedImagePathOutput = path.join(
        path.dirname(resizedImagePath),
        `${Date.now()}-resized${path.extname(resizedImagePath)}`
      );
      await sharp(resizedImagePath)
        .resize(320, 250)
        .toFile(resizedImagePathOutput);

      const avatarUrl = `/uploads/${path.basename(resizedImagePathOutput)}`;

      const userId = req.userId;
      if (!userId) {
        throw new ApplicationError(404, "user not found");
      }
      await this.userRepository.uploadUserAvatar(userId, avatarUrl);
      res.status(200).json({ status: "success", avatarUrl });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Failed to upload avatar" });
    }
  }
}
