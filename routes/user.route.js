import express from "express";
import { UserController } from "../controllers/user.controller.js"
import upload from "../middlewares/upload.middleware.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";

const UserRouter = express.Router()

UserRouter
    .get("/", AuthMiddleWare.requireUser, UserController.getUser)
    .put("/", AuthMiddleWare.requireUser, UserController.updateUser)
UserRouter.post("/register", UserController.signUp)
UserRouter.post("/login", UserController.login)
UserRouter.post("/avatar", upload.single('avatar'), UserController.uploadAvatar)
UserRouter.get("/activate/:token", UserController.activate)
UserRouter.get("/refresh-token", UserController.getAccessToken)
UserRouter.post("/forgot-password", UserController.forgotPassword);
UserRouter.post("/reset-password", AuthMiddleWare.requireUser, UserController.resetPassword);
UserRouter.get("/user-list", AuthMiddleWare.requireAdmin, UserController.getUserList);
UserRouter.post("/add", AuthMiddleWare.requireAdmin, UserController.registerUser)
UserRouter.put("/update", AuthMiddleWare.requireAdmin, UserController.updateUserAdmin)
UserRouter.get("/get/:userId", UserController.getUserById);

export { UserRouter };