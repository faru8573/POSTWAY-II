import express from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import FriendController from "./friendship.controller.js";

const friendshipRouter = express.Router();
const friendController = new FriendController();

friendshipRouter.get("/get-friends/:userId", jwtAuth, (req, res) => {
  friendController.getUserFriends(req, res);
});

friendshipRouter.get("/get-pending-requests", jwtAuth, (req, res) => {
  friendController.getPendingRequest(req, res);
});

friendshipRouter.get("/toggle-friendship/:friendId", jwtAuth, (req, res) => {
  friendController.toggleFriendShip(req, res);
});

friendshipRouter.get("/response-to-request/:friendId", jwtAuth, (req, res) => {
  friendController.acceptRejectFriendship(req, res);
});

export default friendshipRouter;
