import express from "express";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { AdminController } from "../controllers/admin.controller.js";
import { UserController } from "../controllers/user.controller.js"

const AdminRouter = express.Router()

AdminRouter
    .get('/', AuthMiddleWare.requireAdmin, AdminController.getAdmin)
    .put('/', AuthMiddleWare.requireAdmin, AdminController.updateAdmin)

AdminRouter
    .get('/user', AuthMiddleWare.requireAdmin, UserController.getUser)

AdminRouter.post("/login-admin-account", AdminController.loginAdminAccount)
AdminRouter.post("/create-admin-account", AdminController.crateAdminAccount)
AdminRouter.get("/get-admin-accesstoken", AdminController.getAccessToken)

export { AdminRouter };