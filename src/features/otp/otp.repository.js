import mongoose from "mongoose";
import otpSchema from "./otp.schema.js";
import otpGenerator from "otp-generator";

import { sendMail } from "../../util/nodemailer-config.js";
import { userSchema } from "../user/user.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";
import HashingComparingPassword from "../../util/bcrypt-hashing.js";

const UserModel = mongoose.model("User", userSchema);
const OtpModel = mongoose.model("Otp", otpSchema);

export default class OtpRepo {
  async sendOtp(email) {
    try {
      const isUser = await UserModel.findOne({ email: email }); // Added 'await' here
      if (!isUser) {
        throw new ApplicationError(404, "User not found");
      }
      const generateOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        alphabets: false,
        specialChars: false,
      });

      const newOtp = new OtpModel({
        otp: generateOtp,
        user: email,
      });

      await newOtp.save();
      // sending otp to user
      sendMail(email, `Your OTP valid for one minute: ${generateOtp}`);
      return generateOtp;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(userOtp, userEmail) {
    try {
      const isUser = await UserModel.findOne({ email: userEmail });
      console.log("isUser", isUser);
      if (!isUser) {
        return false;
      }

      const otpRecord = await OtpModel.findOne({
        user: userEmail,
        otp: userOtp,
      });
      if (!otpRecord) {
        return false;
      }

      const otpExpirationDuration = 5 * 60 * 1000;
      if (otpRecord.createdAt.getTime() + otpExpirationDuration < Date.now()) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async resetPassword(email, newPassword) {
    try {
      const hashedPassword = await HashingComparingPassword.hasingPassword(
        newPassword
      );
      console.log("hashedPassword", hashedPassword);
      const user = await UserModel.findOne({ email: email });
      console.log("user", user);
      if (!user) {
        return false;
      }
      user.password = hashedPassword;
      sendMail(email, "password resetted");
      await user.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
