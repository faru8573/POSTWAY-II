import mongoose from "mongoose";
const friendshipSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    dafault: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default friendshipSchema;
