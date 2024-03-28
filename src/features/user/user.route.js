import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
const userRouter = express.Router();
import UserController from "./user.controller.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const userController = new UserController();

userRouter.post("/signup", (req, res) => {
  userController.addUser(req, res);
});

userRouter.post("/signin", (req, res) => {
  userController.loginUser(req, res);
});

userRouter.get("/logout", userController.logout);

userRouter.get("/get-details/:userId", (req, res) => {
  userController.getDetails(req, res);
});

userRouter.put("/update-details/:userId", (req, res) => {
  userController.updateUserProfile(req, res);
});

userRouter.post("/upload", jwtAuth, upload.single("avatar"), (req, res) => {
  userController.avatarUpload(req, res);
});
export default userRouter;
