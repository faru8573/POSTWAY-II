import FriendRepository from "./friendship.repository.js";
export default class FriendController {
  constructor() {
    this.friendRepo = new FriendRepository();
  }

  async getUserFriends(req, res) {
    const userId = req.params.userId;
    try {
      const friends = await this.friendRepo.getUserFriends(userId);
      if (!friends) {
        return res
          .status(404)
          .json({ status: "success", msg: "No friends found" });
      }
      return res.status(200).json({ status: "success", friends: friends });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async getPendingRequest(req, res) {
    try {
      const pendingReq = await this.friendRepo.pendingRequest();
      if (!pendingReq) {
        return res
          .status(404)
          .json({ status: "success", msg: "No friends request is pending" });
      }
      return res
        .status(200)
        .json({ status: "success", pendingRequest: pendingReq });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async toggleFriendShip(req, res) {
    const friendId = req.params.friendId;
    const userId = req.userId;
    console.log("userId::--", userId);
    try {
      if (userId == friendId) {
        return res
          .status(200)
          .json({ status: "Error", msg: "Cannot send request to self" });
      }
      const result = await this.friendRepo.toggleFriendship(userId, friendId);
      const message = result ? "Friend request sent" : "User unfriended";
      return res.status(200).json({ status: "success", message });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ errors: error });
    }
  }

  async acceptRejectFriendship(req, res) {
    const friendId = req.params.friendId;
    const userId = req.userId;
    const action = "accept";
    try {
      const result = await this.friendRepo.respondToFriendRequest(
        userId,
        friendId,
        action
      );
      const message = result ? "Request accepted" : "Request rejected";
      return res.status(200).json({ status: "success", message });
    } catch (error) {
      console.log("Error responding to friend request:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
}
