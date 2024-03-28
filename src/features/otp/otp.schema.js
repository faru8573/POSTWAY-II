import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60,
  },
});

export default otpSchema;
