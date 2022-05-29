import express from "express";
import { RevenueController } from "../controllers/revenue.controller.js";


const RevenueRouter = express.Router()

RevenueRouter.get("/monthly", RevenueController.getMonthlyRevenue)

export { RevenueRouter };
