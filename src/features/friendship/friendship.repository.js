import mongoose from "mongoose";
import { userSchema } from "../user/user.schema.js";
import friendshipSchema from "./friendship.schema.js";

const UserModel = mongoose.model("User", userSchema);
const FriendshipModel = mongoose.model("Friendship", friendshipSchema);

export default class FriendRepository {
  async getUserFriends(userId) {
    try {
      // Find all friendships where the user is the sender or receiver
      const friends = FriendshipModel.find({
        $or: [{ sender: userId }, { receiver: userId }],
      });
      // Extracting Friend IDs:
      const friendIds = (await friends).map((friendship) => {
        return friendship.sender.equals(userId)
          ? friendship.receiver
          : friendship.sender;
      });

      // Find the user documents corresponding to the friend IDs
      const userFriends = await UserModel.find({ _id: { $in: friendIds } });
      return userFriends;
    } catch (error) {
      throw error;
    }
  }

  async pendingRequest() {
    try {
      const pendingRequests = await FriendshipModel.find({ status: "pending" });
      return pendingRequests;
    } catch (error) {
      throw error;
    }
  }

  async toggleFriendship(userId, friendId) {
    try {
      const friendship = await FriendshipModel.findOne({
        sender: userId,
        receiver: friendId,
      });

      if (!friendship) {
        const newFriend = await FriendshipModel.create({
          receiver: friendId,
          sender: userId,
          status: "pending",
        });
        console.log("new friend", newFriend);

        return true;
      } else {
        await FriendshipModel.deleteOne({ _id: friendship._id });

        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async respondToFriendRequest(userId, friendId, action) {
    console.log("userId->", userId, "friendId", friendId);
    try {
      const friendship = await FriendshipModel.findOne({
        sender: friendId,
        receiver: userId,
      });

      console.log("friendship", friendship);
      // Check if the friendship exists and is in pending state
      if (!friendship || friendship.status !== "pending") {
        throw new Error("Friend request not found or already responded");
      }

      // If the action is to accept the friend request
      if (action === "accept") {
        // Update the status of the friendship to "accepted"
        friendship.status = "accepted";
        const user = await UserModel.findById(userId);
        user.friends.push(friendId);
        await user.save();

        await friendship.save();

        return true;
      }
      // If the action is to reject the friend request
      else if (action === "reject") {
        await FriendshipModel.deleteOne({ _id: friendship._id });

        return false;
      } else {
        throw new Error("Invalid action");
      }
    } catch (error) {
      throw error;
    }
  }
}
