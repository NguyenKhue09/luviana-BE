import express from "express";
import { UserController } from "../controllers/user.controller.js"
import upload from "../middlewares/upload.middleware.js";

const UserRouter = express.Router()

UserRouter.get("/", UserController.getUser)
UserRouter.post("/register", UserController.signUp)
UserRouter.post("/login", UserController.login)
UserRouter.post("/avatar", upload.single('avatar'), UserController.uploadAvatar)
UserRouter.get("/activate/:token", UserController.activate)

export { UserRouter };