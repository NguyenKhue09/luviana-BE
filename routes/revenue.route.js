import express from "express";
import { RevenueController } from "../controllers/revenue.controller.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";


const RevenueRouter = express.Router()

RevenueRouter.get("/monthly", AuthMiddleWare.requireAdmin, RevenueController.getMonthlyRevenue)
RevenueRouter.get("/yearly", AuthMiddleWare.requireAdmin, RevenueController.getYearlyRevenue)
RevenueRouter.get("/all-yearly", AuthMiddleWare.requireAdmin, RevenueController.getAllYearlyRevenue)

export { RevenueRouter };
