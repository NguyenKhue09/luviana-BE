import express from "express";
import { UserController } from "../controllers/user.controller.js"
import User from "../models/user.model.js";

const UserRouter = express.Router()

UserRouter.get("/", UserController.getUser)
UserRouter.post("/register", UserController.registerUser)
UserRouter.post("/login", UserController.login)

export { UserRouter };