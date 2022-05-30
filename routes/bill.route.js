import { BillController } from "../controllers/bill.controller.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import express from "express";

const BillRouter = express.Router()

BillRouter.post("/create-bill", AuthMiddleWare.requireUser, BillController.createBill)

export { BillRouter };