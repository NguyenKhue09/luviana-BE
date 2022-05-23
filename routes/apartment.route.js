import express from "express";
import { ApartmentController } from "../controllers/apartment.controller.js"

const ApartmentRouter = express.Router()

ApartmentRouter.get("/all", ApartmentController.getApartment)
ApartmentRouter.get("/all-by-page", ApartmentController.getApartmentByPage)
ApartmentRouter.get("/detail/:id", ApartmentController.getOneApartment)
ApartmentRouter.post("/add-new-apartment", ApartmentController.addNewApartment)
ApartmentRouter.put("/update", ApartmentController.updateApartment)

// admin
ApartmentRouter.get("/get-all-pending-apartment", ApartmentController.getAllPendingApartment)
ApartmentRouter.put("/confirm-pending-apartment", ApartmentController.confirmPendingApartment)
ApartmentRouter.delete("/remove-pending-apartment", ApartmentController.removePendingApartment)
ApartmentRouter.put("/delete-apartment", ApartmentController.deleteApartment)

export { ApartmentRouter };