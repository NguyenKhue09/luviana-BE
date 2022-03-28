import express from "express";
import { ApartmentController } from "../controllers/apartment.controller.js"

const ApartmentRouter = express.Router()

ApartmentRouter.get("/all", ApartmentController.getApartment)
ApartmentRouter.get("/detail/:id", ApartmentController.getOneApartment)
ApartmentRouter.post("/add-new-apartment", ApartmentController.addNewApartment)
ApartmentRouter.post("/add-new-apartmentv2", ApartmentController.addNewApartmentv2)
ApartmentRouter.put("/update", ApartmentController.updateApartment)

export { ApartmentRouter };