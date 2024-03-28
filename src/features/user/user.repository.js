import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";
import HashingComparingPassword from "../../util/bcrypt-hashing.js";

const UserModel = mongoose.model("User", userSchema);
export default class UserRepository {
  async addUser(user) {
    console.log("repository addUser called");
    const { name, email, password, gender } = user;
    try {
      // hashing password before save in db
      const hashedPassword = await HashingComparingPassword.hasingPassword(
        password
      );
      const isExistUser = await UserModel.find({ email: email });
      if (isExistUser.length > 0) {
        throw new ApplicationError(400, "User already exists");
      } else {
        const newUser = new UserModel({
          name,
          email,
          password: hashedPassword,
          gender,
        });
        await newUser.save();
        return newUser;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const recordUser = await this.findByEmail(email);
      console.log("recordUser:", recordUser);
      const isValidPassword = await HashingComparingPassword.comparingPassword(
        password,
        recordUser.password
      );
      console.log("isValidPassword:", isValidPassword);
      if (!isValidPassword) {
        throw new ApplicationError(400, "incorrect password");
      }
      const user = UserModel.findOne({ email });
      if (!user) {
        throw new ApplicationError(400, "User not found");
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.log(error);
      throw new ApplicationError(500, "Something went wrong with database");
    }
  }

  async getUserDetails(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new ApplicationError(400, "User not found");
      }
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUserProfile(userId, content) {
    try {
      const user = await UserModel.findOneAndUpdate({ _id: userId }, content, {
        new: true,
      });

      if (!user) {
        throw new ApplicationError(400, "User not found");
      }
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async uploadUserAvatar(userId, avatarUrl) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { avatarUrl: avatarUrl },
        { new: true }
      );
      console.log("Updated user:", user);
      if (!user) {
        throw new ApplicationError(404, "User not found");
      }

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
