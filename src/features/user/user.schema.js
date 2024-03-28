import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: 8,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Agender"],
  },

  avatarUrl: String,
  loginTokens: [{ type: String }],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
