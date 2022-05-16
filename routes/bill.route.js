import { BillController } from "../controllers/bill.controller.js";
import express from "express";

const BillRouter = express.Router()

BillRouter.post("/create-bill", BillController.createBill)

export { BillRouter };