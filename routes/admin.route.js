import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { AdminController } from "../controllers/admin.controller.js";
import { UserController } from "../controllers/user.controller.js"

const AdminRouter = express.Router()

AdminRouter
    .get('/', AuthMiddleWare.requireAdmin, AdminController.getAdmin)
    .put('/', AuthMiddleWare.requireAdmin, AdminController.updateAdmin)

AdminRouter
    .get('/user', AuthMiddleWare.requireAdmin, UserController.getUser)
