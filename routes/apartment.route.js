import express from "express";
import { ApartmentController } from "../controllers/apartment.controller.js"
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";

const ApartmentRouter = express.Router()

ApartmentRouter.get("/all", ApartmentController.getApartment)
ApartmentRouter.get("/all-by-page", ApartmentController.getApartmentByPage)
ApartmentRouter.get("/detail/:id", ApartmentController.getOneApartment)
ApartmentRouter.post("/add-new-apartment", ApartmentController.addNewApartment)
ApartmentRouter.put("/update", ApartmentController.updateApartment)
ApartmentRouter.get("/apartment-cites", ApartmentController.getApartmentCities)

// admin
ApartmentRouter.get("/get-all-pending-apartment", AuthMiddleWare.requireAdmin, ApartmentController.getAllPendingApartment)
ApartmentRouter.put("/confirm-pending-apartment", AuthMiddleWare.requireAdmin, ApartmentController.confirmPendingApartment)
ApartmentRouter.delete("/remove-pending-apartment", AuthMiddleWare.requireAdmin, ApartmentController.removePendingApartment)
ApartmentRouter.put("/delete-apartment", AuthMiddleWare.requireAdmin, ApartmentController.deleteApartment)

export { ApartmentRouter };