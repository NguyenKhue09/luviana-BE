import express from "express";
import { ApartmentController } from "../controllers/apartment.controller.js"

const ApartmentRouter = express.Router()

ApartmentRouter.get("/all", ApartmentController.getApartment)
ApartmentRouter.post("/add-new-apartment", ApartmentController.addNewApartment)
ApartmentRouter.post("/add-new-apartmentv2", ApartmentController.addNewApartmentv2)

export { ApartmentRouter };