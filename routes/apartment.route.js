import express from "express";
import { ApartmentController } from "../controllers/apartment.controller.js"
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";

const ApartmentRouter = express.Router()


ApartmentRouter.get("/all-by-page", ApartmentController.getApartmentByPage)
ApartmentRouter.get("/detail/:id", ApartmentController.getOneApartment)
ApartmentRouter.post("/add-new-apartment", ApartmentController.addNewApartment)
ApartmentRouter.put("/update", ApartmentController.updateApartment)
ApartmentRouter.get("/apartment-cites", ApartmentController.getApartmentCities)
ApartmentRouter.route("/review")
    .post(AuthMiddleWare.requireUser, ApartmentController.addReview)
    .get(ApartmentController.getReviews)
ApartmentRouter.get("/avg-rating/:id", ApartmentController.getAvgRating)
ApartmentRouter.get("/apartment-of-user", AuthMiddleWare.requireUser, ApartmentController.getApartmentOfUser)
ApartmentRouter.put("/delete-user-apartment", AuthMiddleWare.requireUser, ApartmentController.deleteApartment)
ApartmentRouter.put("/activate-user-apartment", AuthMiddleWare.requireUser, ApartmentController.activateDisableApartment)

// admin
ApartmentRouter.get("/all", AuthMiddleWare.requireAdmin, ApartmentController.getApartment)
ApartmentRouter.get("/get-all-pending-apartment", AuthMiddleWare.requireAdmin, ApartmentController.getAllPendingApartment)
ApartmentRouter.put("/confirm-pending-apartment", AuthMiddleWare.requireAdmin, ApartmentController.confirmPendingApartment)
ApartmentRouter.delete("/remove-pending-apartment", AuthMiddleWare.requireAdmin, ApartmentController.removePendingApartment)
ApartmentRouter.put("/delete-apartment", AuthMiddleWare.requireAdmin, ApartmentController.deleteApartment)
ApartmentRouter.put("/activate-admin-apartment", AuthMiddleWare.requireAdmin, ApartmentController.activateDisableApartment)

export { ApartmentRouter };